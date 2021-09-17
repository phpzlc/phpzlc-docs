---
title: 快照组件(snapshot-business)
permalink: doc/module/snapshot-business
author_no: 2
prev_page: /doc/module/upload-business
next_page: /doc/module/vendor
description_auto: 0
description: 快照组件，在数据库中便捷的设置读取自定义参数。
tags: snapshot,symfony,phpzlc,快照
---
## 功能介绍

快照组件，在数据库中便捷的设置读取自定义参数。

## 源码地址

[phpzlc/snapshot-business](https://github.com/phpzlc/snapshot-business) 

## 安装

```shell
composer require phpzlc/snapshot-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

## 使用

```php
use App\Business\SnapshotBusiness\SnapshotBusiness;

$snapshotBusiness = new SnapshotBusiness($this->container);

//写入
$snapshotBusiness->setValue('key', 1);

//读取 如果没有设置key或者设置的值为空，则返回第二个参数"默认值"
$snapshotBusiness->getValue('key', 1);

//是否设置key
$snapshotBusiness->hasKey('key');
```
