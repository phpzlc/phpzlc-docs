---
title: RBAC权限(RBAC-business)
permalink: doc/module/rbac-business
prev_page: /doc/module/admin-business
next_page: /doc/module/auth-business
description_auto: 0
description: RBAC权限(RBAC-business)
tags: rbac,rbac-business,权限,phpzlc/rbac-business
---

## 业务介绍

简易RBAC 权限业务组件,支持角色,权限,用户。和Symfony路由绑定关系,支持多平台,各个位置皆可使用。

## 源码地址

[phpzlc/rbac-business](https://github.com/phpzlc/RBAC-business)

## 安装

```shell
composer require phpzlc/rbac-business
```

## 实战例子

可以在 [demo-blog](https://github.com/phpzlc/demo-blog) 或 [admin-business](https://github.com/phpzlc/admin-business) 找到实战应用。

## 权限注册

1. 路由注册

   ```yaml
   admin_account:
     prefix: /account
     resource: 'account.yaml'
     options:
        platform: 平台
        permission_group: 权限分组
        permission_tag: 权限标识
        permission_description: 权限描述
   ```
   
   **技巧**
   
   _路由配置的时候,上层的`options`设置的参数会在下层的所有路由中生效。_
   
   _如果两个路由共用一个权限,只要将`permission_tag`设置为一样即可。系统以第一次出现的配置参数为准,后面相同的权限其他参数可忽略。_
   
   **场景**
   
   可以在入口方法处验证路由是否有访问权限,便捷鉴权。
   
   ```php
   
   use App\Business\RBACBusiness\RBACBusiness;
   
   $this->rbac = new RBACBusiness($this->container, PlatformClass::getPlatform());

   $this->rbac->setIsSuper(CurAuthSubject::getCurUser()->getIsSuper());
   
   //对路由进行权限校验
   if(!$this->rbac->canRoute($this->get('request_stack')->getCurrentRequest()->get('_route'))){
       if(self::getReturnType() == SystemBaseController::RETURN_HIDE_RESOURCE){
           return Responses::error('权限不足');
       }else{
           return $this->render('@PHPZlcAdmin/page/no_permission.html.twig');
       }
   }

   //对菜单进行权限筛选
   $this->adminStrategy->setMenus($this->rbac->menusFilter($this->adminStrategy->getMenus()));
 
   ```

2. 自由注册

   **由于有些权限更为自由,和路由不是强绑定关系,就需要通过代码自由注册。**
   
   **书写位置：** _src/Business/RBACBusiness/PermissionBusiness.php_
   
   ```php
   *
   * @return array[]
   */
   public function getBuiltPermissions()
   {
       return [
           [
               'platform' => '平台',
               'permission_tag' => '权限标识',
               'permission_description' => '权限描述',
               'permission_group' => '权限分组',
               'routes' => [], //允许路由名
           ]
       ];
   }
   ```

## 权限写库和更新

1. 第一次写库

   执行内置数据命令的时候一并安装
   
2. 更新方法

    ```php
    (new PermissionBusiness($this->container))->builtUpdatePermission();
    ```

3. 安装`admin-business`组件的话可以点击页面上的清除缓存按钮更新。

## 页面效果展示

_以下效果来自`admin-business`_

1. 角色与权限(首页)

   ![角色与权限(首页)](/assets/posts/rbac-business/2.png)

2. 角色与权限(分配权限)

   ![角色与权限(首页)](/assets/posts/rbac-business/3.png)

3. 账号和角色

   ![角色与权限(首页)](/assets/posts/rbac-business/4.png)


## 鉴权与核心方法

1. 核心逻辑类

   **文件路径:**
    
   _src/Business/RBACBusiness/RBACBusiness.php_
   
   **类命名空间** 
   
   ```php
   use App\Business\RBACBusiness\RBACBusiness; 
   ```
   
   **初始化**
   
   ```php
   new RBACBusiness($this->container, PlatformClass::getPlatform());
   ```

2. 设置是否为超级管理员

   ```php
   public function setIsSuper($isSuper)
   ```
   
   _如果是超级管理员,则拥有全部权限。_

3. 判断是否有权限

   ```php
   /**
    * 验证是否有权限
    *
    * @param $permissions //需要验证的权限标记,支持多个。可传数组或字符串。
    * @param string $model //匹配模式 or 或者 and
    * @param UserAuth|null $userAuth // 需要鉴权的用户,不传为当前登录用户
    * @return bool
    */
   public function can($permissions, $model = 'and', UserAuth $userAuth = null)
   ```

4. 判断是否有访问路由的权限

   ```php
   /**
    * 验证路由是否有权限访问
    * 
    * @param $route //  路由名
    * @param UserAuth|null $userAuth //需要鉴权的用户,不传为当前登录用户
    * @return bool
    */
   public function canRoute($route, UserAuth $userAuth = null)
   ```
5. 清除用户权限菜单缓存
   
   ```php
   /**
    * 清除缓存
    *
    * @param UserAuth|null $userAuth //需要鉴权的用户,不传为当前登录用户
    */
   public function clearCache(UserAuth $userAuth = null)
   ```
    
