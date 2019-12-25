<template>
    <el-container class="header_container">
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <h2>电商后台管理系统</h2>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div @click="handleCollapse">|||</div>
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff" 
                    :unique-opened="true" 
                    :collapse="isCollapse" 
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activeindex"
                    >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id +'' " v-for='item in menuList' :key ='item.id'>
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                        <i :class="iconList[item.id]"></i>
                        <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item 
                        :index="option.path + ''"
                         v-for="option in item.children " 
                         :key="option.id" 
                         @click="activeHandle(option.path + '')"
                         >
                            <!-- 二级菜单模板区 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{option.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconList:{
                125:'iconfont icon-yonghu',
                103:'iconfont icon-lifangti2',
                101:'iconfont icon-shangpingouwudai2',
                102:'iconfont icon-dingdan',
                145:'iconfont icon-shuju'
            },
            isCollapse:false,
            // 被激活的链接地址
            activeindex:''
        }
    },
    created(){
        this.getMenuList()
        // 刷新的时候（页面重新创建），扔前点击的人保持高亮状态
        this.activeindex = window.sessionStorage.getItem('activepath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList(){
            const { data:res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error('res.meta.msg');
            this.menuList = res.data
        },
        // 点击时，菜单的折叠于打开
        handleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        activeHandle(activepath){
            this.activeindex = activepath
            window.sessionStorage.setItem('activepath',activepath)
        }
    }
}
</script>

<style lang="less" scoped>
.header_container{
    height: 100%;
    }

.el-header{
    background: #373d41;
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div{
        display: flex;
        align-items: center;
        h2{
            font-size: 20px;
            color: white;
            margin-left:20px;
        }
    }
}
.iconfont{
    margin-right: 10px;
    font-size: 18px;
    }
.el-aside{
    background: #333744;
    
    .el-menu{
        border-right:none;
       
    }

     div{
            background: #4a5064;
            text-align: center;
            color: #fff;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }
.el-main{background: #eaedf1;}
</style>