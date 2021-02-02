---
title: 必要规则
permalink: doc/repository/rule-necessary
---

## 概述

必要规则指的是查询这张表就必须执行的规则。

例如查询A表就必须连结b表，查询A表就必须增加某些条件等等。

## 实现

在生成的`Repository`文件中，找到registerRules方法

```php
     public function registerRules()
     {
         $this->registerNecessaryRule(new Rule('id', 12));
     }
```