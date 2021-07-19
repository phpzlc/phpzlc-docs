---
title: 平台标识(platform-business)
permalink: doc/module/platform-business
author_no: 2
prev_page: /doc/module/auth-business
next_page: /doc/module/captcha-business
description_auto: 0
description: 提供多平台管理的基础功能
tags: platform,platform-business,平台,phpzlc/platform-business
---
## 业务介绍

提供多平台管理的基础功能

## 源码地址

[phpzlc/platform-business](https://github.com/phpzlc/platform-business) 

## 安装

```shell
composer require phpzlc/platform-business
```

## YAML配置

config/packages/phpzlc-platform-business.yaml
```yaml
parameters:
# 默认参数(根据需求可自行添加平台,用户参数)

# 平台 - 后台
platform_admin: admin

# 全部平台
platform_array:
  '%platform_admin%': 后台      

```

## 提供功能

```php
namespace App\Business\PlatformBusiness;
   
use PHPZlc\PHPZlc\Bundle\Business\AbstractBusiness;
use Psr\Container\ContainerInterface;
   
class PlatformClass extends AbstractBusiness
{
    const NOT_LOGIN_GO_URL = 'not_login_go_url';
       
    /**
    * 平台名称
    * 
    * @var string
    */
    private static $platform;
   
    /**
    * 获取平台名称
    * 
    * @return string
    */
    public static function getPlatform()
    {
        return self::$platform;
    }
   
    /**
    * 设置平台名称
    * 
    * @param $platform
    */
    public static function setPlatform($platform)
    {
        self::$platform = $platform;
    }
   
    /**
    * 得到所有平台名称
    *
    * @param ContainerInterface $container
    * @return array
    */
    public static function getPlatforms(ContainerInterface $container)
    {
        return array();
    }
} 
   ```
