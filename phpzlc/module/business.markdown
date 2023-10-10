---
title: 业务组件(Business Package)
description: 将常用的业务场景打包成可以组件。安装即用,业务代码可以根据需要任意编辑。
keys: phpzlc,business,业务
---

## 架构定义

将常用的业务场景打包成可以组件。安装即用,业务代码可以根据需要任意编辑。

## 技术原理

基于 [Composer](https://getcomposer.org/) + [Symfony Flex](/phpzlc/symfony-flex.markdown),在安装包的时候将包内的代码复制到项目相应位置。

## 组件目录

```text
|--admin-business
|----Business 业务代码
|------AdminBusiness
|----Controller 控制器代码
|------Admin
|--------AdminController.php
|----DataFixtures 内置数据代码
|------AdminFixtures.php
|----Document 文档代码
|------Admin
|--------AdminBusiness.php
|----Entity 数据库实体类代码
|------Admin.php
|----Repository  数据库操作类代码
|------AdminRepository.php
|----routing 路由配置代码
|------admin
|--------admin.yaml
|----src 组件内程序
|------.gitignore
|----templates 模版文件代码
|------admin
|--------index.html.twig
|----.gitignore 设置git忽略哪些文件提交
|----composer.json composer配置文件
|----LICENSE 开源协议
|----README.md 使用说明
```

## composer.json 格式示例

```json
{
    "name": "phpzlc/admin-business",
    "description": "后台业务组件",
    "license": "MIT",
    "type": "library",
    "keywords": [
      "phpzlc",
      "admin",
      "symfony"
    ],
    "homepage": "",
    "authors": [
      {
        "name": "海底捞面条师傅",
        "email": "1847944340@qq.com",
        "role": "Developer"

      }
    ],
    "autoload": {
      "psr-4": {
        "PHPZlc\\AdminBusiness\\": "src/"
      }
    },
    "require": {
      "phpzlc/admin": "1.*",
      "phpzlc/auth-business": "1.*",
      "phpzlc/upload-business": "1.*",
      "phpzlc/captcha-business": "1.*"
    }

}
```

_可以根据自己的组件实际情况选取适当的目录。_

参照组件仓库: [phpzlc/admin-business](https://github.com/phpzlc/admin-business)。

## Symfony flex 食谱示例

```json
{
    "copy-from-package": {
      "routing/": "config/routing/",
      "Business/": "src/Business/",
      "Controller/": "src/Controller/",
      "Entity/": "src/Entity/",
      "Repository/": "src/Repository/",
      "templates/": "templates/",
      "DataFixtures/": "src/DataFixtures/"
    }
}
```

_`copy`的目录需要根据组件的实际情况决定。_

参照组件食谱代码: [contrib](https://github.com/phpzlc/contrib/tree/master/phpzlc/admin-business/1.0)。

## 了解更多

[食谱书写文档](https://github.com/symfony/recipes/blob/master/README.rst)

[phpzlc 食谱库](https://github.com/phpzlc/contrib)