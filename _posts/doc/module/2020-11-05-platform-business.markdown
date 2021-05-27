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

## 提供功能

多个平台基础功能

1. 获取平台名称

   ```php
    public static function getPlatform()
   ```
2. 设置平台名称
    
    ```php
    public static function setPlatform($platform)
    ```
3. 得到所有平台名称
   ```php
    public static function getPlatforms(ContainerInterface $container)
   ```