---
title: 工具类-ActionLoad-CommandLoad
description: 控制器接口何命令执行之前加载处理。用于在控制器前过滤参数，书写前置业务，设置全局变量。
keys: symfony,phpzlc,tool,action-load
---

## 架构定义

在`Action`，`Command` 执行之前将系统对象静态化存储，方便在系统的各个位置进行调用。

## 全局静态变量

```php
use PHPZlc\PHPZlc\Bundle\Safety\ActionLoad;

//全局ContainerInterface变量
ActionLoad::$globalContainer;

//全局ObjectManager变量
ActionLoad::$globalDoctrine;

//全局ParameterBagInterface变量
ActionLoad::$globalParameter;

//全局ValidatorInterface变量
ActionLoad::$globalValidation;
```

## 了解更多

1. [如何设置前后过滤器](https://symfony.com/doc/current/event_dispatcher/before_after_filters.html#creating-an-event-subscriber)