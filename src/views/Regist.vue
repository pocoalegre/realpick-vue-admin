<template>
  <div class="regist-container">
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
    <div class="regist-box">
      <span>雀石优选后台管理系统</span>
      <!-- 注册表单 -->
      <el-form ref="registFormRef" :model="registForm" :rules="registFormRules" label-width="0px" class="regist-form">
        <!-- 管理员名 -->
        <el-form-item prop="name">
          <el-input v-model="registForm.name" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwd">
          <el-input v-model="registForm.pwd" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="rePwd">
          <el-input v-model="registForm.rePwd" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="regist">注册</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
          <el-button type="info" @click="cancelRegist">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Regist',
  data() {
    //确认密码规则
    let confirmPwd = (rule, value, callback) => {
      if (value !== this.registForm.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      //登陆表单绑定数据对象
      registForm: {
        name: '',
        pwd: '',
        rePwd: ''
      },
      //表单验证规则对象
      registFormRules: {
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
        rePwd: [
          {required: true, message: '请确认密码！', trigger: 'blur'},
          {validator: confirmPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置表单
    resetLoginForm() {
      this.$refs.registFormRef.resetFields();
    },
    //注册请求
    regist() {
      const that = this
      this.$refs.registFormRef.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: '/admin/regist',
            params: {
              name: that.registForm.name,
              pwd: that.registForm.pwd,
            }
          }).then(res => {
            //回调函数判断返回code
            if (res.data.code === 10000) {
              that.$message.success(res.data.msg)
              //页面跳转
              that.$router.push("/login")
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
    cancelRegist() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.regist-container {
  height: 100%;
}

.regist-box {
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

.regist-form {
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
</style>