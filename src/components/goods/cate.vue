<template>
  <div>
      <!-- 面包屑 -->
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加分类按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showDialog">添加分类</el-button>
            </el-col>
        </el-row>
         <tree-table class="tree_table" :data="cateList" :columns='columns' :selection-type='false' :expand-type="false" show-index border>
             <template slot="isok" slot-scope="scope">
                 <i class="el-icon-check" v-if="scope.row.cat_deleted ===false"></i>
                 <i class="el-icon-close" v-else></i>
             </template>
             <template slot="order" slot-scope="scope">
                 <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                 <el-tag v-else-if="scope.row.cat_level === 1"  type="warning" size="mini">二级</el-tag>
                 <el-tag v-else type="danger" size="mini">三级</el-tag>
             </template>
             <template slot="opt">
                 <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                 <el-button type="danger" icon="el-icon-delete">删除</el-button>
             </template>
         </tree-table>
         <!-- 分页 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paramsInfo.pagenum"
            :page-sizes="[5, 10,15, 20]"
            :page-size="paramsInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类表单 -->
    <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%">
        <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateRules" label-width="100px">
            <el-form-item label="分类名称:" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="父级分类:">
                <!-- options指定数据源 -->
                <!-- props用来指定配置对象 -->
                 <el-cascader
                    :options="prantsCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="parentChange"
                    clearable
                    collapse-tags
                   checkStrictly
                   ></el-cascader>
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            paramsInfo:{
                // 页码值，第几页
                pagenum: 1 ,
                // 每页多少条
                pagesize:5
            },
            cateList:[],
            total: 0,
            // 控制对话框显示隐藏
            dialogVisible:false,
            // 添加数据表单数据对象
            addCateForm:{
                // 父级分类id
                cat_pid: 0,
                // 父级分类
                cat_level: 0,
                // 分类名称
                cat_name:'',
            },
            // 添加表单验证规则
            addCateRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                   
                ]
            },
            columns:[
                {
                label:'分类名称',
                prop:'cat_name' 
            },
            {
                label: "是否有效",
                type: "template",
                template: "isok"
            },
             {
                label: "排序",
                type: "template",
                template: "order"
            },
             {
                label: "操作",
                type: "template",
                template: "opt"
            }
            ],
            prantsCateList:[],
            cascaderProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 选中的父级分类数组
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
        const {data} = await this.$http.get('categories',{params:this.paramsInfo})
        if(data.meta.status !==200) return data.meta.msg
        // 获取分类数据
        this.cateList = data.data.result
        // 获取总数据
        this.total = data.data.total
        
        },
            // 每页条数
        handleSizeChange(newsize){
            this.paramsInfo.pagesize = newsize
            this.getCateList()
        },
            // 监听pagenum的改变
        handleCurrentChange(newpagenum){
           this.paramsInfo.pagenum = newpagenum
           this.getCateList()
        },
        showDialog(){
            this.dialogVisible = true
            this.getPrantsCateList()
        },
        // 获取父级分类列表
        async getPrantsCateList(){
            const {data :res} = await this.$http.get('categories' ,{params: {type: 2}})
             if(res.meta.status !== 200) return res.meta.msg
             this.prantsCateList = res.data
        },
        // 选择项发生变化触发
        parentChange(){
            console.log(this.selectedKeys)
        }

       
        

    }
}
</script>

<style>
.tree_table{
    margin-top: 20px;
}
.el-cascader{
    width: 100%;
}
</style>