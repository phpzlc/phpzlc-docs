---
title: 授权登录业务（auth-business）
permalink: doc/module/auth-business
author_no: 2
---
## 业务简介

授权登录业务(auth-business)，是我们开发的一系列第三方业务组件之一。

其中授权登录业务组件是比较重要的一环，该组件是用来对管理系统的登录授权进行统一管理的操作，安装完该组件后可以极大的减少在登录授权模块的开发时间，极大的提高开发的效率。

## 如何安装？

[phpzlc/auth-business](https://packagist.org/packages/phpzlc/auth-business) 授权登录业务，用来对管理系统的登录授权进行统一管理的操作

在Composer中查看是否满足安装的要求(安装phpzlc/auth-business 需要满足安装phpzlc/phpzlc:1.*的要求)

```shell
composer require phpzlc/auth-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

## 如何使用？

授权登录业务组件安装成功在项目的位置
```text
src/Business/AuthBusiness
```

[CurAuthSubject](#) 当前授权登录用户信息类，属于该业务的基本类，用来对管理系统当前登录用户信息的存储与操作

1.设置当前管理员授权信息（get方法：getCurUserAuth）
```php
public static function setCurUserAuth(UserAuth $userAuth)
    {
        self::$cur_user_auth = $userAuth;
    }
```

2.设置当前可跳转路由（get方法：getCurAuthSuccessGoUrl）
```php
public static function setCurAuthSuccessGoUrl($cur_auth_success_go_url)
    {
        self::$cur_auth_success_go_url = $cur_auth_success_go_url;
    }
```

3.设置当前登录用户信息（get方法： getCurUser）
```php
 public static function setCurUser(UserInterface $user)
    {
        self::$cur_user = $user;
    }
```

[SubjectAuthInterface](#) 登录组件接口类，属于该业务的基本类，用来规定多用户类型多平台类型的基本方法，该基本类可以根据多用户类型多平台类型进行改写

1.检查用户状态
```php
public function checkStatus($user)
```

2.获取用户信息
```php
public function user($rules)
```

[UserInterface](#) 授权接口类，属于该业务的基本类