<template>
  <div class="login_container">
      <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form :model="loginform" :rules="longinFormRules" ref="longinFormRef" class="login_form" label-width="0px">
                <!-- 密码区域 -->
                <el-form-item prop="username">
                    <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                     <el-input v-model="loginform.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="Login">登录</el-button>
                    <el-button type="info" @click="restLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
import { async } from 'q';
export default {
    data(){
        return{
            // 登录表单数据绑定对象
            loginform:{
                username:'admin',
                password:'123456'
            },
            // 若输入规则不正确，告知用户规则
            longinFormRules:{
                // 验证用户名是否正确
                username:[
                    { required: true, message: '请输入用户名字', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                // 验证密码是否输入
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 点击按钮，表单重置
        restLoginForm(){
            this.$refs.longinFormRef.resetFields()
        },
        // 表单预验证(发送请求时的验证)
        Login(){
            this.$refs.longinFormRef.validate(async valid=>{
                // console.log(valid)
                if(!valid) return; 
                // 与验证通过
                const { data:res} = await this.$http.post('login',this.loginform)
                if(res.meta.status !== 200) return this.$message.error('登陆失败')
                this.$message.success('登陆成功')

                // 登陆成功之后会返回一个token,在客户端将token保存到sessionStorage(当前网站打开期间生效)中
                // 因为后续所有api请求都要在登陆成功之后才能访问（token就是你登陆成功的证明）
                // 之后再通过变成是导航跳转到主页（push）
                // console.log(res)
                
                window.sessionStorage.setItem('token',res.data.token)
                this.$router.push('/home')

            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{ background-color:#2b4b6b;height: 100%;}
.login_box{
        width: 450px; 
        height: 300px;
        background-color: white;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top:50%;
        transform:translate(-50%,-50%);
        
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background:white;

        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
            }
        
    }
    .login_form{
        position: absolute;
        bottom:0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    }
   
    .btns{
        display: flex;
        justify-content: flex-end;
    }  

</style>