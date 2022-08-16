---
title: 工具类-SQL
description: 提高SQL编写效率。
keys: symfony,phpzlc,sql,tool
---

## 架构定义

提高SQL编写效率。

## 文档

```php
use use PHPZlc\PHPZlc\Doctrine\ORM\Untils\SQL;
```

1. static function in

    将作为`in`查询的字符串进行加工,使其不报错

    ```php
    SQL::in($string)?:string
    ```
   
    **原理**
    
    作为`in`查询字符串,一般为`123,123`。加工策略会给每端字符串增加引号。返回结果为`"123","123"`。

2. static function simpleArrayIn

   实现`simple_array`的`in`查询策略
   
   ```php
   SQL::simpleArrayIn(($value , $column)?:string
   ```

   **方法解析**
     
   `$value`   作为`in`查询字符串,一般为`123,123`

   `$column`  被查询的`simple_array`字段名,一般为`sql_pre.column_name`

3. static function sqlPreReplace
   
   替换`sql`中的`sql_pre`前缀为指定前缀

   ```php
   SQL::sqlPreReplace($sql , $pre)?:string
   ```