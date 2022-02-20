<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理</el-breadcrumb-item>
      <el-breadcrumb-item>Banner管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="queryType" placeholder="请选择banner类型" clearable @clear="getBannerList"
                     @change="getBannerList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="show-add-dialog">
          <el-button type="primary" @click="showAddDialog">添加banner图</el-button>
        </el-col>
      </el-row>
      <!-- Banner列表 -->
      <el-table :data="bannerList" border stripe>
        <el-table-column label="编号" prop="bannerId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="banner图片">
          <template slot-scope="scope">
            <img :src="bannerImg + scope.row.bannerImg" @click="showImg($event)">
          </template>
        </el-table-column>
        <el-table-column label="banner顺序" prop="bannerSeq"></el-table-column>
        <el-table-column label="banner类型">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.bannerType | bannerType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" prop="productId"></el-table-column>
        <el-table-column label="商品类型编号" prop="categoryId"></el-table-column>
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
                       @click="showModifyDialog(scope.row.bannerId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium"
                       @click="deleteBannerById(scope.row.bannerId)"></el-button>
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
    <!-- 添加banner对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 添加信息 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" size="medium">
        <!-- banner图片 -->
        <el-form-item label="banner图片" class="banner-img">
          <img :src="base64Img?base64Img:defaultBannerImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <!-- banner图片信息 -->
        <el-form-item label="banner顺序" prop="bannerSeq">
          <el-select v-model="addForm.bannerSeq" placeholder="请选择">
            <el-option
                v-for="item in seqOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner类型" prop="bannerType">
          <el-radio-group v-model="addForm.bannerType">
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">商品类型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品id" prop="productId">
          <el-input v-model="addForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品类型id" prop="categoryId">
          <el-input v-model="addForm.categoryId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="addBanner">确 定</el-button>
        <el-button size="medium" @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改banner对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 修改信息 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px" size="medium">
        <!-- banner图片 -->
        <el-form-item label="banner图片" class="banner-img">
          <img :src="base64Img?base64Img:totalBannerImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <!-- banner图片信息 -->
        <el-form-item label="banner顺序" prop="bannerSeq">
          <el-select v-model="modifyForm.bannerSeq" placeholder="请选择">
            <el-option
                v-for="item in seqOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner类型" prop="bannerType">
          <el-radio-group v-model="modifyForm.bannerType">
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">商品类型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品id" prop="productId">
          <el-input v-model="modifyForm.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品类型id" prop="categoryId">
          <el-input v-model="modifyForm.categoryId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="modifyBanner">确 定</el-button>
        <el-button size="medium" @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
        :visible.sync="imgDialogVisible"
        @close="imgDialogClosed"
        width="60%"
        :close-on-click-modal="false">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BannerList",
  created() {
    this.getBannerList()
  },
  data() {
    return {
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //banner列表
      bannerList: [],
      //列表总数
      total: 0,
      //查询类型
      queryType: '',
      //banner图片完整链接
      totalBannerImg: '',
      //默认占位图
      defaultBannerImg: this.bannerImg + 'placeholder.jpg',
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
      //banner顺序选项
      seqOptions: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '4',
          value: 4
        }
      ],
      //banner类型选项
      typeOptions: [
        {
          label: '商品',
          value: 1
        },
        {
          label: '商品类型',
          value: 2
        }
      ],
      //预览图片
      showImgUrl: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        bannerId: '',
        bannerImg: '',
        bannerSeq: '',
        bannerType: '',
        productId: '',
        categoryId: '',
      },
      //添加表单
      addForm: {
        bannerImg: '',
        bannerSeq: '',
        bannerType: '',
        productId: '',
        categoryId: '',
      },
      //banner对象
      bannerObject: {
        bannerId: '',
        bannerImg: '',
        bannerSeq: '',
        bannerType: '',
        productId: '',
        categoryId: '',
        deleted: '',
        createTime: '',
        updateTime: ''
      },
      //修改表单验证规则
      modifyFormRules: {
        bannerSeq: [
          {required: true, message: '请选择banner顺序！'}
        ],
        bannerType: [
          {required: true, message: '请选择banner类型！'}
        ],
        productId: [
          {validator: this.checkRules.checkIdNull, trigger: 'blur'}
        ],
        categoryId: [
          {validator: this.checkRules.checkIdNull, trigger: 'blur'}
        ]
      },
      //添加表单验证规则
      addFormRules: {
        bannerSeq: [
          {required: true, message: '请选择banner顺序！'}
        ],
        bannerType: [
          {required: true, message: '请选择banner类型！'}
        ],
        productId: [
          {validator: this.checkRules.checkIdNull, trigger: 'blur'}
        ],
        categoryId: [
          {validator: this.checkRules.checkIdNull, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //banner列表
    getBannerList() {
      const that = this
      axios({
        method: 'get',
        url: 'banner/list',
        params: {
          queryType: this.queryType,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.bannerList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getBannerList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getBannerList()
    },
    //展示banner编辑对话框
    showModifyDialog(id) {
      this.modifyForm.bannerId = id
      this.getBanner(id)
      this.modifyDialogVisible = true
    },
    //展示banner添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    //修改取消按钮
    cancelModify() {
      const that = this
      this.modifyDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function () {
        that.base64Img = null
      }, 200)
    },
    //添加取消按钮
    cancelAdd() {
      const that = this
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function () {
        that.base64Img = null
      }, 200)
    },
    //删除banner
    deleteBannerById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'banner/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getBannerList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //单条banner
    getBanner(id) {
      const that = this
      axios({
        method: 'get',
        url: '/banner/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.modifyForm.bannerImg = res.data.data.bannerImg
          that.modifyForm.bannerSeq = res.data.data.bannerSeq
          that.modifyForm.bannerType = res.data.data.bannerType
          that.modifyForm.productId = res.data.data.productId
          that.modifyForm.categoryId = res.data.data.categoryId
          that.totalBannerImg = that.bannerImg + that.modifyForm.bannerImg
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      const that = this
      this.$refs.modifyFormRef.resetFields()
      this.file = null
      setTimeout(function () {
        that.base64Img = null
      }, 200)
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      const that = this
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function () {
        that.base64Img = null
      }, 200)
    },
    //选择文件后
    onChangeFile(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return isLt5M;
      }
      this.base64Encoding(file.raw)
      //文件
      this.file = file.raw
    },
    //得到base64图片
    base64Encoding(file) {
      const that = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        that.base64Img = reader.result
      }
    },
    //修改banner
    modifyBanner() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          const formData = new FormData
          //banner对象
          that.bannerObject.bannerId = that.modifyForm.bannerId
          that.bannerObject.bannerImg = null
          that.bannerObject.bannerSeq = that.modifyForm.bannerSeq
          that.bannerObject.bannerType = that.modifyForm.bannerType
          that.bannerObject.productId = that.modifyForm.productId
          that.bannerObject.categoryId = that.modifyForm.categoryId
          that.bannerObject.deleted = null
          that.bannerObject.createTime = null
          that.bannerObject.updateTime = null
          //转化字符串
          let banner = JSON.stringify(that.bannerObject)
          formData.append('file', that.file)
          formData.append('banner', banner)
          axios({
            method: 'put',
            url: '/banner/modify',
            data: formData,
            headers: {
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getBannerList()
              //提示修改成功
              that.$message.success(res.data.msg)
              //成功重置表单
              that.file = null
              setTimeout(function () {
                that.base64Img = null
              }, 200)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //添加banner
    addBanner() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          const formData = new FormData
          //banner对象
          that.bannerObject.bannerId = null
          that.bannerObject.bannerImg = null
          that.bannerObject.bannerSeq = that.addForm.bannerSeq
          that.bannerObject.bannerType = that.addForm.bannerType
          that.bannerObject.productId = that.addForm.productId
          that.bannerObject.categoryId = that.addForm.categoryId
          that.bannerObject.deleted = null
          that.bannerObject.createTime = null
          that.bannerObject.updateTime = null
          //转化字符串
          let banner = JSON.stringify(that.bannerObject)
          formData.append('file', that.file)
          formData.append('banner', banner)
          axios({
            method: 'post',
            url: '/banner/add',
            data: formData,
            headers: {
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getBannerList()
              //提示修改成功
              that.$message.success(res.data.msg)
              //成功重置表单
              that.file = null
              setTimeout(function () {
                that.base64Img = null
              }, 200)
            } else if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //图片预览
    showImg(e) {
      this.imgDialogVisible = true
      this.showImgUrl = e.target.src
    },
    //监听图片预览对话框关闭
    imgDialogClosed() {
      this.showImgUrl = ''
    }
  },
  filters: {
    bannerType(data) {
      if (data === 1) {
        return '商品'
      } else if (data === 2) {
        return '商品类型'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  img {
    height: 30px;
  }
}

.avatar {
  margin-top: -40px;
  height: 120px;
  display: block;
}

.banner-img {
  margin-top: 60px;
}

.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.search-icon {
  margin-left: 5px;
}

.show-add-dialog {
  margin-left: -40px;
}
</style>