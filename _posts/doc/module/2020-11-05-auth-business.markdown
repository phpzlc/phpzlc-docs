---
title: 登录授权(auth-business)
permalink: doc/module/auth-business
author_no: 2
prev_page: /doc/module/RBAC-business
next_page: /doc/module/platform-business
description_auto: 0
description: 登录授权(auth-business)
tags: symfony,phpzlc,package,business,业务,auth,auth-business
---
## 业务简介

授权登录业务(auth-business),是我们开发的一系列第三方业务组件之一。

其中授权登录业务组件是比较重要的一环,该组件是用来对管理系统的登录授权进行统一管理的操作,安装完该组件后可以极大的减少在登录授权模块的开发时间,极大的提高开发的效率。

## 如何安装？

[phpzlc/auth-business](https://packagist.org/packages/phpzlc/auth-business) 授权登录业务,用来对管理系统的登录授权进行统一管理的操作

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

[CurAuthSubject](#) 当前授权登录用户信息类,属于该业务的基本类,用来对管理系统当前登录用户信息的存储与操作

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

[SubjectAuthInterface](#) 登录组件接口类,属于该业务的基本类,用来规定多用户类型多平台类型的基本方法,该基本类可以根据多用户类型多平台类型进行改写

1.检查用户状态
```php
public function checkStatus($user)
```

2.获取用户信息
```php
public function user($rules)
```

[UserInterface](#) 授权接口类,属于该业务的基本类,当管理系统设置多平台多用户类型继承该类

```php
interface UserInterface
{

}
```

[AuthTag](#) 授权标记类,属于该业务的基本类,用来操作管理系统的session

1.设置Session标记

该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台登录进行设置session的操作

```php
public static function set(ContainerInterface $container, UserAuth $userAuth)
    {
        $tag = '';

        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $container->get('session')->set(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'), $userAuth->getId());
                break;

            default:
                throw new \Exception('来源溢出');
        }

        return $tag;
    }
```

2.获取Session标记内容

该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台进行获取session的操作,在本组件中,我们统一获取的返回值为对象

```php
public static function get(ContainerInterface $container)
    {
        /**
         * @var ManagerRegistry $doctrine
         */
        $doctrine = $container->get('doctrine');

        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $user_auth_id = $container->get('session')->get(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'));
                $userAuth = $doctrine->getRepository('App:UserAuth')->find($user_auth_id);
                if(empty($userAuth)){
                    Errors::setError(new Error('登录失效,请重新登录', -1));
                    return false;
                }
                break;

            default:
                throw new \Exception('来源溢出');
        }

        return $userAuth;
    }
```

3.移除Session标记

该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台进行删除session的操作

```php
public static function remove(ContainerInterface $container)
    {
        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $container->get('session')->remove(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'));
                break;

            default:
                throw new \Exception('来源溢出');
        }
    }
```

[UserAuthBusiness](#) 用户登录业务类,属于该业务的基本核心类,是整个授权登录组件的业务层,用来对管理系统中的登录业务的操作

1.新建用户授权信息

```php
public function create(UserAuth $userAuth, $is_flush = true)
    {
        $userAuth->setCreateAt(new \DateTime());
        
        if(!$this->validator($userAuth)){
            return false;
        }

        try {
            $this->em->persist($userAuth);
            
            if($is_flush){
                $this->em->flush();
                $this->em->clear();
            }
            
            return true;
            
        }catch (\Exception $exception){
            $this->networkError($exception);
            return false;
        }
    }
```

2.获取指定平台端方法

```php
private function getUserAuthService($subject_type)
    {
        if(!array_key_exists($subject_type, $this->subjectAuthCaches)){
            switch ($subject_type){
                case $this->getParameter('subject_admin'):
                    $this->subjectAuthCaches[$subject_type] = new AdminAuth($this->container);
                    break;
                    
                default:
                    throw new \Exception('授权登录权限不存在');
            }
        }
        
        return $this->subjectAuthCaches[$subject_type];
    }
```

4.账号登录方法

```php
public function accountLogin()
```

5.修改密码方法

```php
public function changePassword()
```

6.检查登录状态方法

```php
public function isLogin()
```

