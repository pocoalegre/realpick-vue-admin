<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品图片管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入商品编号" v-model="queryProductId" @keyup.enter.native="getProductImgList" clearable @clear="getProductImgList" >
            <el-button slot="append" icon="el-icon-search" @click="getProductImgList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加商品图片</el-button>
        </el-col>
      </el-row>
      <!-- 商品图片列表 -->
      <el-table :data="productImgList" border stripe>
        <el-table-column label="编号" prop="imgId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="商品编号" prop="productId"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="productImg + scope.row.imgUrl" @click="showImg($event)">
          </template>
        </el-table-column>
        <el-table-column label="图片顺序" prop="imgSeq"></el-table-column>
        <el-table-column label="是否主图" prop="isMain">
          <template slot-scope="scope">
            {{scope.row.isMain | isMain}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updateTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="143px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog(scope.row.imgId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteProductImgById(scope.row.imgId)"></el-button>
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
    <!-- 添加商品图片对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息添加 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="el-form-block">
        <!-- 商品图片信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="addForm.productId"></el-input>
        </el-form-item>
        <!-- 商品图片 -->
        <el-form-item label="商品图片" class="el-form-block-img">
          <img :src="base64Img?base64Img:defaultProductImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片顺序" prop="imgSeq">
          <el-input v-model="addForm.imgSeq"></el-input>
        </el-form-item>
        <el-form-item label="是否主图" prop="isMain">
          <el-radio-group v-model="addForm.isMain">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProductImg">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品图片对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px" class="el-form-block">
        <!-- 商品图片信息 -->
        <el-form-item label="商品编号" prop="productId">
          <el-input v-model="modifyForm.productId"></el-input>
        </el-form-item>
        <!-- 商品图片 -->
        <el-form-item label="商品图片" class="el-form-block-img">
          <img :src="base64Img?base64Img:totalProductImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片顺序" prop="imgSeq">
          <el-input v-model="modifyForm.imgSeq"></el-input>
        </el-form-item>
        <el-form-item label="是否主图" prop="isMain">
          <el-radio-group v-model="modifyForm.isMain">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyProductImg">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
        :visible.sync="imgDialogVisible"
        @close="imgDialogClosed"
        width="30%"
        :close-on-click-modal="false">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductImg",
  created() {
    this.getProductImgList()
  },
  data() {
    return {
      //商品列表
      productImgList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 5,
      //列表总数
      total: 0,
      //查询商品id
      queryProductId: '',
      //预览图片
      showImgUrl: '',
      //商品图片完整链接
      totalProductImg: '',
      //默认占位图
      defaultProductImg: this.productImg + 'placeholder.jpg',
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        imgId: '',
        productId: '',
        imgUrl: '',
        imgSeq: '',
        isMain: ''
      },
      //添加表单
      addForm: {
        productId: '',
        imgUrl: '',
        imgSeq: '',
        isMain: ''
      },
      //商品图片对象
      productImgObject: {
        imgId: '',
        productId: '',
        imgUrl: '',
        imgSeq: '',
        isMain: '',
        deleted: '',
        createTime: '',
        updateTime: ''
      },
      //修改规则
      modifyFormRules: {
        productId: [
          { required: true, message: '请输入商品编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        imgSeq: [
          { required: true, message: '请输入图片顺序！', trigger: 'blur' },
          { validator: this.checkRules.checkInt, trigger: 'blur' }
        ],
        isMain: [
          { required: true, message: '请选择是否主图！', trigger: 'blur' }
        ]
      },
      //添加规则
      addFormRules: {
        productId: [
          { required: true, message: '请输入商品编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        imgSeq: [
          { required: true, message: '请输入图片顺序！', trigger: 'blur' },
          { validator: this.checkRules.checkInt, trigger: 'blur' }
        ],
        isMain: [
          { required: true, message: '请选择是否主图！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //商品图片列表
    getProductImgList() {
      const that = this
      axios({
        method: 'get',
        url: 'productImg/list',
        params: {
          queryProductId: this.queryProductId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.productImgList = res.data.data.list
          that.total = res.data.data.total
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条商品图片
    getProductImg(id) {
      const that = this
      axios({
        method: 'get',
        url: '/productImg/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.modifyForm.productId = res.data.data.productId
          that.modifyForm.imgUrl = res.data.data.imgUrl
          that.modifyForm.imgSeq = res.data.data.imgSeq
          that.modifyForm.isMain = res.data.data.isMain
          that.totalProductImg = that.productImg + that.modifyForm.imgUrl
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getProductImgList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getProductImgList()
    },
    //图片预览
    showImg(e) {
      this.imgDialogVisible = true
      this.showImgUrl = e.target.src
    },
    //监听图片预览对话框关闭
    imgDialogClosed() {
      this.showImgUrl = ''
    },
    //删除商品图片
    deleteProductImgById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'productImg/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.getProductImgList()
          }else if (res.data.code === 10001){
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
      this.modifyForm.imgId = id
      this.getProductImg(id)
      this.modifyDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      const that = this
      this.$refs.modifyFormRef.resetFields()
      this.file = null
      setTimeout(function (){
        that.base64Img = null
      },200)
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      const that = this
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function (){
        that.base64Img = null
      },200)
    },
    //取消添加
    cancelAdd() {
      const that = this
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function (){
        that.base64Img = null
      },200)
    },
    //取消修改
    cancelModify() {
      const that = this
      this.modifyDialogVisible = false
      this.file = null
      setTimeout(function (){
        that.base64Img = null
      },200)
    },
    //选择文件后
    onChangeFile(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return  isLt5M;
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
    //添加商品图片
    addProductImg(){
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          const formData = new FormData
          //商品图片对象
          that.productImgObject.imgId = null
          that.productImgObject.productId = that.addForm.productId
          that.productImgObject.imgUrl = null
          that.productImgObject.imgSeq = that.addForm.imgSeq
          that.productImgObject.isMain = that.addForm.isMain
          that.productImgObject.deleted = null
          that.productImgObject.createTime = null
          that.productImgObject.updateTime = null
          //转化字符串
          let productImg = JSON.stringify(that.productImgObject)
          formData.append('file', that.file)
          formData.append('productImg', productImg)
          axios({
            method: 'post',
            url: '/productImg/add',
            data: formData,
            headers:{
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框，重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getProductImgList()
              //提示修改成功
              that.$message.success(res.data.msg)
              //成功重置表单
              that.file = null
              setTimeout(function (){
                that.base64Img = null
              },200)
            }else if (res.data.code === 10001){
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //修改商品图片
    modifyProductImg(){
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          const formData = new FormData
          //商品图片对象
          that.productImgObject.imgId = that.modifyForm.imgId
          that.productImgObject.productId = that.modifyForm.productId
          that.productImgObject.imgUrl = null
          that.productImgObject.imgSeq = that.modifyForm.imgSeq
          that.productImgObject.isMain = that.modifyForm.isMain
          that.productImgObject.deleted = null
          that.productImgObject.createTime = null
          that.productImgObject.updateTime = null
          //转化字符串
          let productImg = JSON.stringify(that.productImgObject)
          formData.append('file', that.file)
          formData.append('productImg', productImg)
          axios({
            method: 'put',
            url: '/productImg/modify',
            data: formData,
            headers:{
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框，重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getProductImgList()
              //提示修改成功
              that.$message.success(res.data.msg)
              //成功重置表单
              that.file = null
              setTimeout(function (){
                that.base64Img = null
              },200)
            }else if (res.data.code === 10001){
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
  },
  filters: {
    isMain(data) {
      if (data === 1) {
        return '是'
      }else if (data === 0) {
        return '否'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  img {
    height: 50px;
    width: 50px;
  }
}

.avatar {
  margin-top: -40px;
  height: 120px;
  display: block;
}

.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.el-form-block {
  margin-top: 20px;
}

.el-form-block-img {
  margin-top: 65px;
}
</style>