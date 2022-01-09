<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="4" class="option-query">
          <el-select v-model="queryType" placeholder="请选择查询类型" clearable @clear="getAdminList" @change="getAdminList">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入查询信息" v-model="queryInfo" @keyup.enter.native="getAdminList" clearable
                    @clear="getAdminList">
            <el-button slot="append" icon="el-icon-search" @click="getAdminList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 管理员列表 -->
      <el-table :data="adminList" border stripe>
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
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
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
        width="20%"
        :close-on-click-modal="false">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AdminList",
  created() {
    this.getAdminList()
  },
  data() {
    return {
      //管理员列表
      adminList: [],
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
          label: '管理员编号',
          value: 'admin_id'
        },
        {
          label: '管理员名',
          value: 'admin_name'
        },
        {
          label: '管理员昵称',
          value: 'admin_nickname'
        },
      ],
      //图片预览
      showImgUrl: '',
      //图片预览对话框显示与隐藏,
      imgDialogVisible: false,
    }
  },
  methods: {
    getAdminList() {
      const that = this
      axios({
        method: 'get',
        url: '/admin/list',
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
          that.adminList = res.data.data.list
          that.total = res.data.data.total
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getAdminList()
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getAdminList()
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

.option-query {
  margin-right: -40px;
}
</style>