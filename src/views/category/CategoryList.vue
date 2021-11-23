<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品类型管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品类型管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryLevel" placeholder="请选择商品类型等级" clearable @clear="getCategoryList" @change="getCategoryList">
            <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入商品类型名" v-model="queryInfo" @keyup.enter.native="getCategoryList" clearable @clear="getCategoryList" >
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加商品类型</el-button>
        </el-col>
      </el-row>
      <!-- 商品类型列表 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column label="编号" prop="categoryId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="商品类型名" prop="categoryName"></el-table-column>
        <el-table-column label="商品类型等级">
          <template slot-scope="scope">
            <el-tag>{{scope.row.categoryLevel | categoryLevel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品类型父编号" prop="parentId"></el-table-column>
        <el-table-column label="商品类型图片">
          <template slot-scope="scope">
            <img :src="categoryImg + scope.row.imgUrl" @click="showImg($event)">
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
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog(scope.row.categoryId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteCategoryById(scope.row.categoryId)"></el-button>
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
    <!-- 添加商品类型对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 添加信息 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px" class="el-form-block">
        <!-- 商品类型信息 -->
        <el-form-item label="商品类型名" prop="categoryName">
          <el-input v-model="addForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="商品类型等级" prop="categoryLevel">
          <el-select v-model="addForm.categoryLevel" placeholder="请选择">
            <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型父编号" prop="parentId" v-if="addForm.categoryLevel!==1">
          <el-input v-model="addForm.parentId"></el-input>
        </el-form-item>
        <!-- 商品类型图片 -->
        <el-form-item label="商品类型图片" class="category-img">
          <img :src="base64Img?base64Img:defaultCategoryImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCategory">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品类型对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 修改信息 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="120px" class="el-form-block">
        <!-- 商品类型信息 -->
        <el-form-item label="商品类型名" prop="categoryName">
          <el-input v-model="modifyForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="商品类型等级" prop="categoryLevel">
          <el-select v-model="modifyForm.categoryLevel" placeholder="请选择">
            <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型父编号" prop="parentId" v-if="modifyForm.categoryLevel!==1">
          <el-input v-model="modifyForm.parentId"></el-input>
        </el-form-item>
        <!-- 商品类型图片 -->
        <el-form-item label="商品类型图片" class="category-img">
          <img :src="base64Img?base64Img:totalCategoryImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyCategory">确 定</el-button>
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
  name: "CategoryList",
  created() {
    this.getCategoryList()
  },
  data() {
    return {
      //商品类型列表
      categoryList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
      //商品类型图片完整连接
      totalCategoryImg: '',
      //默认占位图
      defaultCategoryImg: this.categoryImg + 'placeholder.jpg',
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
      //图片预览
      showImgUrl: '',
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //查询等级
      queryLevel: '',
      //查询商品类型名
      queryInfo: '',
      //等级选项
      levelOptions: [
        {
          label: '一级分类',
          value: 1
        },
        {
          label: '二级分类',
          value: 2
        },
      ],
      //修改表单
      modifyForm: {
        categoryId: '',
        categoryName: '',
        categoryLevel: '',
        parentId: '',
        imgUrl: '',
      },
      //添加表单
      addForm: {
        categoryName: '',
        categoryLevel: '',
        parentId: '',
        imgUrl: '',
      },
      //商品商品类型对象
      categoryObject: {
        categoryId: '',
        categoryName: '',
        categoryLevel: '',
        parentId: '',
        imgUrl: '',
        deleted: '',
        createTime: '',
        updateTime: ''
      },
      //修改规则
      modifyFormRules: {
        categoryName: [
          { required: true, message: '请输入商品类型名！'}
        ],
        categoryLevel: [
          { required: true, message: '请选择商品类型等级！'}
        ],
        parentId: [
          { validator: this.checkRules.checkIdNull, trigger: 'blur' }
        ]
      },
      //添加规则
      addFormRules: {
        categoryName: [
          { required: true, message: '请输入商品类型名！'}
        ],
        categoryLevel: [
          { required: true, message: '请选择商品类型等级！'}
        ],
        parentId: [
          { validator: this.checkRules.checkIdNull, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    getCategoryList() {
      const that = this
      axios({
        method: 'get',
        url: 'category/list',
        params: {
          queryLevel: this.queryLevel,
          queryInfo: this.queryInfo,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.categoryList = res.data.data.list
          that.total = res.data.data.total
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getCategoryList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getCategoryList()
    },
    //删除商品类型
    deleteCategoryById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'category/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.getCategoryList()
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
      this.modifyForm.categoryId = id
      this.getCategory(id)
      this.modifyDialogVisible = true
    },
    //单条商品类型
    getCategory(id) {
      const that = this
      axios({
        method: 'get',
        url: '/category/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.modifyForm.categoryName = res.data.data.categoryName
          that.modifyForm.categoryLevel = res.data.data.categoryLevel
          that.modifyForm.parentId = res.data.data.parentId
          that.modifyForm.imgUrl = res.data.data.imgUrl
          that.totalCategoryImg = that.categoryImg + that.modifyForm.imgUrl
        }else {
          that.$message.error(res.data.msg)
        }
      })
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
    //选择文件后
    onChangeFile(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return  isLt2M;
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
    //添加商品类型
    addCategory() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid){
          const formData = new FormData
          //商品类型对象
          that.categoryObject.categoryId = null
          that.categoryObject.categoryName = that.addForm.categoryName
          that.categoryObject.categoryLevel = that.addForm.categoryLevel
          that.categoryObject.parentId = that.addForm.parentId
          that.categoryObject.imgUrl = null
          that.categoryObject.deleted = null
          that.categoryObject.createTime = null
          that.categoryObject.updateTime = null
          //转化字符串
          let category = JSON.stringify(that.categoryObject)
          formData.append('file', that.file)
          formData.append('category', category)
          axios({
            method: 'post',
            url: '/category/add',
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
              that.getCategoryList()
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
    //修改商品类型
    modifyCategory() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid){
          const formData = new FormData
          //商品类型对象
          that.categoryObject.categoryId = that.modifyForm.categoryId
          that.categoryObject.categoryName = that.modifyForm.categoryName
          that.categoryObject.categoryLevel = that.modifyForm.categoryLevel
          that.categoryObject.parentId = that.modifyForm.parentId
          that.categoryObject.imgUrl = null
          that.categoryObject.deleted = null
          that.categoryObject.createTime = null
          that.categoryObject.updateTime = null
          //转化字符串
          let category = JSON.stringify(that.categoryObject)
          formData.append('file', that.file)
          formData.append('category', category)
          axios({
            method: 'put',
            url: '/category/modify',
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
              that.getCategoryList()
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
      this.$refs.addFormRef.resetFields()
      this.file = null
      setTimeout(function (){
        that.base64Img = null
      },200)
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
    categoryLevel(data) {
      if (data === 1){
        return '一级分类'
      }else if (data === 2){
        return '二级分类'
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
  width: 120px;
  display: block;
}

.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.category-img {
  margin-top: 65px;
}

.el-form-block {
  margin-top: 20px;
}

.option-query {
  margin-right: -40px;
}
</style>