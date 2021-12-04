<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>当前管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 管理员列表 -->
      <el-table :data="admin" border stripe>
        <el-table-column label="编号" prop="adminId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="管理员名" prop="adminName"></el-table-column>
        <el-table-column label="管理员昵称" prop="adminNickname"></el-table-column>
        <el-table-column label="管理员头像">
          <template slot-scope="scope">
            <img :src="adminHeadImg + scope.row.adminImg" @click="showImg($event)">
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
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteAdminById(scope.row.adminId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改管理员对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px">
        <!-- 头像 -->
        <el-form-item label="管理员头像" class="head-img">
          <img :src="base64Img?base64Img:totalAdminImg" class="avatar" @click="showImg($event)">
          <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
              :on-change="onChangeFile">
            <el-button class="choose-file-btn" size="small" slot="trigger">选择文件</el-button>
            <el-button class="confirm-change-btn" size="small" type="success" @click="confirmChange">确认修改</el-button>
          </el-upload>
        </el-form-item>
        <!-- 信息 -->
        <el-form-item label="管理员名">
          <el-input v-model="modifyForm.adminName" disabled></el-input>
        </el-form-item>
        <el-form-item label="管理员昵称" prop="adminNickname">
          <el-input v-model="modifyForm.adminNickname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="adminModify">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
        :visible.sync="imgDialogVisible"
        @close="imgDialogClosed"
        width="20%"
        :close-on-click-modal="false">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AdminInfo",
  created() {
    this.getAdmin()
  },
  data() {
    return {
      //管理员信息
      admin: [],
      //修改表单
      modifyForm: {
        adminName: '',
        adminNickname: '',
        adminImg: '',
      },
      //头像完整链接
      totalAdminImg: '',
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
      //图片预览
      showImgUrl: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //表单验证规则对象
      modifyFormRules:{
        //验证管理员昵称是否合法
        adminNickname:[
          { required: true, message: '请输入管理员昵称！', trigger: 'blur' },
          { validator: this.checkRules.checkNickname, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //展示用户编辑对话框
    showModifyDialog() {
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
    //获取当前管理员
    getAdmin() {
      const that = this
      axios({
        method: 'get',
        url: '/admin/byId',
        params: {
          id: this.$cookie.get('adminId')
        },
        headers: {
          token: this.$cookie.get('adminToken')
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.admin = res.data.data
          that.modifyForm.adminName = res.data.data[0].adminName
          that.modifyForm.adminNickname = res.data.data[0].adminNickname
          that.modifyForm.adminImg = res.data.data[0].adminImg
          that.totalAdminImg = that.adminHeadImg + that.modifyForm.adminImg
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //修改管理员信息
    adminModify() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid){
          axios({
            method: 'put',
            url: '/admin/modify',
            data: {
              adminId: this.admin[0].adminId,
              adminNickname: this.modifyForm.adminNickname,
            },
            headers:{
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              that.$cookie.set('adminId', res.data.data.adminId, {expires: 1})
              that.$cookie.set('adminNickname', res.data.data.adminNickname, {expires: 1})
              //关闭对话框
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getAdmin()
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
    //删除管理员
    deleteAdminById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该管理员并注销, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'admin/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.logout()
          }else if (res.data.code === 10001){
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      });
    },
    //取消按钮
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
    //确认修改图片
    confirmChange() {
      if (Object.keys(this.file).length === 0){
        this.$message.error('请选择文件！')
      }else {
        const that = this
        //formData对象
        let formData = new FormData
        formData.append('file', this.file)
        formData.append('id', this.$cookie.get('adminId'))
        axios({
          method: 'put',
          url: 'admin/uploadImg',
          data: formData,
          headers: {
            'ContentType': 'multipart/form-data',
            token: this.$cookie.get("adminToken")
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getAdmin()
            that.$cookie.set('adminImg', res.data.data, {expires: 1})
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

.el-form {
  margin-top: 20px;
}

.avatar {
  margin-top: -40px;
  width: 120px;
  height: 120px;
  display: block;
}

.head-img {
  margin-top: 60px;
}

.choose-file-btn {
  margin-top: 10px;
  margin-right: 10px;
}

.confirm-change-btn {
  margin-top: 10px;
}
</style>