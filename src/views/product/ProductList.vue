<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryType" placeholder="请选择查询类型" clearable @clear="getProductList" @change="getProductList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入查询信息" v-model="queryInfo" @keyup.enter.native="getProductList" clearable @clear="getProductList" >
            <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="productList" border stripe>
        <el-table-column label="编号" prop="productId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="商品图片" prop="colorImg">
          <template slot-scope="scope">
            <img :src="productImg + scope.row.productImg" @click="showImg($event)">
          </template>
        </el-table-column>
        <el-table-column label="商品名" prop="productName"></el-table-column>
        <el-table-column label="商品价格" prop="productPrice"></el-table-column>
        <el-table-column label="商品类型编号" prop="categoryId"></el-table-column>
        <el-table-column label="商品品牌" prop="productBrand"></el-table-column>
        <el-table-column label="商品库存" prop="productStock"></el-table-column>
        <el-table-column label="商品销量" prop="productSales"></el-table-column>
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
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog(scope.row.productId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteProductById(scope.row.productId)"></el-button>
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
    <!-- 添加商品对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息添加 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px" class="el-form-block">
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
        <!-- 商品信息 -->
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="addForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model="addForm.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品类型编号" prop="categoryId">
          <el-input v-model="addForm.categoryId"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="productBrand">
          <el-input v-model="addForm.productBrand"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="productStock">
          <el-input v-model="addForm.productStock"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProduct">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="120px" class="el-form-block">
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
        <!-- 商品信息 -->
        <el-form-item label="商品名" prop="productName">
          <el-input v-model="modifyForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model="modifyForm.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品类型编号" prop="categoryId">
          <el-input v-model="modifyForm.categoryId"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="productBrand">
          <el-input v-model="modifyForm.productBrand"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="productStock">
          <el-input v-model="modifyForm.productStock"></el-input>
        </el-form-item>
        <el-form-item label="商品销量" prop="productSales">
          <el-input v-model="modifyForm.productSales"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyProduct">确 定</el-button>
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
  name: "ProductList",
  created() {
    this.getProductList()
  },
  data() {
    return {
      //商品列表
      productList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 5,
      //列表总数
      total: 0,
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
      //查询类型
      queryType: '',
      //查询信息
      queryInfo: '',
      //类型选项
      typeOptions: [
        {
          label: '商品名',
          value: 'product_name'
        },
        {
          label: '商品类型编号',
          value: 'category_id'
        },
        {
          label: '商品品牌',
          value: 'product_brand'
        },
      ],
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        productId: '',
        productImg: '',
        productName: '',
        productPrice: '',
        categoryId: '',
        productBrand: '',
        productStock: '',
        productSales: ''
      },
      //添加表单
      addForm: {
        productImg: '',
        productName: '',
        productPrice: '',
        categoryId: '',
        productBrand: '',
        productStock: ''
      },
      //商品对象
      productObject: {
        productId: '',
        productImg: '',
        productName: '',
        productPrice: '',
        categoryId: '',
        productBrand: '',
        productStock: '',
        productSales: '',
        deleted: '',
        createTime: '',
        updateTime: ''
      },
      //修改规则
      modifyFormRules: {
        productName: [
          { required: true, message: '请输入商品名！', trigger: 'blur' },
        ],
        productPrice: [
          { required: true, message: '请输入商品价格！', trigger: 'blur' },
          { validator: this.checkRules.checkMoney, trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入商品类型编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        productBrand: [
          { required: true, message: '请输入商品品牌！', trigger: 'blur' },
        ],
        productStock: [
          { required: true, message: '请输入商品库存！', trigger: 'blur' },
          { validator: this.checkRules.checkInt, trigger: 'blur' }
        ],
        productSales: [
          { required: true, message: '请输入商品销量！', trigger: 'blur' },
          { validator: this.checkRules.checkInt, trigger: 'blur' }
        ]
      },
      //添加规则
      addFormRules: {
        productName: [
          { required: true, message: '请输入商品名！', trigger: 'blur' },
        ],
        productPrice: [
          { required: true, message: '请输入商品价格！', trigger: 'blur' },
          { validator: this.checkRules.checkMoney, trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入商品类型编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        productBrand: [
          { required: true, message: '请输入商品品牌！', trigger: 'blur' },
        ],
        productStock: [
          { required: true, message: '请输入商品库存！', trigger: 'blur' },
          { validator: this.checkRules.checkInt, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //商品列表
    getProductList() {
      const that = this
      axios({
        method: 'get',
        url: 'product/list',
        params: {
          queryType: this.queryType,
          queryInfo: this.queryInfo,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.productList = res.data.data.list
          that.total = res.data.data.total
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条商品
    getProduct(id) {
      const that = this
      axios({
        method: 'get',
        url: '/product/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.modifyForm.productImg = res.data.data.productImg
          that.modifyForm.productName = res.data.data.productName
          that.modifyForm.productPrice = res.data.data.productPrice
          that.modifyForm.categoryId = res.data.data.categoryId
          that.modifyForm.productBrand = res.data.data.productBrand
          that.modifyForm.productStock = res.data.data.productStock
          that.modifyForm.productSales = res.data.data.productSales
          that.totalProductImg = that.productImg + that.modifyForm.productImg
        }else {
          that.$message.error(res.data.msg)
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
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getProductList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getProductList()
    },
    //删除商品
    deleteProductById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录以及相关信息, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'product/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.getProductList()
          }else if (res.data.code === 10001){
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //展示添加商品信息对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    //展示修改商品信息对话框
    showModifyDialog(id) {
      this.modifyForm.productId = id
      this.getProduct(id)
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
    //添加商品
    addProduct() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid){
          const formData = new FormData
          //商品图片对象
          that.productObject.productId = null
          that.productObject.productImg = null
          that.productObject.productName = that.addForm.productName
          that.productObject.productPrice = that.addForm.productPrice
          that.productObject.categoryId = that.addForm.categoryId
          that.productObject.productBrand = that.addForm.productBrand
          that.productObject.productStock = that.addForm.productStock
          that.productObject.productSales = null
          that.productObject.deleted = null
          that.productObject.createTime = null
          that.productObject.updateTime = null
          //转化字符串
          let product = JSON.stringify(that.productObject)
          formData.append('file', that.file)
          formData.append('product', product)
          axios({
            method: 'post',
            url: '/product/add',
            data: formData,
            headers:{
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getProductList()
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
    //修改商品
    modifyProduct() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid){
          const formData = new FormData
          //商品对象
          that.productObject.productId = that.modifyForm.productId
          that.productObject.productImg = null
          that.productObject.productName = that.modifyForm.productName
          that.productObject.productPrice = that.modifyForm.productPrice
          that.productObject.categoryId = that.modifyForm.categoryId
          that.productObject.productBrand = that.modifyForm.productBrand
          that.productObject.productStock = that.modifyForm.productStock
          that.productObject.productSales = that.modifyForm.productSales
          that.productObject.deleted = null
          that.productObject.createTime = null
          that.productObject.updateTime = null
          //转化字符串
          let product = JSON.stringify(that.productObject)
          formData.append('file', that.file)
          formData.append('product', product)
          axios({
            method: 'put',
            url: '/product/modify',
            data: formData,
            headers:{
              'ContentType': 'multipart/form-data',
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getProductList()
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

.el-form-block {
  margin-top: 20px;
}

.option-query {
  margin-right: -40px;
}

.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.el-form-block-img {
  margin-top: 65px;
}
</style>