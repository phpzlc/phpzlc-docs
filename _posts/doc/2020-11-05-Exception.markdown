---
title: Exception
permalink: doc/exception
prev_page: /doc/tool/log
next_page: /doc/repository
description_auto: 0
description: 定义异常类,监听异常做响应式处理
tags: symfony,phpzlc,exception,异常监听
---

## 架构定义

定义异常类,监听异常做响应式处理

## PHPZlc异常类

```php
use PHPZlc\PHPZlc\Abnormal\PHPZlcException;

throw new PHPZlcException();
```

## API异常监听

```php
use PHPZlc\PHPZlc\Bundle\EventListener\ApiExceptionListener\ApiException;

throw new ApiException('接口错误');
```

**系统会监听此异常类,直接中止程序,抛出Api响应。**

```json
{"code":1,"msg":"\u63a5\u53e3\u9519\u8bef","msgInfo":[],"data":[]}
```