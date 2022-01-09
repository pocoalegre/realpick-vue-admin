<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryType" placeholder="请选择查询类型" clearable @clear="getUserList" @change="getUserList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入查询信息" v-model="queryInfo" @keyup.enter.native="getUserList" clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="编号" prop="userId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="用户昵称" prop="userNickname"></el-table-column>
        <el-table-column label="用户头像">
          <template slot-scope="scope">
            <img :src="userHeadImg + scope.row.userImg" @click="showImg($event)">
          </template>
        </el-table-column>
        <el-table-column label="用户性别">
          <template slot-scope="scope">
            {{ scope.row.userGender | genderFormat }}
          </template>
        </el-table-column>
        <el-table-column label="用户年龄" prop="userAge"></el-table-column>
        <el-table-column label="用户电话" prop="userTel"></el-table-column>
        <el-table-column label="用户邮箱" prop="userEmail"></el-table-column>
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
                       @click="showModifyDialog(scope.row.userId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium"
                       @click="deleteUserById(scope.row.userId)"></el-button>
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
    <!-- 添加用户 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息添加 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <!-- 信息 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="userPwd">
          <el-input v-model="addForm.userPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="userRePwd">
          <el-input v-model="addForm.userRePwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userRegist">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px">
        <!-- 头像 -->
        <el-form-item label="用户头像" class="head-img">
          <img :src="base64Img?base64Img:totalUserImg" class="avatar" @click="showImg($event)">
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
        <el-form-item label="用户名">
          <el-input v-model="modifyForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="userNickname">
          <el-input v-model="modifyForm.userNickname"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" prop="userGender">
          <el-select v-model="modifyForm.userGender" placeholder="请选择">
            <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户年龄" prop="userAge">
          <el-input v-model.number="modifyForm.userAge"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="userTel">
          <el-input v-model="modifyForm.userTel"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="modifyForm.userEmail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userModify">确 定</el-button>
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
  name: "UserList",
  created() {
    this.getUserList()
  },
  data() {
    //确认密码规则
    let confirmPwd = (rule, value, callback) => {
      if (value !== this.addForm.userPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      //用户列表
      userList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 5,
      //列表总数
      total: 0,
      //查询类型
      queryType: '',
      //查询条件
      queryInfo: '',
      //类型选项
      typeOptions: [
        {
          label: '用户编号',
          value: 'user_id',
        },
        {
          label: '用户名',
          value: 'user_name'
        },
        {
          label: '用户昵称',
          value: 'user_nickname'
        }
      ],
      //修改表单
      modifyForm: {
        userId: '',
        userName: '',
        userNickname: '',
        userImg: '',
        userGender: '',
        userAge: '',
        userTel: '',
        userEmail: ''
      },
      //添加表单
      addForm: {
        userName: '',
        userPwd: '',
        userRePwd: ''
      },
      //头像完整链接
      totalUserImg: '',
      //上传的文件
      file: {},
      //回显base64编码图片
      base64Img: '',
      //性别选项
      genderOptions: [
        {
          label: '保密',
          value: ''
        },
        {
          label: '男',
          value: 'male'
        },
        {
          label: '女',
          value: 'female'
        }
      ],
      //修改表单验证规则
      modifyFormRules: {
        userNickname: [
          {required: true, message: '请输入用户昵称！', trigger: 'blur'},
          {validator: this.checkRules.checkNickname, trigger: 'blur'}
        ],
        userAge: [
          {validator: this.checkRules.checkAge, trigger: 'blur'}
        ],
        userTel: [
          {validator: this.checkRules.checkTel, trigger: 'blur'}
        ],
        userEmail: [
          {validator: this.checkRules.checkEmail, trigger: 'blur'}
        ],
      },
      //添加表单验证规则
      addFormRules: {
        userName: [
          {required: true, message: '请输入用户名！', trigger: 'blur'},
          {validator: this.checkRules.checkName, trigger: 'blur'}
        ],
        //验证密码是否合法
        userPwd: [
          {required: true, message: '请输入密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
        ],
        userRePwd: [
          {required: true, message: '请确认密码！', trigger: 'blur'},
          {validator: confirmPwd, trigger: 'blur'}
        ]
      },
      //预览图片
      showImgUrl: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false
    }
  },
  methods: {
    //用户列表
    getUserList() {
      const that = this
      axios({
        method: 'get',
        url: '/user/list',
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
        if (res.data.code === 10000) {
          that.userList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getUserList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getUserList()
    },
    //删除用户
    deleteUserById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'user/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getUserList()
          } else if (res.data.code === 10001) {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //修改取消按钮
    cancelModify() {
      const that = this
      this.modifyDialogVisible = false
      this.$refs.modifyFormRef.resetFields()
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
    //单条用户
    getUser(id) {
      const that = this
      axios({
        method: 'get',
        url: '/user/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.modifyForm.userName = res.data.data.userName
          that.modifyForm.userNickname = res.data.data.userNickname
          that.modifyForm.userImg = res.data.data.userImg
          that.modifyForm.userGender = res.data.data.userGender
          that.modifyForm.userAge = res.data.data.userAge
          that.modifyForm.userTel = res.data.data.userTel
          that.modifyForm.userEmail = res.data.data.userEmail
          that.totalUserImg = that.userHeadImg + that.modifyForm.userImg
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //展示用户编辑对话框
    showModifyDialog(id) {
      this.modifyForm.userId = id
      this.getUser(id)
      this.modifyDialogVisible = true
    },
    //展示用户添加对话框
    showAddDialog() {
      this.addDialogVisible = true
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
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return isLt2M;
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
      if (Object.keys(this.file).length === 0) {
        this.$message.error('请选择文件！')
      } else {
        const that = this
        //formData对象
        let formData = new FormData
        formData.append('file', this.file)
        formData.append('id', this.modifyForm.userId)
        axios({
          method: 'put',
          url: 'user/uploadImg',
          data: formData,
          headers: {
            'ContentType': 'multipart/form-data',
            token: this.$cookie.get("adminToken")
          }
        }).then(res => {
          if (res.data.code === 10000) {
            that.$message.success(res.data.msg)
            that.getUser(this.modifyForm.userId)
            that.getUserList()
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
    //用户修改
    userModify() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/user/modify',
            data: {
              userId: this.modifyForm.userId,
              userNickname: this.modifyForm.userNickname,
              userGender: this.modifyForm.userGender,
              userAge: this.modifyForm.userAge,
              userTel: this.modifyForm.userTel,
              userEmail: this.modifyForm.userEmail,
            },
            headers: {
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000) {
              //关闭对话框，重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getUserList()
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
    //用户注册
    userRegist() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: 'user/regist',
            params: {
              name: that.addForm.userName,
              pwd: that.addForm.userPwd
            }
          }).then(res => {
            if (res.data.code === 10000) {
              that.$message.success(res.data.msg)
              //刷新数据列表
              that.getUserList()
              //关闭窗口
              that.addDialogVisible = false
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

.option-query {
  margin-right: -40px;
}
</style>