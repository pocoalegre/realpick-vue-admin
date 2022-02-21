<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 仪表板 -->
    <el-card>
      <!-- 数字卡片 -->
      <div class="show-number-box">
        <el-row>
          <el-col :span="6">
            <div class="box-card"><el-card class="box-card-inner">
              <img src="../assets/icons/liulanliang.png" alt="" class="box-card-inner-img">
              <div class="box-card-inner-content">
                <div class="box-card-inner-content-number"><span>{{viewCount}}</span></div>
                <div class="box-card-inner-content-text"><span>浏览量</span></div>
              </div>
            </el-card></div>
          </el-col>
          <el-col :span="6">
            <div class="box-card"><el-card class="box-card-inner">
              <img src="../assets/icons/yonghushu.png" alt="" class="box-card-inner-img">
              <div class="box-card-inner-content">
                <div class="box-card-inner-content-number"><span>{{userCount}}</span></div>
                <div class="box-card-inner-content-text"><span>用户数</span></div>
              </div>
            </el-card></div>
          </el-col>
          <el-col :span="6">
            <div class="box-card"><el-card class="box-card-inner">
              <img src="../assets/icons/chengjiaoliang.png" alt="" class="box-card-inner-img">
              <div class="box-card-inner-content">
                <div class="box-card-inner-content-number"><span>{{orderCount}}</span></div>
                <div class="box-card-inner-content-text"><span>成交量</span></div>
              </div>
            </el-card></div>
          </el-col>
          <el-col :span="6">
            <div class="box-card"><el-card class="box-card-inner">
              <img src="../assets/icons/xiaoshoue.png" alt="" class="box-card-inner-img">
              <div class="box-card-inner-content">
                <div class="box-card-inner-content-number"><span>￥{{saleAmount}}</span></div>
                <div class="box-card-inner-content-text"><span>销售额</span></div>
              </div>
            </el-card></div>
          </el-col>
        </el-row>
      </div>

      <!-- 图表展示 -->
      <el-card class="dashborad-box">
        <div class="dashborad-saleshistogram"><SalesHistogram></SalesHistogram></div>
        <div class="dashborad-piechart"><PieChart></PieChart></div>
      </el-card>
    </el-card>

  </div>

</template>

<script>
import PieChart from "@/component/dashborad/PieChart";
import SalesHistogram from "@/component/dashborad/SalesHistogram";
export default {
  components: {
    PieChart,
    SalesHistogram
  },
  name: "Welcome",
  created() {
    this.$cookie.remove('adminActivePath')
    this.getUserCount()
    this.getOrderCount()
    this.getSaleAmount()
    this.getViewCount()
  },
  data() {
    return {
      userCount: 0,
      orderCount: 0,
      saleAmount: 0,
      viewCount: 0,
    }
  },
  methods: {
    //获取用户数
    getUserCount(){
      const that = this
      axios({
        method: 'get',
        url: '/dashborad/userCount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.userCount = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取成交量
    getOrderCount(){
      const that = this
      axios({
        method: 'get',
        url: '/dashborad/orderCount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.orderCount = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取销售额
    getSaleAmount(){
      const that = this
      axios({
        method: 'get',
        url: '/dashborad/saleAmount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.saleAmount = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //获取浏览量
    getViewCount(){
      const that = this
      axios({
        method: 'get',
        url: '/dashborad/viewCount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.viewCount = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.show-number-box {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
}

.box-card {
  display: flex;
  justify-content: center;
  align-items: center;

  .box-card-inner {
    width: 270px;
    height: 100px;
    display: flex;
    align-items: center;

    .box-card-inner-img {
      margin-top: 15px;
      margin-left: 20px;
      width: 50px;
      height: 50px;
    }

    .box-card-inner-content {
      margin-left: 10px;
      width: 150px;
      height: 80px;
      float: right;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .box-card-inner-content-number {
        font-size: 24px;
        color: #777777;
      }

      .box-card-inner-content-text {
        font-size: 16px;
        color: #777777;
      }
    }
  }
}

.dashborad-box {
  width: 100%;
  height: 100%;

  .dashborad-saleshistogram {
    float: left;
  }

  .dashborad-piechart {
    float: right;
  }
}
</style>