---
title: 平台标识(platform-business)
permalink: doc/module/platform-business
author_no: 2
prev_page: /doc/module/auth-business
next_page: /doc/module/sms-business
description_auto: 0
description: 平台标识(platform-business)
tags: platform,platform-business,平台,phpzlc/platform-business
---
## 业务介绍

提供多平台管理的基础功能

## 源码地址

[phpzlc/platform-business](https://github.com/phpzlc/platform-business) 

## 安装

部署本地食谱服务器(必要的步骤)

部署方式详见: [自托管的 Symfony Flex 服务器](/doc/symfony-flex)

部署他的原因是框架的组件食谱尚未成功合并到官方仓库,未部署配置的话组件无法正常工作。

```shell
composer require phpzlc/platform-business
```

## 提供功能

多个平台基础功能

```php
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
```