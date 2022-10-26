---
title: 后台开发(admin-business)
description: 后台开发,提供管理系统基础功能(首页,登录,退出登录,修改密码等管理系统基础功能)
keys: admin-business,phpzlc/admin-business,admin,后台
---
## 功能介绍

提供管理系统基础功能(首页、登录、退出登录、修改密码、创建角色分配权限等管理系统基础功能)


## 源码地址
[phpzlc/admin-business](https://github.com/phpzlc/admin-business) 

## 安装

```shell
composer require phpzlc/admin-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

## 配置

> 路由配置

在项目根路由中config/routes.yaml引入

```yaml
admin:
    resource: "routing/admin/admin.yaml"
    prefix:   /admin
    options:
        platform: admin

upload:
    resource: "routing/upload/upload.yaml"
    prefix:   /upload

captcha:
    resource: "routing/captcha/captcha.yaml"
    prefix:   /captcha
```

> 代码配置

   **平台注册**

   文件位置: `config/packages/phpzlc-platform-business.yaml`

```yaml
# 平台 - 后台
platform_admin: admin

# 全部平台
platform_array:
    '%platform_admin%': 后台
```

   **操作主体注册**

   文件位置: `config/packages/phpzlc-auth-business.yaml`

```yaml
# 操作主体- 管理员
subject_admin: admin

# 全部操作主体
subject_array:
    '%subject_admin%': 管理员
```

   **登录标记代码注入**

   文件位置: `src/Business/AuthBusiness/AuthTag.php`

```php
/**
* 设置Session标记
* 
* @param ContainerInterface $container
* @param UserAuth $userAuth
* @return string
* @throws Exception
*/
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

/**
* 获取Session标记内容
* 
* @param ContainerInterface $container
* @return UserAuth|false|object
* @throws Exception
*/
public static function get(ContainerInterface $container)
{
    $userAuth = null;

    /**
    * @var ManagerRegistry $doctrine
    */
    $doctrine = $container->get('doctrine');

    switch (PlatformClass::getPlatform()){
        case $container->get('parameter_bag')->get('platform_admin'):
            $user_auth_id = $container->get('session')->get(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'));
            $userAuth = $doctrine->getRepository(UserAuth::class)->find($user_auth_id);
            break;
        default:
            throw new \Exception('来源溢出');
    }

    return $userAuth;
}

/**
* 移除Session标记
* 
* @param ContainerInterface $container
* @throws Exception
*/
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

   **登录类引入**

   文件位置: `src/Business/AuthBusiness/UserAuthBusiness.php`

```php
use App\Business\AdminBusiness\AdminAuth;

/**
* 获取指定平台端方法
*
* @param $subject_type
* @return AdminAuth|mixed
* @throws Exception
*/
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

> README.md 补充

   **php.ini**

```apacheconfig
upload_max_filesize = 1024M
post_max_size = 1024M
```

   **nginx**

```apacheconfig
client_max_body_size     1024M;
proxy_connect_timeout    9000s;
proxy_read_timeout       9000s;
proxy_send_timeout       9000s;
```

   **文件夹权限**

```shell
sudo chmod -R 755 public/upload/
```

> 后台超级管理员账号密码

```text
aitime 123456
```


## 仪表盘
   
   [如何编写仪表盘页面](https://phpzlc.com/doc/module/admin#%E4%BB%AA%E8%A1%A8%E7%9B%98%E5%9F%BA%E6%9C%AC%E5%86%99%E6%B3%95)
   
   ![首页](/_image/posts/admin-business/index.png)
   
## 列表页 
   
   [如何编写列表页](https://phpzlc.com/doc/module/admin#%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E5%9F%BA%E6%9C%AC%E5%86%99%E6%B3%95)
   
   ![列表页](/_image/posts/admin-business/list.png) 
   
## 新增/编辑页面
   
   [如何编写新建/编辑页](https://phpzlc.com/doc/module/admin#%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2%E5%9F%BA%E6%9C%AC%E5%86%99%E6%B3%95)
   
   ![新建/编辑页](/_image/posts/admin-business/page.png)
    
## 权限功能

   本框架提供一套标准化的权限功能[RBAC](/rbac-business/index.markdown)。

1. 对路由进行权限校验   
   
   需要在AdminController层中调用此方法
   
   ```php
   //对路由进行权限校验
   if(!$this->rbac->canRoute($this->get('request_stack')->getCurrentRequest()->get('_route'))){
       if(self::getReturnType() == SystemBaseController::RETURN_HIDE_RESOURCE){
            return Responses::error('权限不足');
       }else{
            return $this->render('@PHPZlcAdmin/page/no_permission.html.twig');
       }
   }
   ```
2. 对菜单进行权限筛选
   
   ```php
   //对菜单进行权限筛选
   $this->adminStrategy->setMenus($this->rbac->menusFilter($this->adminStrategy->getMenus()));
    ```
3. 判断是否拥有权限 

   ```php
   $rbac = new RBACBusiness(ContainerInterface $container, $platform = null);
   $rbac->setIsSuper($isSuper);
   $rbac->can($permissions, $model = 'and', UserAuth $userAuth = null);
   ```   








