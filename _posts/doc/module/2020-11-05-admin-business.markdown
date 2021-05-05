---
title: 后台开发(admin-business)
permalink: doc/module/admin-business
author_no: 2
prev_page: /doc/module/business
next_page: /doc/module/RBAC-business
description_auto: 0
description: 后台开发,提供管理系统基础功能(首页,登录,退出登录,修改密码等管理系统基础功能)
tags: admin-business,phpzlc/admin-business,admin,后台
---
## 功能介绍

提供管理系统基础功能(首页，登录，退出登录，修改密码等管理系统基础功能)


## 源码地址
[phpzlc/admin-business](https://github.com/phpzlc/admin-business) 

## 安装

部署本地食谱服务器(必要的步骤)

部署方式详见: [自托管的 Symfony Flex 服务器](/doc/symfony-flex)

部署他的原因是框架的组件食谱尚未成功合并到官方仓库,未部署配置的话组件无法正常工作。

```shell
composer require phpzlc/admin-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

## 项目中引用

在项目根路由中config/routes.yaml引入
```yaml
admin:
  resource: "routing/admin/admin.yaml"
  prefix:   /admin
```


## 提供功能

1.生成多级菜单目录

```php
 // 以我们的demo-blog为例
 // 菜单
        $menus = [
            new Menu('博客管理系统', null, null, null, null, [
                new Menu('统计台', null, 'admin_statistical_station_index', $this->generateUrl('admin_manage_statistical_station_index'), null),
                new Menu('用户管理', null, 'admin_blog_user', $this->generateUrl('admin_users_index'), null),
                new Menu('分类管理', null, 'admin_sort_index', $this->generateUrl('admin_manage_sort_index'), null),
                new Menu('博客管理', null, null, null, null, [
                    new Menu('文章管理', null, 'admin_article_index', $this->generateUrl('admin_blog_manage_article_index'), null),
                    new Menu('评论管理', null, 'admin_commentary_index', $this->generateUrl('admin_blog_manage_commentary_index'), null),
                    new Menu('标签管理', null, 'admin_label_index', $this->generateUrl('admin_blog_manage_label_index'), null),
                    new Menu('收藏管理', null, 'admin_collection_index', $this->generateUrl('admin_blog_manage_collection_index'), null)
                ])
            ])
        ];
```
效果
[菜单](/assets/posts/admin-business/menu.png)

2.设置管理端基本信息(名称,页面标记，菜单......)
```php
$menus = [];
$this->adminStrategy = new AdminStrategy($this->container);

        //设置管理端基本信息(名称,页面标记,菜单,登录页面，修改密码页面，退出登录......)
        $this->adminStrategy
            ->setTitle('Admin')
            ->setEntranceUrl($this->generateUrl('admin_manage_index'))
            ->setEndUrl($this->generateUrl('admin_manage_logout'))
            ->setSettingPwdUrl($this->generateUrl('admin_manage_edit_password'))
            ->setMenuModel(AdminStrategy::menu_model_simple)
            ->setPageTag($this->page_tag)
            ->setLogo($this->adminStrategy->getBaseUrl() . '/asset/logo.png')
            ->setMenus($menus);
```

## 页面编写(以demo-blog为例)

#### 基础

继承基础页面

```twig
@PHPZlcAdmin/page/index.html.twig
```

1. 数据显示页面(后端管理系统常见页面)

重写main_content 最外层包一层div

```twig
<div class="search-page clearfix" ></div>
```

搜索模块

```twig
<!-- 搜索框 start -->
    <el-row class="page-search">
        <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="90px" style="margin-left: 10px">

            <el-form-item label="用户名:" prop="user_name">
                <el-input v-model="searchForm.user_name" size="mini" clearable placeholder="请输入">
                </el-input>
            </el-form-item>

            <el-form-item label="登录时间" prop="login_at" class="search-item-time">
                <el-date-picker v-model="searchForm.login_at" size="mini" clearable type="daterange"
                                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" size="mini" @click="searchBtn()"> 搜索 </el-button>
                <el-button size="mini" @click="resetForm('searchForm')"> 重置 </el-button>
            </el-form-item>

        </el-form>

    </el-row>
    <!-- 搜索框 end -->
```

数据显示模块

```twig
  <!-- 数据显示 start-->
     <el-table :data="listData" style="width: 100%" border class="mt-10">
 
         <el-table-column prop="user_name" label="用户名"></el-table-column>
 
         <el-table-column prop="create_at" label="注册时间"></el-table-column>
 
         <el-table-column prop="login_at" label="最后登录时间"></el-table-column>
 
         <!-- 添加操作行 start -->
         <el-table-column prop="date" label="操作" width="200">
             <template slot-scope="scope">
                 <el-button size="mini" @click="handleDisable(scope.$index, scope.row)" type="danger"> 禁用 </el-button>
                 <el-button size="mini" @click="handleEnable(scope.$index, scope.row)" type="success"> 启用 </el-button>
             </template>
         </el-table-column>
         <!-- 添加操作行 end -->
 
     </el-table>
     <!-- 分页 start -->
     <el-col class="mt-20 clearfix">
         <el-pagination class="page" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                        :page-sizes="[20, 60, 100, 200]" :page-size="{{ rows }}" :hide-on-single-page="true" :current-page="{{ page }}"
                        layout="total, sizes, prev, pager, next, jumper" :total="{{ count }}">
         </el-pagination>
     </el-col>
     <!-- 分页 end -->
 
     <!-- 数据显示 end -->
```

Vue代码模块 重写main_content_vue

```twig
<script>
    new Vue({
        el: '#main-content',
        //用于替换vue数据调用符号
        // delimiters: ['${', '}$'],
        data: function () {
            return {
                searchForm: {
                    user_name: '',
                    mailbox: '',
                    login_at: ''
                },

                listData: [
                    {
                        id: '',
                        user_name: '',
                        create_at: '',
                        login_at : '',
                    },
                ],
            }
        },

        created(){
            //页面初始化勾子
        },

        methods: {
                handleCurrentChange(val) {
                    window.location.href = urlParamWrite(getSelfUrl(), 'page', val);
                },

                handleSizeChange(val) {
                    window.location.href = urlParamWrite(getSelfUrl(), 'rows', val);
                },

                // 搜索按钮
                searchBtn() {},

                // 重置按钮
                resetForm(formName){
                    this.$refs[formName].resetFields();
                },

                handleDisable(index, row){},

                handleEnable(index, row){},

        }

    })
</script>
```

效果
[数据显示页](/assets/posts/admin-business/index.png)

2. 新建/编辑页面

重写main_content 最外层包一层div

```twig
    <div class="add-page clearfix"></div>
```

form表单

```twig
 <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="left" class="form-content">
            <el-form-item label="标签名称:" prop="name" size="mini" class="el-form-width-all" label-width="100px">
                <el-input v-model="form.name" placeholder="请输入" style="width: 150px"></el-input>
            </el-form-item>

            <el-form-item label="标签描述:" prop="describe" size="mini" class="el-form-width-all" label-width="100px">
                <el-input type="textarea" v-model="form.describe" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item size="mini">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm()">取消</el-button>
            </el-form-item>

        </el-form>
```

Vue代码模块 重写main_content_vue

```twig
    <script>
        new Vue({
            el: '#main-content',
            data: function () {
                return {
                    id: '',
                    form: {
                        id: '{{ info.id | default }}',
                        name: '{{ info.name | default }}',
                        describe: '{{ info.illustrate | default }}',
                    },
                    rules: {
                        name: [
                            { required: true, message: '请输入标签名称', trigger: 'blur' },
                        ],

                        describe: [
                            { required: true, message: '请输入标签描述', trigger: 'blur' },
                        ],
                    },

                }
            },
            created() {
                // // 页面初始化使用
                // console.log(1);
            },
            methods: {
                submitForm(formName) {
                },
                resetForm() {
                    window.location.href ="{{ admin_url_anchor() }}";
                },
                handleChange(value) {
                    console.log(value);
                },
                handleRemove(file, fileList) {
                    console.log(file, fileList);
                },
                handlePreview(file) {
                    console.log(file);
                },
            }
        })
    </script>
```

效果
[新建/编辑页面](/assets/posts/admin-business/edit.png)









