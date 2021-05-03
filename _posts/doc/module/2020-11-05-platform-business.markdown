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
## 业务简介

平台标识业务简介(platform-business),是我们开发的一系列第三方业务组件之一。
其中平台标识业务组件基础组件之一，该组件是用来对管理系统底层的标识进行统一管理，做到较高的耦合性，安装完该基础组件之后，我们可以对多管理平台进行统一管理，统一开发，达到快速，标准的开发。

## 如何安装？

[phpzlc/platform-business](https://packagist.org/packages/phpzlc/platform-business) 平台标识业务组件
在Composer中查看是否满足安装的要求(安装phpzlc/platform-business 需要满足安装phpzlc/phpzlc:1.*的要求)

```shell
composer require phpzlc/platform-business
```

## 如何使用?
平台标识业务组件是一个比较基础类的组件，其在本框架中多次被使用，具体使用方法可以参考[登录授权](https://phpzlc.github.io/doc/module/auth-business) AuthTag 授权标记类
