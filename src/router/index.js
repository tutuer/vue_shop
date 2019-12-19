import Vue from 'vue'
import VueRouter from 'vue-router'
import Login  from '../components/Login.vue'
import Home from '../components/Home.vue'

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
   component:Home
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
