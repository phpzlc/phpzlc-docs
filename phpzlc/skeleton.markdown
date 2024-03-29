---
title: 目录与架构
description: Symfony4+目录与架构
keys: symfony,phpzlc,目录
---

## 目录文件作用介绍

```text
|--project
|----bin
|------console 控制台命令入口,用法`php bin/console {command}`
|----config  配置文件目录
|------bundles.php 注册Bundle
|------routes.yaml  根路由配置文件
|------services.yaml 服务常量配置文件
|------routes 路由目录(在此目录下的配置路由会自动引入)
|------routing 路由目录(需要手动引入,可以有层次的配置路由)
|------packages 包配置文件(在此目录下的配置文件会自动引入)
|--------dev 开发环境下配置文件目录
|--------prod 生产环境下配置文件目录
|--------test 测试环境下配置文件目录
|----migrations 数据库迁移修改记录,执行`migrations`相关的命令时会在此目录记录每次变更的具体`Sql`
|----public 对外公开目录
|------index.php 项目入口
|------bundles 各Bundles的静态资源,执行`php bin/console assets:install`生成
|------upload 上传附件存储位置
|------apidoc 文档目录,执行`php bin/console phpzlc:generate:document`生成
|--------index.html 文档访问入口
|----src 开发目录
|------Controller 控制器目录
|------Business 业务代码目录
|------Entity 实体,定义数据库结构
|------Document 文档定义目录
|--------Config.php 文档全局配置文件         
|------Repository 实体操作类目录,相当于model层
|------DataFixtures 内置数据
|------Kernel.php 内核,可以通过修改他,将不同的资源引入到项目中
|----templates 模版目录
|----test 测试目录
|----translations 翻译目录
|----var 临时文件目录
|------cache 缓存目录
|------log 日志目录
|----vendor 第三方组件库
|----.env 项目默认环境变量
|----.env.test 测试环境默认环境变量
|----.env.local 本地环境默认环境变量, 这里面定义的值会覆盖.env和.env.test定义的相同名称的环境值(需要手动创建)
|----.gitignore 设置git忽略哪些文件提交
|----composer.json composer配置文件
|----composer.lock  composer版本锁定文件
|----symfony.lock symfony版本锁定文件
|----README.md 项目说明,项目部署手册
```

## PHPZlc对目录的变更及架构意义

1. [src/Business](/phpzlc/business.markdown) 

    这个目录是PHPZlc生成的目录,主要用于书写复杂的业务代码。
    
2. [src/Document](/document-bundle/index.markdown)

    这个目录是PHPZlc生成的目录,主要用于书写API文档。
    
3. [src/DataFixtures](/phpzlc/data-fixtures.markdown)

    这是目录用于加载内置数据的执行类。

   


