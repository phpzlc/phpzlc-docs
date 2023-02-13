---
title: 安装与运行
description: PHPZlc安装和配置
keys: phpzlc,安装,配置
---

## 前言

在开始之前,阅读者需掌握Symfony,Composer,Git的基础知识。本篇教程需要一定的基础才可以阅读。

由于PHPZlc在不改变Symfony原有写法,也不丧失Symfony原有特性的前提下丰富特性,凝练写法。所以PHPZlc可以看作Symfony的一组具像化的用法场景,大家多数需要学习的其实还是Symfony原有的知识。

在教程中,不会对Symfony的使用细节进行过多的说明,知识的来源、拓展、解读会通过了解更多提供。

Symfony对于相同技术提供了多种使用途径,在教程中,所呈现的是PHPZlc认为比较合理的Symfony使用方式,有自己想法的小伙伴不必拘泥于此。

## 运行环境

**php >=7.2.5 (推荐PHP7.3)**

**mysql 5.7 +**

**composer 2 (推荐)**

## 安装Symfony5.4

```shell
composer create-project symfony/website-skeleton:"^5.4" my_project_name
```

这是Symfony5.4安装的命令,如果有疑问或者希望了解更多,请阅读官方文档[安装和设置Symfony框架](https://symfony.com/doc/5.4/setup.html)。

## PHPZlc内核安装

1. 安装phpzlc

   ```shell
   composer require phpzlc/phpzlc
   ```


2. 执行安装命令

   ```shell
   php bin/console phpzlc:flex:install phpzlc
   ```
   
  **由于 phpzlc 覆盖了一部分 symfony 内核代码,当使用过程之中由于 composer安装更新包 导致的程序报错，可以优先使用本命令进行修复。**

## IDE的选择和配置

1. 安装配置完毕有代码提示

    IDE:[PhpStorm](https://www.jetbrains.com/phpstorm/)

    [IDE配置,Symfony工具安装配置](https://www.jetbrains.com/help/phpstorm/symfony-support.html?_ga=2.242917706.978522081.1607327290-133517331.1605767311#enabling-the-symfony-plugin-for)

2. 忽略IDE目录提交

    找到项目根目录的`.gitignore`文件,追加

    ```text
    .idea
    .DS_Store
    ```
   
## Vender入Git库   

1. 找到项目根目录的`.gitignore`文件,将`vendor`所在行注释或删除。

2. 解决git子仓库问题
    
    ```shell
     rm -rf vendor/**/.git
    ```
    **在 ZSH 中**
    
    ```shell
    find vendor/ -type d -name ".git" -exec rm -rf {} \;
    ```
   
    _为避免业务组件重复安装,建议`Vender`入库。_
    
    _商业环境下,`Vender`入库是个不错的决定。因为这样会让使用者和部署者减少成本。在实践中,有些服务器无法访问外网,这就导致无法完成安装。_  

## 初始化Git仓库,添加远程地址, 提交到远程仓库

```shell
git init
git remote add origin {远程仓库克隆地址}
git add .
git commit -m "project init"
git push --set-upstream origin master
```

## 运行项目

1. 完善README.md,请将README.md第一行的项目名称改成自己项目的名称。

2. 按照README.md内容指导配置项目。

3. 将项目放置在apache开放目录下, 然后通过浏览器访问项目public/index.php文件即可。

## 常用组件

1. [phpzlc/admin-business](https://phpzlc.com/doc/module/admin-business) 后台业务组件,便捷的开发后台。开箱即用,免开发,内置了后台的基本功能(登录权限模块,管理员管理,权限管理)。

**更多组件前往[组件中心](/module/)。**

## 程序中已经安装了下述组件,他们构成了PHPZlc的核心策略

1. [phpzlc/phpzlc](https://github.com/phpzlc/phpzlc) 内核组件,确定基本技术特征,技术组织形式,技术规范,写法,接口定义等。
2. [phpzlc/validate](https://github.com/phpzlc/validate) 常用的验证方法和验证正则(可以独立使用)。
3. [phpzlc/document-bundle](https://github.com/phpzlc/document-bundle) API文档组件(可以独立使用), 用于项目API文档书写以及业务组件API文档书写。让API文档可以自由组合,随码而动。
4. [doctrine/doctrine-fixtures-bundle](https://github.com/doctrine/DoctrineFixturesBundle) 内置数据组件,Symfony官方组件,用于通过命令向数据库写入数据。
5. [ramsey/uuid](https://github.com/ramsey/uuid) 用于支持`Entity`实体类的主键从自增变为具有排序属性的UUID。方便项目向分布式拓展。
6. [phpzlc/fledx](https://github.com/phpzlc/flex) 用于 phpzlc包的安装。

## 开始编码

1. 开始

    一切准备就绪之后,让我们可以正式开始吧,[项目目录与架构](/phpzlc/skeleton.markdown)。

2. Demo(示例项目-个人博客系统)

    [https://github.com/phpzlc/demo-blog](https://github.com/phpzlc/demo-blog)。
