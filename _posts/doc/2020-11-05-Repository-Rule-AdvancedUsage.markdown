---
title: 规则-高级用法
permalink: doc/repository/rule-advanced-usage
prev_page: /doc/repository/rule
next_page: /doc/symfony-flex
description_auto: 0
description: 规则-高级用法
tags: symfony,phpzlc,rule,规则,高级用法,必要规则,重写规则,聚合查询,规则重写，复杂查询
---

## 规则碰撞

规则碰撞所面对的业务场景是这样的。

我们在编程中代码是分层的,我们喜欢将公共部分集成到方法,复杂公共性强的查询也不例外。

集成不代表万事大吉了,我们通常需要通过传参进行调整执行策略。回过头看查询,我们认为规则作为一个指令集合,他应该有资质很好的完成这个工作。

但经过实现,简单的数组是不胜任这份工作的。因为如果出现传入方法中已使用的规则,那么底层的规则会直接覆盖传入的规则。所以我们为了解决这个问题,

必须增加更多的标识进行判断。这就是增加对象写法的直接原因。

**使用**

```php
use PHPZlc\PHPZlc\Doctrine\ORM\Rule\Rules;
use PHPZlc\PHPZlc\Doctrine\ORM\Rule\Rule;

$rules = new Rules(
    [
        new Rule(new Rule('id', $id))
    ]
);

$rules
    ->addRule(new Rule('id', $id))
    ->addRule(new Rule('name', $name));
```

上面的代码中我们将原来简单的数组转换为对象。规则碰撞的控制是由`Rule`对象的其他属性进行控制的。

下面我们将详细说明`Rule`的初始化方法。

```php
public function __construct($name, $value ,$collision = null, $jointClass = null, $jointSort = null)
```

**解析:**

1. `name`

    规则名

2. `value`

    规则值

3. `collision` 

    碰撞规则

    ```php
    Rule::REPLACE 取代  //如果底层出现相同规则,则忽略底层规则
    
    Rule::FORGO 放弃  //如果底层出现相同规则,则使用底层规则
    
    Rule::JOINT 联合  //如果底层出现相同规则,则将规则值拼接或连结
    ```
   
    默认值：
    
    全局规则默认联合,排序顺序为`Rule::ASC`。其他规则默认取代。

4. `jointClass`

   联合执行策略类,当碰撞规则为`Rule::JOINT`时有效。
   
   默认值：`new \PHPZlc\PHPZlc\Doctrine\ORM\Rule\Joint\StringJoint()`; 对字符串进行拼接。
   
   **如何自定义拼接执行类？**
   
   可以通过实现接口`PHPZlc\PHPZlc\Doctrine\ORM\Rule\InterfaceJoint`来完成。
   
5. `jointSort`

   联合执行优先顺序,当碰撞规则为`Rule::JOINT`时有效。
   
   默认值: `Rule::ASC`

   ```php
   Rule::ASC // 正序  （上一级排在前面）
    
   Rule::DESC// 倒序   （当前级排在前面）
   ```

## 概述

必要规则指的是查询这张表就必须执行的规则。

例如查询A表就必须连结b表,查询A表就必须增加某些条件等等。

## 实现

在生成的`Repository`文件中,找到registerRules方法

```php
     public function registerRules()
     {
         $this->registerNecessaryRule(new Rule('id', 12));
     }
```

---
title: 聚合定制查询
permalink: doc/repository/aggregate-custom-queries
---

## 概述

具体请详读[解析篇](http://127.0.0.1:4000/doc/repository/principle)。

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
