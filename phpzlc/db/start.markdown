---
title: 创建使用数据库
description: Symfony创建配置使用数据库
keys: symfony,phpzlc,数据库
---

## 官方文档

[Databases and the Doctrine ORM](https://symfony.com/doc/4.4/doctrine.html)

[Doctrine](https://www.doctrine-project.org/)

如果你对数据库有更多的需要,应该详细的阅读 [doctrine 文档](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/index.html)

## 配置

配置文件: `.env.local`

追加:

```shell
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=5.7"
```

## 常用命令

1. 创建数据库

    ```shell
    php bin/console doctrine:database:create
    ```
   
2. 创建数据库结构

    ```shell
    php bin/console doctrine:schema:create
    ```
   
3. 更新数据库结构

    ```shell
    php bin/console doctrine:schema:update --force
    ```
 
 4. 删除数据库
 
    ```shell
    php bin/console doctrine:database:drop --force
    ```
