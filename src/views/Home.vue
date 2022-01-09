<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>雀石优选后台管理系统</span>
      </div>
      <div class="admin-info">
        <el-avatar shape="circle" :size="35" :src="adminImg"></el-avatar>
        <span class="admin-nickname">{{ adminNickname }}</span>
        <el-button size="small" type="info" @click="this.logout">退出</el-button>
      </div>
    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
            background-color="#444444"
            text-color="#fff"
            active-text-color="#409eff"
            :default-active="activePath"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true">
          <!-- 一级菜单 -->
          <el-submenu :index="parent.number+''" v-for="parent in parentList">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="parent.icon"></i>
              <!-- 文本 -->
              <span>{{ parent.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="self.path" v-for="self in selfList"
                          v-if="self.parent === parent.number" @click="saveStatus(self.path)">
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="self.icon"></i>
                <!-- 文本 -->
                <span>{{ self.self }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.selfList = this.$router.options.routes[3].children.filter(res => {
      if (res.display) {
        return res;
      }
    })
    this.activePath = this.$cookie.get('adminActivePath')
  },
  data() {
    return {
      adminNickname: this.$cookie.get('adminNickname'),
      adminImg: this.adminHeadImg + this.$cookie.get('adminImg'),
      //菜单折叠
      isCollapse: false,
      parentList: [
        {
          number: 1,
          name: '管理员管理',
          icon: 'el-icon-s-custom'
        },
        {
          number: 2,
          name: '用户管理',
          icon: 'el-icon-s-custom'
        },
        {
          number: 3,
          name: '页面管理',
          icon: 'el-icon-menu'
        },
        {
          number: 4,
          name: '商品类型管理',
          icon: 'el-icon-menu'
        },
        {
          number: 5,
          name: '商品管理',
          icon: 'el-icon-menu'
        },
        {
          number: 6,
          name: '订单管理',
          icon: 'el-icon-menu'
        },
        {
          number: 7,
          name: '快递管理',
          icon: 'el-icon-menu'
        },
      ],
      selfList: [],
      //选中路径
      activePath: '',
    }
  },
  methods: {
    //切换菜单折叠与展开效果
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存选中状态
    saveStatus(activePath) {
      this.$cookie.set('adminActivePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #444444;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  position: relative;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }

  img {
    height: 40px;
    width: 40px;
  }
}

.el-aside {
  background-color: #444444;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #f7f7f7;
}

.toggle-button {
  background-color: #494949;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.admin-info {
  display: flex;
  justify-content: space-around;
  position: absolute;
  right: 10px;

  .admin-nickname {
    font-size: 15px;
    margin-right: 10px;
  }
}
</style>