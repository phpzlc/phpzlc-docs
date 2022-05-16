---
title: 工具类-Log
description: 便捷记录各类日志
keys: symfony,phpzlc,log,tool
---

## 架构定义

便捷记录各类日志。

## 文档

```php
use PHPZlc\PHPZlc\Bundle\Service\Log\Log;
```

1. 写日志
    
    ```php
    Log::writeLog($content, $logFileName = '');
    ```
   
   **方法解析**

   `$content` 日志内容
   
   `$logFileName` 日志文件名称; 如果不传会根据`$_ENV['APP_ENV']`写入到`prod.log`或`dev.log`中。
   
    _日志文件路径地址为`var/log/`_
    
2. 读日志

    ```php
     Log::readLog(int $rows = 20, string $logFileName = '');
    ```
   
   **方法解析**
   
   `$rows` 读取文件最后的行数
   
   `$logFileName` 志文件名称; 如果不传会根据`$_ENV['APP_ENV']`读取`prod.log`或`dev.log`中。
   
   _日志文件路径地址为`var/log/`_
   
   **此方法没有返回值,会直接将内容输出给页面,可以写一个接口通过此方法远程的查看日志内容**