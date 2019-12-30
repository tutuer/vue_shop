import Vue from 'vue'
import VueRouter from 'vue-router'
import Login  from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
 {
   path:'/login',
   component: Login
 },
 {
   path:'/home',
   component:Home,
   redirect:'/welcome',
   children:[
     {
       path:'/welcome',
       component:Welcome
     },
     {
       path:'/users',
       component:Users
     },
     {
       path:'/rights',
       component:Rights
     },
     {
      path:'/roles',
      component:Roles
    }
   ]
 }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next)=>{
  if(to.path === '/login') return next()
  // 若无其他页面，先取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 若token不存在，跳到登录页
  if(!tokenStr) return next('/login')
  // 若存在，直接放行
  next()
  
})

export default router
