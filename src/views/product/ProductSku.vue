<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品sku管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入商品编号" v-model="queryProductId" @keyup.enter.native="getProductSkuList" clearable
                    @clear="getProductSkuList">
            <el-button slot="append" icon="el-icon-search" @click="getProductSkuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加商品sku</el-button>
        </el-col>
      </el-row>
      <!-- 商品sku列表 -->
      <el-table :data="productSkuList" border stripe>
        <el-table-column label="编号" prop="skuId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="商品编号" prop="productId"></el-table-column>
        <el-table-column label="商品尺寸" prop="skuSize"></el-table-column>
        <el-table-column label="商品颜色" prop="skuColor"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updateTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="143px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium"
                       @click="showModifyDialog(scope.row.skuId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium"
                       @click="deleteProductSkuById(scope.row.skuId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品sku对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息添加 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="el-form-block" size="medium">
        <!-- 商品sku信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="addForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品尺寸" prop="skuSize">
          <el-input v-model="addForm.skuSize"></el-input>
        </el-form-item>
        <el-form-item label="商品颜色" prop="skuColor">
          <el-input v-model="addForm.skuColor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="addProductSku">确 定</el-button>
        <el-button size="medium" @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品sku对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px"
               class="el-form-block" size="medium">
        <!-- 商品sku信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="modifyForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品尺寸" prop="skuSize">
          <el-input v-model="modifyForm.skuSize"></el-input>
        </el-form-item>
        <el-form-item label="商品颜色" prop="skuColor">
          <el-input v-model="modifyForm.skuColor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="modifyProductSku">确 定</el-button>
        <el-button size="medium" @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductSku",
  created() {
    this.getProductSkuList()
  },
  data() {
    return {
      //商品列表
      productSkuList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
      //查询商品id
      queryProductId: '',
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        skuId: '',
        productId: '',
        skuSize: '',
        skuColor: ''
      },
      //添加表单
      addForm: {
        productId: '',
        skuSize: '',
        skuColor: ''
      },
      //修改规则
      modifyFormRules: {
        productId: [
          {required: true, message: '请输入商品编号！', trigger: 'blur'},
          {validator: this.checkRules.checkId, trigger: 'blur'}
        ],
        skuSize: [
          {required: true, message: '请输入商品尺寸！', trigger: 'blur'}
        ],
        skuColor: [
          {required: true, message: '请输入商品颜色！', trigger: 'blur'}
        ]
      },
      //添加规则
      addFormRules: {
        productId: [
          {required: true, message: '请输入商品编号！', trigger: 'blur'},
          {validator: this.checkRules.checkId, trigger: 'blur'}
        ],
        skuSize: [
          {required: true, message: '请输入商品尺寸！', trigger: 'blur'},
        ],
        skuColor: [
          {required: true, message: '请输入商品颜色！', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    //商品sku列表
    getProductSkuList() {
      const that = this
      axios({
        method: 'get',
        url: 'productSku/list',
        params: {
          queryProductId: this.queryProductId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.productSkuList = res.data.data.list
          that.total = res.data.data.total
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条商品sku
    getProductSku(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productSku/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.modifyForm.productId = res.data.data.productId
          that.modifyForm.skuSize = res.data.data.skuSize
          that.modifyForm.skuColor = res.data.data.skuColor
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getProductSkuList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getProductSkuList()
    },
    //删除商品sku
    deleteProductSkuById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'productSku/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getProductSkuList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //展示添加商品参数信息对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    //展示修改商品参数信息对话框
    showModifyDialog(id) {
      this.modifyForm.skuId = id
      this.getProductSku(id)
      this.modifyDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      this.$refs.modifyFormRef.resetFields()
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //取消添加
    cancelAdd() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    //取消修改
    cancelModify() {
      this.modifyDialogVisible = false
    },
    //添加商品sku
    addProductSku() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: '/productSku/add',
            data: {
              productId: that.addForm.productId,
              skuSize: that.addForm.skuSize,
              skuColor: that.addForm.skuColor
            },
            headers: {
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getProductSkuList()
              //提示修改成功
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //修改商品sku
    modifyProductSku() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/productSku/modify',
            data: {
              skuId: that.modifyForm.skuId,
              productId: that.modifyForm.productId,
              skuSize: that.modifyForm.skuSize,
              skuColor: that.modifyForm.skuColor
            },
            headers: {
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getProductSkuList()
              //提示修改成功
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.el-form-block {
  margin-top: 20px;
}
</style>