<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许第三级分类数值相关参数" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisAbled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table border :data="manyData" style="width: 100%">
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" size="mini" type="warning">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisAbled">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table border :data="onlyData" style="width: 100%">
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" size="mini" type="warning">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedCateKeys: [],
      // 默认选中的选项卡
      activeName: "only",
      // 动态参数数据
      manyData: [],
      // 动态参数数据
      onlyData: []
    };
  },
  computed: {
    isBtnDisAbled() {
      // 如果按钮被禁用则返回true，否则返回false
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    id() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类商品失败");
      }
      this.cateList = res.data;
    },
    // 获取参数列表
    async getParamsList() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.id}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.meta.msg;
      }
      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }
    },
    // 级联选择器中选项发生改变时触发此函数
    handleChange() {
      this.getParamsList();
    },

    async handleClick() {
      this.getParamsList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px 0;
}
.el-cascader {
  width: 30%;
}
</style>