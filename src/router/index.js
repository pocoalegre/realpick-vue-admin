import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Regist from "@/views/Regist";
import Home from '../views/Home.vue'
import Cookies from 'js-cookie'
import Welcome from "@/views/Welcome";

import AdminList from "@/views/admin/AdminList";
import AdminInfo from "@/views/admin/AdminInfo";
import AdminPwdModify from "@/views/admin/AdminPwdModify";
import UserList from "@/views/user/UserList";
import UserPwdModify from "@/views/user/UserPwdModify";
import BannerList from "@/views/page/BannerList";
import CategoryList from "@/views/category/CategoryList";
import ProductList from "@/views/product/ProductList";
import ProductImg from "@/views/product/ProductImg";
import ProductParam from "@/views/product/ProductParam";
import ProductSku from "@/views/product/ProductSku";
import OrderList from "@/views/order/OrderList";
import OrderDetail from "@/views/order/OrderDetail";
import DeliveryList from "@/views/delivery/DeliveryList";
import el from "element-ui/src/locale/lang/el";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: to => {
      const activePath = Cookies.get('activePath')
      if (activePath){
        return activePath
      }else {
        return '/welcome'
      }
    },
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        display: false
      },
      {
        path: '/adminList',
        name: 'AdminList',
        component: AdminList,
        parent: 1,
        self: '管理员列表',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/adminInfo',
        name: 'AdminInfo',
        component: AdminInfo,
        parent: 1,
        self: '当前管理员管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/adminPwdModify',
        name: 'AdminPwdModify',
        component: AdminPwdModify,
        parent: 1,
        self: '当前管理员密码修改',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/userList',
        name: 'UserList',
        component: UserList,
        parent: 2,
        self: '用户管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/userPwdModify',
        name: 'UserPwdModify',
        component: UserPwdModify,
        parent: 2,
        self: '用户密码修改',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/bannerList',
        name: 'BannerList',
        component: BannerList,
        parent: 3,
        self: 'Banner管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/categoryList',
        name: 'CategoryList',
        component: CategoryList,
        parent: 4,
        self: '商品类型管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/productList',
        name: 'ProductList',
        component: ProductList,
        parent: 5,
        self: '商品管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/productImg',
        name: 'ProductImg',
        component: ProductImg,
        parent: 5,
        self: '商品图片管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/productParam',
        name: 'ProductParam',
        component: ProductParam,
        parent: 5,
        self: '商品参数管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/productSku',
        name: 'ProductSku',
        component: ProductSku,
        parent: 5,
        self: '商品sku管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/orderList',
        name: 'OrderList',
        component: OrderList,
        parent: 6,
        self: '订单管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/orderDetail',
        name: 'OrderDetail',
        component: OrderDetail,
        parent: 6,
        self: '订单详情管理',
        icon: 'el-icon-s-tools',
        display: true
      },
      {
        path: '/deliveryList',
        name: 'DeliveryList',
        component: DeliveryList,
        parent: 7,
        self: '快递管理',
        icon: 'el-icon-s-tools',
        display: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) =>{
  //to：要访问的路径
  //from：从哪个路径来
  //next：放行函数
  //访问非登录页如果没有token强制跳转登录，有token时访问登录页强制跳转home页
  if (to.path === '/login'){
    if (Cookies.get('adminToken')){
      next({
        path: '/home'
      })
    }else {
      next()
    }
  }else if (to.path === '/regist') {
    next()
  }else {
    if (Cookies.get('adminToken')){
      next()
    }else {
      next({
        path: '/login'
      })
    }
  }
})

//捕获异常路由
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
