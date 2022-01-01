<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>快递管理</el-breadcrumb-item>
      <el-breadcrumb-item>快递管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryCom" placeholder="请选择快递公司" clearable @clear="getDeliveryList" @change="getDeliveryList">
            <el-option
                v-for="item in comOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="option-query">
          <el-select v-model="queryType" placeholder="请选择查询类型" clearable @clear="getDeliveryList" @change="getDeliveryList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入查询信息" v-model="queryInfo" @keyup.enter.native="getDeliveryList" clearable @clear="getDeliveryList" >
            <el-button slot="append" icon="el-icon-search" @click="getDeliveryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加快递</el-button>
        </el-col>
      </el-row>
      <!-- 快递列表 -->
      <el-table :data="deliveryList" border stripe>
        <el-table-column label="编号" prop="deliveryId" width="80px" fixed="left"></el-table-column>
        <el-table-column label="订单编号" prop="orderId"></el-table-column>
        <el-table-column label="快递单号" prop="deliveryNu"></el-table-column>
        <el-table-column label="快递公司">
          <template slot-scope="scope">
            {{scope.row.deliveryCom | deliveryFormat}}
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
        <el-table-column label="操作" width="209px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showModifyDialog(scope.row.deliveryId)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteDeliveryById(scope.row.deliveryId)"></el-button>
            <!-- 查询物流 -->
            <el-button type="primary" icon="el-icon-search" size="medium" @click="queryDeliveryUrl(scope.row.deliveryNu, scope.row.deliveryCom)"></el-button>
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
    <!-- 添加快递对话框 -->
    <el-dialog
        title="添加信息"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        :close-on-click-modal="false">
      <!-- 添加信息 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="el-form-block">
        <!-- 快递信息 -->
        <el-form-item label="订单编号" prop="orderId">
          <el-input v-model="addForm.orderId"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="deliveryNu">
          <el-input v-model="addForm.deliveryNu"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="deliveryCom">
          <el-select v-model="addForm.deliveryCom" placeholder="请选择">
            <el-option
                v-for="item in comOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDelivery">确 定</el-button>
        <el-button @click="cancelAdd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改快递对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="modifyDialogVisible"
        width="35%"
        @close="modifyDialogClosed"
        :close-on-click-modal="false">
      <!-- 信息修改 -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyFormRef" label-width="100px" class="el-form-block">
        <!-- 快递信息 -->
        <el-form-item label="订单编号" prop="orderId">
          <el-input v-model="modifyForm.orderId"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="deliveryNu">
          <el-input v-model="modifyForm.deliveryNu"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="deliveryNu">
          <el-select v-model="modifyForm.deliveryCom" placeholder="请选择">
            <el-option
                v-for="item in comOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyDelivery">确 定</el-button>
        <el-button @click="cancelModify">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeliveryList",
  created() {
    this.getDeliveryList()
  },
  data() {
    return {
      //快递列表
      deliveryList: [],
      //页码
      pageNum: 1,
      //当前页码数据条数
      pageSize: 10,
      //列表总数
      total: 0,
      //查询快递公司
      queryCom: '',
      //查询类型
      queryType: '',
      //查询信息
      queryInfo: '',
      //快递公司选项
      comOptions: [
        {
          label: '圆通速递',
          value: 'yuantong'
        },
        {
          label: '顺丰速运',
          value: 'shunfeng'
        },
        {
          label: '韵达快递',
          value: 'yunda'
        },
        {
          label: '中通快递',
          value: 'zhongtong'
        },
        {
          label: '申通快递',
          value: 'shentong'
        },
      ],
      //类型选项
      typeOptions: [
        {
          label: '订单编号',
          value: 'order_id'
        },
        {
          label: '快递单号',
          value: 'delivery_nu'
        }
      ],
      //修改对话框显示与隐藏
      modifyDialogVisible: false,
      //添加对话框显示与隐藏
      addDialogVisible: false,
      //修改表单
      modifyForm: {
        deliveryId: '',
        orderId: '',
        deliveryNu: '',
        deliveryCom: '',
      },
      //添加表单
      addForm: {
        orderId: '',
        deliveryNu: '',
        deliveryCom: '',
      },
      //修改规则
      modifyFormRules: {
        orderId: [
          { required: true, message: '请输入订单编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        deliveryNu: [
          { required: true, message: '请输入快递单号！', trigger: 'blur' },
          { validator: this.checkRules.checkNu, trigger: 'blur' }
        ],
        deliveryCom: [
          { required: true, message: '请选择快递公司！'}
        ],
      },
      //添加规则
      addFormRules: {
        orderId: [
          { required: true, message: '请输入订单编号！', trigger: 'blur' },
          { validator: this.checkRules.checkId, trigger: 'blur' }
        ],
        deliveryNu: [
          { required: true, message: '请输入快递单号！', trigger: 'blur' },
          { validator: this.checkRules.checkNu, trigger: 'blur' }
        ],
        deliveryCom: [
          { required: true, message: '请选择快递公司！'}
        ],
      }
    }
  },
  methods: {
    //快递列表
    getDeliveryList() {
      const that = this
      axios({
        method: 'get',
        url: 'delivery/list',
        params: {
          queryCom: this.queryCom,
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
          that.deliveryList = res.data.data.list
          that.total = res.data.data.total
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //删除快递
    deleteDeliveryById(id) {
      const that = this
      //弹框询问是否删除
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'delete',
          url: 'delivery/delete',
          params: {
            id: id
          },
          headers: {
            token: that.$cookie.get('adminToken')
          }
        }).then(res => {
          if (res.data.code === 10000){
            that.$message.success(res.data.msg)
            that.getDeliveryList()
          }else if (res.data.code === 10001){
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消！')
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getDeliveryList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getDeliveryList()
    },
    //展示添加商品信息对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    //展示修改商品信息对话框
    showModifyDialog(id) {
      this.modifyForm.deliveryId = id
      this.getDelivery(id)
      this.modifyDialogVisible = true
    },
    //监听修改对话框关闭事件
    modifyDialogClosed() {
      this.$refs.modifyFormRef.resetFields()
    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm.deliveryCom = ''
    },
    //取消添加
    cancelAdd() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.addForm.deliveryCom = ''
    },
    //取消修改
    cancelModify() {
      this.modifyDialogVisible = false
    },
    //单条快递
    getDelivery(id) {
      const that = this
      axios({
        method: 'get',
        url: '/delivery/byId',
        params: {
          id: id
        },
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000){
          that.modifyForm.orderId = res.data.data.orderId
          that.modifyForm.deliveryNu = res.data.data.deliveryNu
          that.modifyForm.deliveryCom = res.data.data.deliveryCom
        }else {
          that.$message.error(res.data.msg)
        }
      })
    },
    //添加快递
    addDelivery() {
      const that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid){
          axios({
            method: 'post',
            url: '/delivery/add',
            data: {
              orderId: that.addForm.orderId,
              deliveryNu: that.addForm.deliveryNu,
              deliveryCom: that.addForm.deliveryCom,
            },
            headers:{
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框重置回显
              that.addDialogVisible = false
              //刷新数据列表
              that.getDeliveryList()
              //提示修改成功
              that.$message.success(res.data.msg)
            }else if (res.data.code === 10001){
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //修改快递
    modifyDelivery() {
      const that = this
      this.$refs.modifyFormRef.validate(valid => {
        if (valid){
          axios({
            method: 'put',
            url: '/delivery/modify',
            data: {
              deliveryId: that.modifyForm.deliveryId,
              orderId: that.modifyForm.orderId,
              deliveryNu: that.modifyForm.deliveryNu,
              deliveryCom: that.modifyForm.deliveryCom,
            },
            headers:{
              token: this.$cookie.get("adminToken")
            }
          }).then(res => {
            if (res.data.code === 10000){
              //关闭对话框重置回显
              that.modifyDialogVisible = false
              //刷新数据列表
              that.getDeliveryList()
              //提示修改成功
              that.$message.success(res.data.msg)
            }else if (res.data.code === 10001){
              that.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    //查询物流
    queryDeliveryUrl(nu, com) {
      window.location.href = 'https://www.kuaidi100.com/chaxun?com=' + com + '&nu=' + nu;
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