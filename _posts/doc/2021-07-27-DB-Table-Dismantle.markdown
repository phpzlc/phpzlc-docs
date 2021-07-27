---
title: 单表拆分
permalink: doc/db/table-dismantle
prev_page: /doc/db/query
next_page: /doc/business
description_auto: 0
description: 单表数据量较大的时候，我们需要进行拆表，以减少单表的负荷，这时候如何管理拆分出的表就十分重要，决定了程序的维护难度。
tags: symfony,phpzlc,查询,select
---

## 架构定义

单表数据量较大的时候，我们需要进行拆表，以减少单表的负荷，这时候如何管理拆分出的表就十分重要，决定了程序的维护难度。

## 使用

```php
namespace App\Repository;

use App\Entity\User;
use PHPZlc\PHPZlc\Doctrine\ORM\Repository\AbstractDismantleTableRepository;

class UserRepository extends AbstractDismantleTableRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }
}

```

将需要拆表的`实体类`的`Repository`类继承`AbstractDismantleTableRepository`即可。


## 创建表

```php
$this->getDoctrine()->getRepository('App:user')->dismantleMark('123')->createDismantleTable();
```

`dismantleMark()`方法用于设置分表标识。 为了分表标识生成表的稳定性，程序默认对分表标识进行`m5`。 你如果想要修改分表标识的使用，可以重写`getDismantleTableName()`。


## 更新拆分表的结构

```php
$this->getDoctrine()->getRepository('App:user')->updateAllDismantleTable();
```

源表的结构发生变化的时候，我们需要将所有拆分出的表结构进行更新。

## 获取全部的拆分表表名

```php
$this->getDoctrine()->getRepository('App:user')->getAllDismantleTable();
```

当你重写了`getDismantleTableName()`后，你需要关注这个方法，做对应的调整。
