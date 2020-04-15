<template>
  <div> 
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['border_bottom', i1 === 0 ? 'border_top': '' ,'rcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5"><el-tag closable @close="removeTag(scope.row, item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                            <!-- 渲染二三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6" :class="[i2 === 0 ? '' : 'border_top' ,'rcenter']"><el-tag type="success" closable @close="removeTag(scope.row, item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                            <el-tag type="warning"  closable @close="removeTag(scope.row, item3.id)" v-for="(item3, i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>                     
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                   <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="showSetDiolg(scope.row)">分配权限</el-button>
                   </template>
                </el-table-column>
            </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog  title="权限分配"  :visible.sync="setDialogVisible" @close="setRightsDialog">
        <el-tree ref="treeRef" :data="retRoleList" :props="defaultProps" show-checkbox :default-expand-all="true" node-key="id" :default-checked-keys = "defaultChoose"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allKeys">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data(){
        return{
            rolesList:[],
            setDialogVisible: false,
            retRoleList:[],
            defaultProps:{
                children: 'children',
                label: 'authName'
            },
            // 默认勾选节点的id数组
            defaultChoose:[],
            // 点击权限分配对话框时，获取的角色id
            roleid:''
        }
    },

    created(){
        this.getRolesList()
    },

    methods:{
        async getRolesList(){
            const {data:res} =await this.$http.get('roles')

            if(res.meta.status !==200){
                return this.$message.error('获取角色列表失败')
            }

            this.rolesList = res.data
         
        },

        async removeTag(roleId, id){
            const confirmRult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
               
                if(confirmRult != 'confirm'){
                    return this.$message.error('取消删除')
                }
                
                const {data: res} = await this.$http.delete(`roles/${roleId.id}/rights/${id}`)
                    
                if(res.meta.status !==200){
                    return this.$message.error('删除权限失败')
                }
                this.$message.success('删除权限成功')
                roleId.children = res.data

        },

        async showSetDiolg(role){
            this.roleid = role.id
            const { data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !==200){
                return this.$message.error('获取权限列表失败')
            }
            this.retRoleList = res.data
           
            //递归获取三级节点的id
            this.getLeafKeys(role, this.defaultChoose)
            this.setDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到defaultChoose中
        getLeafKeys(node, arr){
            // 如果当前node节点不包含children属性，则是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => 
                this.getLeafKeys(item, arr)
            );
        },

        setRightsDialog(){
            this.defaultChoose = []
        },

        async allKeys(){
          const allKeys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
          ] 
        //   console.log(allKeys)
          const AllKeys = allKeys.join(',')
        //   console.log(AllKeys)
        

          const {data:res} = await this.$http.post(`roles/${this.roleid}/rights`, {rids: AllKeys})
          
          if(res.meta.status !==200){
              return this.$message.error('分配失败')
          }
          
          this.$message.success('分配成功')
          this.getRolesList()
          this.setDialogVisible = false
         
          

        }

    }
}
</script>

<style>
.el-button{margin:10px;}
.el-tag{margin: 10px;}
.border_top{border-top: 1px solid #eee;}
.border_bottom{border-bottom: 1px solid #eee;}
.rcenter{display: flex;align-items: center;}
</style>