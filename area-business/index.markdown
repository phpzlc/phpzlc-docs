---
title: 省市区业务组件(area-business)
description: 省市区组件,内置完整的省市区数据及接口
keys: area-business,area,地址,省市区
---
## 功能介绍

省市区组件,内置完整的省市区数据及接口

## 源码地址
[phpzlc/area-business](https://github.com/phpzlc/area-business)

## 安装

```shell
composer require phpzlc/area-business
php bin/console phpzlc:flex:install area-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

执行数据内置操作

```shell 
//内置数据(APP_ENV=dev环境下可执行)
php bin/console doctrine:fixtures:load  --append
```

## 配置

> 路由配置

在项目根路由中config/routes.yaml引入

```yaml
area:
   resource: "routing/area/area.yaml"
   prefix:   /area
```

## 省市区数据

![数据库结构](/_image/posts/area-business/entity.png)

# 提供开放API

![API](/_image/posts/area-business/api.png)









