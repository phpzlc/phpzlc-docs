---
title: 规则重写
permalink: doc/repository/rule-rewriting
---

## 概述

规则重写包含两个功能,规则定义和规则重写。

规则定义可以注册自定义规则,如果定义的规则和字段规则匹配,则会取代默认字段规则的执行条件及执行策略。

## 实现

在生成的`Repository`文件中,包含了两个基本的空方法。

```php
class UserRepository extends AbstractServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function registerRules()
    {
        // TODO: Implement registerRules() method.
    }

    public function ruleRewrite(Rule $currentRule, Rules $rules, ResultSetMappingBuilder $resultSetMappingBuilder)
    {
        // TODO: Implement ruleRewrite() method.
    }
}
```

首先我们需要`registerRules`方法中注册规则

```php
    public function registerRules()
    {
        $this->registerCoverRule('keyword', '关键词搜索');
    }
```

注意：

1. `keyword`就是规则名,他不需要在前面加上别名。

2. 如果我们需要对字段规则重写的话,以 `id` 的`LIKE`规则举例子,规则名为 `"id" .Rule::RA_LIKE`;

之后我们在`ruleRewrite`中对其进行实现

```php
    public function ruleRewrite(Rule $currentRule, Rules $rules, ResultSetMappingBuilder $resultSetMappingBuilder)
    {
        if($this->ruleMatch($currentRule, 'keyword') && !Validate::isRealEmpty($currentRule->getValue())){
            $this->sqlArray['where'] .= " AND (sql_pre.name LIKE '%{$currentRule->getValue()}%' OR sql_pre.phone LIKE '%{$currentRule->getValue()}%') ";
        }
    }
```

说明：

1. `ruleMatch`方法用来判断规则是否匹配。

2. `isRealEmpty`方法是用来判断规则是否符合执行条件,这个判断并不是必须的。

3. 在执行体中,不光可以在`sql_array`数组各部分进行变更,也可以调用其他的规则,从而产生传导效果。

4. 规则值可以是已知的任意格式,对于复杂格式,应当在定义处进行注释说明。

5. 在执行体中我们如果需要重写sql的话,需要使用通过`$this->registerRewriteSql()`方法实现。

   ```php
   $this->registerRewriteSql('id', '(1 + 1)')
   ```

注意：

每个执行体必须包在规则判断中,否则会出现反复执行的问题。

## 编程建议

1. 规则和执行目的应当清晰,可以轻松的进行组合。

2. 规则调用应当足够的简单,应当可以相互触发,减少心智压力。

3. 规则一旦被使用,不要轻易的变更,因为其影响很大。

4. 不要轻易的定义新的规则,对规则要有架构的意识。

