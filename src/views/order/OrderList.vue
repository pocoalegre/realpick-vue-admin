<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryType" placeholder="请选择查询类型" clearable @clear="getOrderList" @change="getOrderList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入查询信息" v-model="queryInfo" @keyup.enter.native="getOrderList" clearable @clear="getOrderList" >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column label="编号" prop="orderId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="订单号" prop="orderNumber"></el-table-column>
        <el-table-column label="用户编号" prop="userId"></el-table-column>
        <el-table-column label="收件人姓名" prop="receiverName" width="90px"></el-table-column>
        <el-table-column label="收件人电话" prop="receiverTel" width="100px"></el-table-column>
        <el-table-column label="收件人地址" prop="receiverAddr" width="90px"></el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            {{scope.row.payType | payType}}
          </template>
        </el-table-column>
        <el-table-column label="总价" prop="totalAmount"></el-table-column>
        <el-table-column label="实际支付" prop="actualAmount"></el-table-column>
        <el-table-column label="订单备注" prop="orderRemark" width="140px"></el-table-column>
        <el-table-column label="提交时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.submitTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="取消时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.cancelTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="支付时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.payTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="发货时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.deliverTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="收货时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.receiveTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.finishTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{scope.row.status | status}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.updateTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="143px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog(scope.row.orderId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteOrderById(scope.row.orderId)"></el-button>
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
    <!-- 修改订单对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 订单修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px" class="el-form-block">
        <!-- 订单信息 -->
        <el-form-item label="订单号">
          <el-input v-model="modifyForm.orderNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input v-model="modifyForm.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiverName">
          <el-input v-model="modifyForm.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="收件人电话" prop="receiverTel">
          <el-input v-model="modifyForm.receiverTel"></el-input>
        </el-form-item>
        <el-form-item label="收件人地址" prop="receiverAddr">
          <el-input v-model="modifyForm.receiverAddr"></el-input>
        </el-form-item>
        <el-form-item label="订单备注" prop="orderRemark">
          <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="modifyForm.orderRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyOrder">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OrderList",
  created() {
    this.getOrderList()
  },
  data() {
    return {
      //订单列表
      orderList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
      //查询类型
      queryType: '',
      //查询信息
      queryInfo: '',
      //类型选项
      typeOptions: [
        {
          label: '订单号',
          value: 'order_number'
        },
        {
          label: '用户编号',
          value: 'user_id'
        }
      ],
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //修改表单
      modifyForm: {
        orderId: '',
        orderNumber: '',
        userId: '',
        receiverName: '',
        receiverTel: '',
        receiverAddr: '',
        orderRemark: '',
      },
      //修改规则
      modifyFormRules: {
        receiverName: [
          { required: true, message: '请输入收件人姓名！', trigger: 'blur' },
        ],
        receiverTel: [
          { required: true, message: '请输入收件人电话！', trigger: 'blur' },
          { validator: this.checkRules.checkTel, trigger: 'blur' }
        ],
        receiverAddr: [
          { required: true, message: '请输入收件人地址！', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    //获取订单列表
    getOrderList() {
      const that = this
      axios({
        method: 'get',
        url: 'order/list',
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
          that.orderList = res.data.data.list
          that.total = res.data.data.total
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //单条订单
    getOrder(id) {
      const that = this
      axios({
        method: 'get',
        url: '/order/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.modifyForm.orderNumber = res.data.data.orderNumber
          that.modifyForm.userId = res.data.data.userId
          that.modifyForm.receiverName = res.data.data.receiverName
          that.modifyForm.receiverTel = res.data.data.receiverTel
          that.modifyForm.receiverAddr = res.data.data.receiverAddr
          that.modifyForm.orderRemark = res.data.data.orderRemark
        }else {
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
    //删除订单
    deleteOrderById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录以及相关信息, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'order/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.getOrderList()
          }else if (res.data.code === 10001){
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //展示修改商品信息对话框
    showModifyDialog(id) {
      this.modifyForm.orderId = id
      this.getOrder(id)
      this.modifyDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      this.$refs.modifyFormRef.resetFields()
    },
    //取消修改
    cancelModify() {
      this.modifyDialogVisible = false
    },
    //修改订单
    modifyOrder() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid){
          axios({
            method: 'put',
            url: '/order/modify',
            data: {
              orderId: that.modifyForm.orderId,
              receiverName: that.modifyForm.receiverName,
              receiverTel: that.modifyForm.receiverTel,
              receiverAddr: that.modifyForm.receiverAddr,
              orderRemark: that.modifyForm.orderRemark,
            },
            headers:{
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getOrderList()
              //提示修改成功
              that.$message.success(res.data.msg)
            }else if (res.data.code === 10001){
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  },
  filters: {
    payType(data) {
      if (data === 1){
        return '支付宝'
      }
    },
    status(data) {
      //0：已取消，1：待支付，2：待发货，3：待收货，4：已完成
      if (data === 0){
        return '已取消'
      }else if (data === 1){
        return '待支付'
      }else if (data === 2){
        return '待发货'
      }else if (data === 3){
        return '待收货'
      }else if (data === 4){
        return '已完成'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-block {
  margin-top: 20px;
}

.option-query {
  margin-right: -40px;
}
</style>