<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>当前管理员密码修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form :model="modifyPwdForm" :rules="modifyPwdFormRules" ref="modifyPwdFormRef" label-width="100px">
        <el-form-item label="原密码" prop="pwd">
          <el-input v-model="modifyPwdForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="modifyPwdForm.newPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="reNewPwd">
          <el-input v-model="modifyPwdForm.reNewPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyAdminPwd">提交</el-button>
          <el-button @click="resetModifyPwdForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AdminPwdModify",
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
        pwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      //表单验证规则对象
      modifyPwdFormRules: {
        //验证密码是否合法
        pwd: [
          {required: true, message: '请输入原密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
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
    //点击重置按钮，重置表单
    resetModifyPwdForm() {
      this.$refs.modifyPwdFormRef.resetFields()
    },
    modifyAdminPwd() {
      const that = this
      this.$refs.modifyPwdFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'put',
            url: '/admin/pwdModify',
            params: {
              id: that.$cookie.get('adminId'),
              pwd: that.modifyPwdForm.pwd,
              newPwd: that.modifyPwdForm.newPwd
            },
            headers: {
              token: that.$cookie.get('adminToken')
            }
          }).then(res => {
            if (res.data.code === 10000) {
              that.$message.success(res.data.msg)
              that.logout()
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
.el-form-item {
  width: 450px;
}
</style>