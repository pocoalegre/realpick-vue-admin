<template>
  <div class="login-container">
    <vue-particles
        color="#7BC5AE"
        :particleOpacity="0.7"
        :particlesNumber="40"
        shapeType="circle"
        :particleSize="6"
        linesColor="#7BC5AE"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="1.5"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push">
    </vue-particles>
    <div class="login-box">
      <span>雀石优选后台管理系统</span>
      <!-- 登陆表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
        <!-- 管理员名 -->
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwd">
          <el-input v-model="loginForm.pwd" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code" class="code-input">
          <el-input v-model="loginForm.code" prefix-icon="el-icon-bell"></el-input>
        </el-form-item>
        <div class="code-img">
          <img :src="codeImg" @click="getCode"><br>
          <a @click="getCode">看不清?点击刷新</a>
        </div>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
          <el-button type="success" @click="regist">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  created() {
    this.getCode()
  },
  data() {
    return {
      //登陆表单绑定数据对象
      loginForm: {
        name: '',
        pwd: '',
        code: ''
      },
      //表单验证规则对象
      loginFormRules: {
        //验证管理员名是否合法
        name: [
          {required: true, message: '请输入管理员名！', trigger: 'blur'},
          {validator: this.checkRules.checkName, trigger: 'blur'}
        ],
        //验证密码是否合法
        pwd: [
          {required: true, message: '请输入密码！', trigger: 'blur'},
          {validator: this.checkRules.checkPwd, trigger: 'blur'}
        ],
        //验证验证码是否合法
        code: [
          {required: true, message: '请输入验证码！', trigger: 'blur'},
          {validator: this.checkRules.checkCode, trigger: 'blur'}
        ]
      },
      //验证码图片
      codeImg: '',
    }
  },
  methods: {
    //点击重置按钮，重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
      this.getCode()
    },
    //登录请求
    login() {
      const that = this
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'get',
            url: '/admin/login',
            params: {
              name: that.loginForm.name,
              pwd: that.loginForm.pwd,
              code: that.loginForm.code
            }
          }).then(res => {
            //回调函数判断返回code
            if (res.data.code === 10000) {
              that.$message.success(res.data.msg)
              //保存管理员信息和token
              that.$cookie.set('adminToken', res.data.data.token, {expires: 1})
              const admin = res.data.data.admin
              that.$cookie.set('adminId', admin.adminId, {expires: 1})
              that.$cookie.set('adminImg', admin.adminImg, {expires: 1})
              that.$cookie.set('adminNickname', admin.adminNickname, {expires: 1})
              //页面跳转
              that.$router.push("/home")
            }
            if (res.data.code === 10001) {
              that.$message.error(res.data.msg)
              that.resetLoginForm();
            }
          })
        }
        if (!valid) {
          that.$alert('请输入正确的信息！', '提示', {
            confirmButtonText: '确定',
          })
          that.resetLoginForm();
        }
      })
    },
    //获取验证码
    getCode() {
      const that = this;
      axios({
        method: 'get',
        url: '/admin/createCode',
        responseType: 'blob'
      }).then(res => {
        that.codeImg = window.URL.createObjectURL(res.data)
      });
    },
    regist() {
      this.$router.push('/regist')
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
}

.login-box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  box-shadow: 0 0 10px #999999;

  span {
    font-size: x-large;
    opacity: 0.7;
    font-family: 微软雅黑, serif;
    text-align: center;
    display: block;
    margin-top: 30px;
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}

.code-input {
  width: 50%;
}

.code-img {
  height: 35px;
  float: right;
  position: absolute;
  margin-top: -65px;
  margin-left: 260px;

  img {
    height: 35px;
  }

  a {
    font-size: small;
    opacity: 0.7;
    cursor: default;
  }
}
</style>