<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户密码管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form :model="modifyPwdForm" :rules="modifyPwdFormRules" ref="modifyPwdFormRef" label-width="100px">
        <el-form-item label="用户编号" prop="id">
          <el-input v-model="modifyPwdForm.id"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="modifyPwdForm.newPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="reNewPwd">
          <el-input v-model="modifyPwdForm.reNewPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyUserPwd">提交</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "UserPwdModify",
  data() {
    //确认新密码规则
    let confirmNewPwd = (rule, value, callback) => {
      if (value !== this.modifyPwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      //修改密码表单
      modifyPwdForm: {
        id: '',
        newPwd: '',
        reNewPwd: ''
      },
      //表单验证规则对象
      modifyPwdFormRules: {
        //验证密码是否合法
        id: [
          {required: true, message: '请输入用户编号！', trigger: 'blur'},
          {validator: this.checkRules.checkId, trigger: 'blur'}
        ],
        newPwd: [
          {required: true, message: '请输入新密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
        ],
        reNewPwd: [
          {required: true, message: '请确认新密码！', trigger: 'blur'},
          {validator: confirmNewPwd, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.modifyPwdFormRef.resetFields();
    },
    modifyUserPwd() {
      const that = this
      axios({
        method: 'put',
        url: 'user/pwdModifyByAdmin',
        params: {
          id: this.modifyPwdForm.id,
          newPwd: this.modifyPwdForm.newPwd
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.$message.success(res.data.msg)
          that.resetLoginForm()
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
          that.resetLoginForm()
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  width: 450px;
}
</style>