<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
      
    <el-card>
      <div>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable  @clear="getuserList">
              <el-button slot="append" icon="el-icon-search" @click="getuserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"><el-button type="primary" @click="addDialogVisible = true">添加用户</el-button></el-col>
        </el-row>
      </div>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!--  {{scope.row}}获取本行的所有数据 -->
          <template slot-scope="scope">   <!--作用域插槽-->
            <el-switch v-model="scope.row.mg_state"   @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUserInfo(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
               <el-button type="info" icon="el-icon-setting" size="mini" @click="setDialogVisible(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!--    添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="handleclose"
      >
      <el-form :model="addRuleForm" :rules="rulesForm" label-width="100px" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="30%">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editRulesForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editValidate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="30%" @close="closeDialogAll">
    <div>
      <p>用户姓名：{{userInfo.username}}</p>
      <p>用户角色：{{userInfo.role_name}}</p>
      <div>分配角色
        <el-select v-model="valueid" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="closeDialog()">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    // 验证邮箱规则
    var checkEmail = (rule, value, cd) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return cd()
      }
      cd(new Error('请输入合法邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, cd) => {
      var regMobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if(regMobile.test(value)){
        return cd()
      }
      cd(new Error('请输入合法手机号'))
    }
    return{
      usersList:[],
      queryinfo:{
        query:'',
        pagenum:1,  /*当前页数*/
        pagesize:2 /*一页显示的数量*/
      },
      total:0,
      // 控制添加用户的显示与隐藏
      addDialogVisible:false,
      // 控制编辑修改对话框的显示与隐藏
      editDialogVisible:false,
      // 根据id查询到的用户信息对象
      editForm:{},
      // 控制分配角色对话框显示与隐藏
      dialogVisible:false,
      // 通过点击分配角色获取到的用户信息
      userInfo:'',
      // 角色列表
      roleList:[],
      // 选择的新角色id
      valueid:'',
      // 添加用户校验规则
      addRuleForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      rulesForm:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail ,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
           {validator: checkMobile ,trigger:'blur'}
        ],
      },
      // 编辑对话框对邮箱和手机的验证
      editRulesForm:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail ,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator: checkMobile ,trigger:'blur'}
        ],
      }
    }
    
  },
  created(){
    this.getuserList()
  },
  methods:{
    async getuserList(){
     const {data:res} = await this.$http.get('users',{params: this.queryinfo})
    //  console.log(res)
     if(res.meta.status ===200){
       this.usersList = res.data.users
       this.total = res.data.total
     }

    },

    // 监听pagesize改变的事件（一页显示的数量）
    handleSizeChange(newsize){
      // console.log(newsize)
      this.queryinfo.pagesize = newsize
      this.getuserList()
    },


    // 监听页码得改变事件（当前页）
    handleCurrentChange(newpage){
      // console.log(newpage)
      this.queryinfo.pagenum = newpage
      this.getuserList()
    },

    //改变用户状态
    async changeState(userinfo){
      const {data :res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if(res.meta.status === 200){
        this.$message.success('更新用户成功') 
      }
      else{
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户失败')
      }
      
    },

    // 监听添加用户框关闭
    handleclose(){
      this.$refs.addForm.resetFields()
    },

    adduUsers(){
      // 添加用户预验证
      this.$refs.addForm.validate(async valid=>{
        console.log(valid)
        if(!valid) return 
        // 预校验通过，可发起请求
       const{data :res} =await this.$http.post('users',this.addRuleForm)
       console.log(res)
       if(res.meta.status !==201) return this.$message.error('添加用户失败')

       this.$message.success('添加用户成功')
      // 隐藏对话框
       this.addDialogVisible = false
      //  重新获取用户列表
       this.getuserList()
      })
    },

    // 控制编辑对话框
    async showDialog(id){
      this.editDialogVisible = true
      // console.log(id)
      const {data:res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.editForm = res.data

    },
    // 对编辑对话框进行预验证
    editValidate(){
      this.$refs.editFormRef.validate(async valid =>{
         if(!valid) return
         const {data: res} =await this.$http.put('users/' + this.editForm.id,{email: this.editForm.email, mobile: this.editForm.mobile})

         if(res.meta.status !== 200){
           return this.$message.error('更新失败')
         }

        //  关闭编辑对话框
        // 更新用户列表
        // 显示更新成功
          this.editDialogVisible = false
          this.getuserList()
          this.$message.success(res.meta.msg)
      })
    },
    async removeUserInfo(id){
     const confirmRule = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          
          // 捕获取消行为
        }).catch(err=>err)
        // console.log(confirmRule)
        // 如果用户确认删除，则返回值为字符串confirm
        // 如果用户取消删除，则返回值为字符串cancel
        if(confirmRule!=='confirm'){
          return this.$message.info('已取消删除')
        }
        
      const {data:res} =await this.$http.delete('users/' + id)
      if(res.meta.status !==200){
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getuserList()
    },

    async setDialogVisible(userInfo){
      this.userInfo = userInfo
      this.dialogVisible = true

      const {data:res} = await this.$http.get('roles')
     
      if(res.meta.status !==200){
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    
      
     
    },
// 点击按钮，分配角色
    async closeDialog(){
      if(!this.valueid){
        return this.$message.error('分配角色失败')
      }
     
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role` , {rid:this.valueid})
      
      this.getuserList()
      this.$message.success('分配角色成功')
      this.dialogVisible = false

    },

// 关闭对话框时，选择框清空
    closeDialogAll(){
      this.valueid = ''
    }
    
    
  }

}
</script>

<style lang="less" scoped>

</style>