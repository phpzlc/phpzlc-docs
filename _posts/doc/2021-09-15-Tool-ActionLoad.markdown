---
title: 工具类-ActionLoad
permalink: doc/tool/action-load
prev_page: /doc/tool/log
next_page: /doc/exception
description_auto: 0
description: 控制器Action之前加载处理。用于在控制器前过滤参数，书写前置业务，设置全局变量。
tags: symfony,phpzlc,tool,action-load
---

## 架构定义

控制器Action之前加载处理。用于在控制器前过滤参数，书写前置业务，设置全局变量。

## 全局静态变量

```php
use PHPZlc\PHPZlc\Bundle\Safety\ActionLoad;

//全局ContainerInterface变量
ActionLoad::$globalContainer;

//全局ObjectManager变量
ActionLoad::$globalDoctrine;
```

## 拓展链接

1. [如何设置前后过滤器](https://symfony.com/doc/current/event_dispatcher/before_after_filters.html#creating-an-event-subscriber)