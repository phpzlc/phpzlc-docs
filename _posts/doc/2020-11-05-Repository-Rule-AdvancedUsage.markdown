---
title: 规则-高级用法
permalink: doc/repository/rule-advanced-usage
prev_page: /doc/repository/rule
next_page: /doc/symfony-flex
description_auto: 0
description: 规则-高级用法
tags: symfony,phpzlc,rule,规则,高级用法,必要规则,重写规则,聚合查询,规则重写,复杂查询,定义规则
---

## 架构定义

对于规则的干预,高级运用。

## 定义新规则(重写规则)

创建新的规则,如果创建的规则和字段规则重名,就可以覆写字段规则的执行条件和执行内容。

1. 书写位置

   在生成的`Repository`文件中,包含了两个基本方法。
   
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

2. 规则定义

   在`registerRules`方法中注册规则
   
   ```php
   public function registerRules()
   {
       $this->registerCoverRule('keyword', '关键词搜索');
   }
   ```
   
   **说明**

   (1) `keyword`就是规则名,他不需要在前面加上别名。
   
   (2) 如果我们需要对字段规则重写的话,以 `id` 的`LIKE`规则举例子,规则名为 
   
   ```php
   "id" .Rule::RA_LIKE
   ``` 
   
3. 执行内容定义

   在`ruleRewrite`中方法中对其进行实现

    ```php
    public function ruleRewrite(Rule $currentRule, Rules $rules, ResultSetMappingBuilder $resultSetMappingBuilder)
    {
        if($this->ruleMatch($currentRule, 'keyword') && !Validate::isRealEmpty($currentRule->getValue())){
            $this->sqlArray['where'] .= " AND (sql_pre.name LIKE '%{$currentRule->getValue()}%' OR sql_pre.phone LIKE '%{$currentRule->getValue()}%') ";
        }
    }
    ```
   
   **说明**
   
   (1) `ruleMatch`方法用来判断规则是否匹配。
    
   (2) `isRealEmpty`方法是用来判断规则是否符合执行条件,这个判断并不是必须的。
    
   (3) 在执行体中,不光可以在`sql_array`数组各部分进行变更,也可以调用其他的规则,从而产生传导效果。
    
   (4) 规则值可以是已知的任意格式,对于复杂格式,应当在定义处进行注释说明。
    
   (5) 在执行体中我们如果需要重写在字段`Sql`的话,需要使用通过
    
   ```php
   $this->registerRewriteSql('id', '(1 + 1)')
   ```
      
   实现。
   
   **注意**
   
   每个执行体必须包在规则判断中,否则会出现反复执行的问题。

4. 规则定义规范
  
   (1) 规则和执行目的应当清晰,可以轻松的进行组合。
  
   (2) 规则调用应当足够的简单,应当可以相互触发,减少心智压力。
  
   (3) 规则一旦被使用,不要轻易的变更,因为其影响很大。
  
   (4) 不要轻易的定义新的规则,对规则要有架构的意识。

## 必要规则

必要规则指的是查询这张表就必须执行的规则。

_例如查询A表就必须连结b表,查询A表就必须增加某些条件等等。_

1. 使用方法

   在生成的`Repository`文件中,找到`registerRules`方法。
    
   ```php
   public function registerRules()
   {
       //注册必要规则
       $this->registerNecessaryRule(new Rule('id', 12));
   }
   ```

## 规则碰撞

规则在多层传递中,就会出现规则重复调用的情况。这种情形就称为规则冲突,需要碰撞处理。

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
   
4. `jointClass`

   联合执行类,当碰撞规则为`Rule::JOINT`时有效。
   
   默认类,对字符串进行拼接。
   
   ```php
    new \PHPZlc\PHPZlc\Doctrine\ORM\Rule\Joint\StringJoint(); 
   ```
   
   _可以通过实现接口自定义执行类。_
     
   ```php
   PHPZlc\PHPZlc\Doctrine\ORM\Rule\InterfaceJoint
   ```
   
5. `jointSort`

   联合执行优先顺序,当碰撞规则为`Rule::JOINT`时有效。
   
   默认值: `Rule::ASC`

   ```php
   Rule::ASC // 正序  （上一级排在前面）
    
   Rule::DESC// 倒序 （当前级排在前面）
   ```
   
## 书写复杂SQL和聚合查询的使用方法

   [前往了解原理,学习方法](/doc/repository/base#具体如何干预sql)。
