---
title: 高级查询
permalink: doc/repository
prev_page: /doc/exception
next_page: /doc/repository/rule
description_auto: 0
description: 高级查询
tags: symfony,phpzlc,查询
---


## 概述

高级查询的核心就是规则系统。

规则即查询规则,传入规则,查询系统就会根据规则自动的生成需要的查询Sql,返回查询结果。

这个理念,不是什么高级的想法,对于Symfony本身而言,其本身的查询系统,也支持这样去做,并且还有辅助的IDE提示。

但我还是要说,PHPZlc的查询系统在Symfony原有的查询系统上做了一次较大的革新,会给你带来的全新的体验。

## 架构定义

`Symfony`,`Doctrine`提供了许多的手段来完成`SQL`的构建。在通常情况下,其足够简单安全。但在构建较为复杂的查询的时候,就需要了解更多的额外知识,手动的完成表、字段和类、属性的绑定。

这个过程不是复杂的,但是却很繁琐和机械。试想,我们面对的是已知的表结构,为什么不能让工作变得更简单了,将这些低效重复的工作交给底层了。

我一直认为`SQL`是系统重要的资源,有些业务逻辑就是`SQL`本身。我们有将其复用的需要,实际中也有人将其复用。但是我们一直缺乏一套完整的体系,对其进行定义,使得`SQL`可以像使用代码一样轻松灵活的拆分,组合。并且最终可以在认知执行层面可以明确其存在。

## 父类继承

继承

```php
PHPZlc\PHPZlc\Doctrine\ORM\Repository\AbstractServiceEntityRepository
```

这个类的上层继承的还是官方原有的类

```php
Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository
```

这里无需手动完成,生成的出来的`Repository`类代码会自动继承。

## 底层策略

最底层的使用逻辑,传入规则,对`SQL`的各部分进行字符串拼接,然后连接起来生成完整的`SQL`。

主要需要理解两个数组即可,所有的工作都是在其上开展。

1. 模版数组

    ```php
    //在初始化方法中根据Entity结构定义,给数组进行赋值。
    public $telSqlArray = array(
        'alias' => 't',  //表别名
        'from' => '',    //表名
        'join' => '',    //连表sql部分
        'select' => '',  //查询sql部分
        'where' => '',   //条件sql部分
        'orderBy' => '',  //排序sql部分
        'finalOrderBy' => '', //最终排序sql部分 默认主键ID倒序排列
        'primaryKey' => '', //主键字段
        'aliasIncrease' => '0', //别名计数器,用于动态计算,此值无需关注
        'falseDeleteField' => '' //假删除字段 系统默认为is_del,bool类型,如果表中存在此字段,则默认赋值
    );
    ```
   
   _在初始化方法中根据Entity结构定义,给数组进行赋值。_
  
   _在初始化方法中对其进行修改,将应用于全局。_
   
   ```php
   public function __construct(ManagerRegistry $registry)
   {
       parent::__construct($registry, User::class);

       $this->telSqlArray['from'] = 'user';
   }
   ```
   
2. 执行数组

   ```php   
   //执行数组,每次查询时将$telSqlArray值赋予
   public $sqlArray = array(
       'alias' => '',
       'from' => '',
       'join' => '',
       'select' => '',
       'where' => '',
       'orderBy' => '',
       'finalOrderBy' => '',
       'primaryKey' => '',
       'aliasIncrease' => '',
       'falseDeleteField' => ''
   );
   ```
   
   _在每个查询执行前,将 `$telSqlArray` 中的内容赋值给 `$sqlArray`。_
   
   _我们只需要对`$sqlArray`的各部分进行改写,就可以影响最终形成的`SQL`。_
   
3. 拼接算法

    ```php
    private function generateSql()
    {
        return "SELECT {$this->sqlArray['select']} FROM {$this->sqlArray['from']} {$this->sqlArray['alias']} {$this->sqlArray['join']} WHERE 1 {$this->sqlArray['where']} {$this->sqlArray['orderBy']}";
    }
    ```
           
    _代码中消失的`finalOrderBy`会在运用过程中拼接到`orderBy`的最后。_
   
## 具体如何干预SQL

读到这里,我们就很清楚,这一套看似很复杂系统的本质,其实是由一个很简单的策略在维持。我们只需要对`$sqlArray`的各部分进行改写,就可以影响最终形成的`SQL`。

1. 通常的`SQL`,可以定义规则,触发规则进行改写。
    
   这里我们不过多的描述规则这个概念,你可以理解他为一组方法,具体可以在后续的规则篇中进行详细说明。
   
2. 部分高级的`SQL`过于复杂,需要定制化的处理。

   ```php 
   $userRepository = $this->getDoctrine()->getRepository('App:User');
     
   //调用规则处理方法,让系统形成一个基本完成的`$sqlArray`
   $userRepository->rules([]);
     
   //对sqlArray进行改写
   $userRepository->sqlArray['from'] = 'user';
     
   //得到sql
   $sql = $userRepository->getSql();
     
   //执行sql,返回的数组,不是对象集合
   $users = $this->getDoctrine()->getConnection()->fetchAll($sql);
   ```

## 特性介绍与高级用法
          
1. 通过分析SQL自动调用底层绑定,自动化工作减少学习成本,工作压力。

   **原理**
   
   对`SQL`进行结构分析,结合`Entity`结构,自动调用[Doctrine Native SQL](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/native-sql.html)方法。

   `Native SQL`并不复杂,学习难度不高,他是用一组方法将表,字段和类,属性进行绑定,完成查询结果对象化的工作。
   
   **特性弊端与解决方法**
   
   我们希望这个过程足够的聪明,事实上现在绝大多数他都会让你满意,但是在一些高度自定义的场景中,机器的选择往往不能满足需要。所以我们在查询方法中增加参数。
   
   ```php
   ResultSetMappingBuilder $resultSetMappingBuilder = null;
   ```

   
   使用这个参数,你可以参照上文链接,学习`Native SQL`的工作原理。
   
3. 横纵向SQL资源的打通。

   什么是纵向SQL资源了,简单点说就是关于这张表定义的条件,排序,子查询。
   
   什么是横向SQL资源了,就是你可以在在连表查询时可以使用目标表中全部所定义的SQL资源。
   
   我认为这两个方向的打通,可以使得定义SQL资源成为一个有意义的事情。
   
   本来这个功能是很难实现的,但是现在与symfony底层相结合,借助其生成的结构网络,让其变成可能。
   
   在使用中,希望你多多的定义sql资源,合理的定义和设置,不光使得你的sql变得更好管理,也将增加系统的功能储备。

4. 别名的负担和冲突。 

   表名不会重复,但别名会不会重复了,是会的。比如 `admin` 和 `article`,如果将这个独立来看,那么别名都是`a`。这时候就很尴尬了,因为我们在定义sql资源的时候,是以当前表入手的,所以不可能知道其他地方有没有使用过这个别名。
 
   这个问题,可能在传统写法中,不是很突出,但是要让所有的定义的sql资源可以串联使用,那么冲突问题就会变得不得不考虑了。
   
   我们希望的做法是什么样的了,最起码保证我们在定义的时候足够简单,当出现冲突的时候,我们可以通过指令对别名进行修正。
  
   所以我们可以通过在查询方法中增加 `string $aliasChain = ''` 参加来实现此策略,并且定义关键词`sql_pre`作为当前表别名的描述词。
   
   `$aliasChain`传参格式为
   
    ```text
    sql_pre:a=>c,b=>a;at:a=>c,b=>a;
    ```
    
    **格式解析:**
    
    表别名1: 目标别名1=>修正别名1;目标别名2=>修正别名2;
    
    **用法解析:**
    
    在定义资源的时候,我们定义当前表的别名为`sql_pre`,在进行查询的时候,本表的别名就是`sql_pre`。
    
    在进行连表查询的时候,主表的别名还是`sql_pre`, 连接的表本身别名和定义的SQL资源别名都将被指定的别名替换。
    
    这时候,就会出现别名冲突的问题,这时候,我们需要局部修正。所以按照格式,我们需要找到是哪张表里面的资源出现了问题,这张表就是`表别名1`,需要替换的别名就是`目标别名`,正确的别名就是`修正别名`。
   
  
5. 查询出来的数据为实体或实体集合,可以通过系统`to_array()`方法将其自动转为数组,也可以通过定义数据解析方法,实现针对性差异化。

   我们为什么痴迷于实体转为对象,是因为对象可以提供更便捷的体验,更多的可能,更完整的概念。他很好。那么为什么我们需要将对象转为数组了,因为我们需要数据在各个系统之间交换。
   
   很好的体验是,在`twig`中可以使用对象。所以我们的集中需求是在API中。
 
   将实体对象自动转为数组,这很难么？以前我觉得其很难,但我后来知道了symfony序列化的方案,感觉应该不会很难。
   
   但我还是坚持保留下这个策略,因为他更直观,更方便。
   
   1. toArray()
   
       ```php
       final public function toArray($entity, $params = ['level' => 0]): array
       ```
   
       **方法解析**
       
       支持一个实体对象传入,对其进行递归,自动调取每个字段属性的get方法。
       
       `$params` 控制参数,可自定义。
       
       `level` 递归的层数
       
       如果对数组格式有特定要求的可以自定义方法,自定义方法要求参数名,参数个数,参数含义和此方法一致。
        
       例如
       
       ```php
       public function toApiArray($entity, $params = []);
       ```
   
   2. arraySerialization 数据序列化方法
   
       ```php
       final public function arraySerialization($result, $decoratorMethodParams = ['level' => 0], $decoratorMethodName = 'toArray') : array
       ```
   
       **方法解析**
         
       支持一个对象或者对象集合传入,底层使用调用`toArray`。
         
       `$decoratorMethodParams`：序列化方法的参数,参照`toArray`的`$params`参数。
       
       `$decoratorMethodName`: 序列化方法的名称。

## 规则执行顺序

1. 传入规则

2. 进行规则演算,加入必要规则和连带规则,且获得实体类和表的关系。

3. 运行规则,拼接sql。

4. 解析sql,和实体对照,对查询表,字段进行一一绑定,建立联系,保证查询出来的结构落入的位置是正确的。

5. 对sql进行最终整理,优化查询速度。

6. 执行sql返回实体结果。

## 使用小贴士

1. sql_pre是什么？ 

   当前表的别名是不确定的,所以使用sql_pre指代当前表的别名。这个指代是很重要的,他可以保证你可以集中经历思考如何以当前表构建查询。
   
   如
   
   实际sql：
   
   ```sql
   select u.id from user u
   ```
   
   编码时应该为：
   
   ```sql
   select sql_pre.id from user sql_pre 
   ``` 
   
   
   
   

