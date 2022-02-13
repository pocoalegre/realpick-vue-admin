<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入商品编号" v-model="queryProductId" @keyup.enter.native="getProductParamList" clearable
                    @clear="getProductParamList">
            <el-button slot="append" icon="el-icon-search" @click="getProductParamList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加商品参数</el-button>
        </el-col>
      </el-row>
      <!-- 商品参数列表 -->
      <el-table :data="productParamList" border stripe>
        <el-table-column label="编号" prop="paramId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="商品编号" prop="productId"></el-table-column>
        <el-table-column label="参数属性" prop="paramKey"></el-table-column>
        <el-table-column label="参数值" prop="paramValue"></el-table-column>
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
                       @click="showModifyDialog(scope.row.paramId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium"
                       @click="deleteProductParamById(scope.row.paramId)"></el-button>
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
    <!-- 添加商品参数对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息添加 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="el-form-block" size="medium">
        <!-- 商品参数信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="addForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="参数属性" prop="paramKey">
          <el-input v-model="addForm.paramKey"></el-input>
        </el-form-item>
        <el-form-item label="参数属性值" prop="paramValue">
          <el-input v-model="addForm.paramValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="addProductParam">确 定</el-button>
        <el-button size="medium" @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品参数对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px"
               class="el-form-block" size="medium">
        <!-- 商品参数信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="modifyForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="参数属性" prop="paramKey">
          <el-input v-model="modifyForm.paramKey"></el-input>
        </el-form-item>
        <el-form-item label="参数属性值" prop="paramValue">
          <el-input v-model="modifyForm.paramValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="modifyProductParam">确 定</el-button>
        <el-button size="medium" @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductParam",
  created() {
    this.getProductParamList()
  },
  data() {
    return {
      //商品列表
      productParamList: [],
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
        paramId: '',
        productId: '',
        paramKey: '',
        paramValue: '',
      },
      //添加表单
      addForm: {
        productId: '',
        paramKey: '',
        paramValue: '',
      },
      //修改规则
      modifyFormRules: {
        productId: [
          {required: true, message: '请输入商品编号！', trigger: 'blur'},
          {validator: this.checkRules.checkId, trigger: 'blur'}
        ],
        paramKey: [
          {required: true, message: '请输入参数属性！', trigger: 'blur'},
        ],
        paramValue: [
          {required: true, message: '请输入参数值！', trigger: 'blur'},
        ]
      },
      //添加规则
      addFormRules: {
        productId: [
          {required: true, message: '请输入商品编号！', trigger: 'blur'},
          {validator: this.checkRules.checkId, trigger: 'blur'}
        ],
        paramKey: [
          {required: true, message: '请输入参数属性！', trigger: 'blur'},
        ],
        paramValue: [
          {required: true, message: '请输入参数值！', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    //商品参数列表
    getProductParamList() {
      const that = this
      axios({
        method: 'get',
        url: 'productParam/list',
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
          that.productParamList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条商品参数
    getProductParam(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productParam/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.modifyForm.productId = res.data.data.productId
          that.modifyForm.paramKey = res.data.data.paramKey
          that.modifyForm.paramValue = res.data.data.paramValue
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getProductParamList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getProductParamList()
    },
    //删除商品参数
    deleteProductParamById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'productParam/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getProductParamList()
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
      this.modifyForm.paramId = id
      this.getProductParam(id)
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
    //添加商品参数
    addProductParam() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: '/productParam/add',
            data: {
              productId: that.addForm.productId,
              paramKey: that.addForm.paramKey,
              paramValue: that.addForm.paramValue,
            },
            headers: {
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getProductParamList()
              //提示修改成功
              that.$message.success(res.data.msg)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //修改商品参数
    modifyProductParam() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/productParam/modify',
            data: {
              paramId: that.modifyForm.paramId,
              productId: that.modifyForm.productId,
              paramKey: that.modifyForm.paramKey,
              paramValue: that.modifyForm.paramValue,
            },
            headers: {
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getProductParamList()
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
.el-form-block {
  margin-top: 20px;
}
</style>