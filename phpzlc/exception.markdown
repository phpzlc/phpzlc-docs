---
title: Exception
description: 定义异常类,监听异常做响应式处理
keys: symfony,phpzlc,exception,异常监听
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

## prod模式下报错信息邮箱通知功能启用

1. 安装邮箱模块

   [官方文档：使用 Mailer 发送电子邮件](https://symfony.com/doc/5.4/mailer.html)

   运行

   ```shell
   composer require symfony/mailer 
   ```
   
2. 配置邮箱参数

   ```text
    # .env or .env.local
    MAILER_DSN=smtp://user:pass@smtp.example.com:port
   ```
 
3. 配置邮箱标题、发送邮箱、接收人邮箱（支持多个）

   ```text
   # .env or .env.local
   ERROR_EMAIL_COF=from:发送邮箱;to:接收邮箱1&接收邮箱2;subject:程序500报错
   ```

4. 注意

   邮箱配置发送失败可以在`prod.log`中查看原因。
