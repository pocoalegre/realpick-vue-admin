<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入订单编号" v-model="queryOrderId" @keyup.enter.native="getOrderDetailList" clearable
                    @clear="getOrderDetailList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderDetailList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单详情列表 -->
      <el-table :data="orderDetailList" border stripe>
        <el-table-column label="编号" prop="detailId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="订单编号" prop="orderId"></el-table-column>
        <el-table-column label="商品编号" prop="productId"></el-table-column>
        <el-table-column label="商品名" prop="productName" width="250px"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="productImg + scope.row.productImg" @click="showImg($event)">
          </template>
        </el-table-column>
        <el-table-column label="sku编号" prop="skuId"></el-table-column>
        <el-table-column label="商品尺寸" prop="skuSize"></el-table-column>
        <el-table-column label="商品颜色" prop="skuColor"></el-table-column>
        <el-table-column label="购买数量" prop="buyNumber"></el-table-column>
        <el-table-column label="售价" prop="sellPrice"></el-table-column>
        <el-table-column label="单品总价" prop="totalAmount"></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.updateTime | dateFormat }}
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
    <!-- 图片预览 -->
    <el-dialog
        :visible.sync="imgDialogVisible"
        @close="imgDialogClosed"
        width="25%"
        :close-on-click-modal="false">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OrderDetail",
  created() {
    this.getOrderDetailList()
  },
  data() {
    return {
      //订单详情列表
      orderDetailList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 5,
      //列表总数
      total: 0,
      //查询订单编号
      queryOrderId: '',
      //预览图片
      showImgUrl: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
    }
  },
  methods: {
    //获取订单详情列表
    getOrderDetailList() {
      const that = this
      axios({
        method: 'get',
        url: 'orderDetail/list',
        params: {
          queryOrderId: this.queryOrderId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.orderDetailList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
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
</style>