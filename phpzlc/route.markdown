---
title: 路由(Route)
description: Symfony路由
keys: symfony,phpzlc,路由
---

## 官方文档

[Symfony-Routing](https://symfony.com/doc/4.4/routing.html)

## 技术选型

Symfony的路由有三种配置方式。```注释```,```php```,```yaml```。常用的是```注释```和```yaml```。

在实际使用中,```注释```比较方便,适合简单应用。

大范围使用,应该选择```yaml```方式,因为其配置的有层次,写法也简单,便于检索和管理。

下文中主要介绍```yaml```方式,```注释```方式请参照[官方文档](https://symfony.com/doc/4.4/routing.html)。

## 配置文件地址

1. 根地址
```text
config/routes.yaml
```
2. 创建```config/routing```目录,放置路由配置文件

## 基础写法

1. 指向```yaml```配置文件

```yaml
##API模块
api:
  resource: "routing/api/api.yaml"
  prefix:   /api
```

2. 指向```Action```

```yaml
##首页
index:
    path: /
    controller: App\Controller\IndexController::index
```

## 配置规范

为了使配置出的路由有层次,便于管理和检索,需要遵循以下要求：

1. config/routing目录下的目录结构应当与src/Controller目录下的目录结构保持一致,一个Controller对应一个yaml文件。

2. 目录和文件的命名要求全小写,不同单词之间用```-```连接,例如```UserIndex```改为```user-index```。

3. 路由名按照目录层级追加例如

   上级为：
```yaml
api:
  resource: "routing/api/api.yaml"
  prefix:   /api
```
   下级为
```yaml
api_auth:
  resource: "routing/api/auth.yaml"
  prefix:   /auth
```
4. url路径设置需要全小写,不同单词之间也用```-```连接,例如
```yaml
api_user_info:
  resource: "routing/api/user-info.yaml"
  prefix:   /user-info
```

## 了解更多

[运用Symfony路由组件定制化开发](https://phpzlc.com/blog/16667763038835-7b9e1a20aecc4-70)
