---
title: 简单查询
description: 这是个全新的内容,PHPZlc在Symfony原有的ORM查询支持上,封装了一套传入简单规则即可查询的方法。你会迅速降低学习成本,并且喜欢上他。
keys: symfony,phpzlc,查询,select
---

## 架构定义

这是个全新的内容,PHPZlc在Symfony原有的ORM查询支持上,封装了一套传入简单规则即可查询的方法。你会迅速降低学习成本,并且喜欢上他。

## 语法

```php
$userRepository = ActionLoad::$globalDoctrine->getRepository('App:User');

//检查数据是否存在
$userRepository->isExist($rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//通过id查询,后面两个参数暂不支持
$userRepository->find($id, $lockMode = null, $lockVersion = null);

//查询一行数据, 参数1等同与$rules, 参数2不支持, 方法等同于findAssoc, 方便之处在于支持原生symfony的提示功能
$userRepository->findOneBy(array $criteria, array $orderBy = null);

//查询一行数据
$userRepository->findAssoc($rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//查询最后一条数据, 排序原则按id倒叙
$userRepository->findLastAssoc($rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//根据id和规则查询一条数据
$userRepository->findAssocById($id, $rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//symfony原生方法,phpzlc未干预,不建议使用
$userRepository->findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null);

//查询全部数据
$userRepository->findAll($rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//查询分页数据
$userRepository->findLimitAll($rows, $page = 1, $rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//查询总数
$userRepository->findCount($rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');

//查询指定字段
$userRepository->findColumn($column, $rules = null, ResultSetMappingBuilder $resultSetMappingBuilder = null, $aliasChain = '');
```

## 简单查询示例

```php
$userRepository->findAssoc(['name' => '测试']);

$userRepository->findAssoc(['name' . Rule::RA_LIKE => '%'. $request->get('name') . '%',]);
```

_关于规则和更多的使用方法,见[高级查询](/phpzlc/repository/index.markdown)。_

## 了解更多

[Symfony4如何通过直接书写SQL控制数据库](https://phpzlc.com/blog/16528612833942-eff21b3de7bca-79)
