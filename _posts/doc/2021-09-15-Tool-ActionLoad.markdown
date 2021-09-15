---
title: 工具类-ActionLoad
permalink: doc/tool/action-load
prev_page: /doc/tool/log
next_page: /doc/exception
description_auto: 0
description: 在action执行之前将$this::container对象静态化存储，方便在系统的各个位置进行调用。
tags: symfony,phpzlc,tool,action-load
---

## 架构定义

在action执行之前将`$this::container`对象静态化存储，方便在系统的各个位置进行调用。

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