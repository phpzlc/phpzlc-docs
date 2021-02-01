---
title: 原理解析
permalink: doc/repository/principle
---

## 前言

Symfony,Doctrine提供了许多的手段来完成SQL的构建。在通常情况下，其足够简单安全。

但在构建更复杂的查询的时候，需要了解的知识和代码量都十分的庞大复杂，我们面对的是已知的表结构，为什么我们不能让工作变得更简单了，将这些低效重复的工作交给底层了。可能由于我的知识欠缺，但我确实未曾找到更好的写法示例。所以我自己实现了他。

我一直认为SQL是系统重要的资源，有些业务逻辑就是SQL本身。在很多场景中，我们将其复用，但却仍然不彻底，我希望有一套系统的策略，让我们可以像使用代码一样轻松灵活的对他们进行拆分，组合，控制。并且可以在认知执行上明确其存在。和上述不同的是，我认为其应该进入编程哲学。

经过商业项目验证，封装初步验证是成功的，各位可以放心，满足日常情况下所有功能需要。你仍然可以使用你熟悉的写法进行开发，在两者之间切换，这很容易。

这是个选择问题，这个方法还是存在缺陷的，还很年轻，和官方融合的程度还停留在基础写法。如果你的项目很成熟，很庞大，需要使用分表分库，对数据库的要求很高，我建议你可以观望，因为这方面我们还没有写法参照，必然是要踩一些坑的，这时候保守一些是正确的做法。如果你的项目没有如此苛刻的要求，我希望你使用，因为他将带给你很好的经历。

**如果你感兴趣，也可以自己搭建程序，进行验证，我们十分欢迎讨论。**

为了大家能够更全面的了解，下文将详细说明。

## 使用方法

继承

```php
PHPZlc\PHPZlc\Doctrine\ORM\RepositoryAbstractServiceEntityRepository
```

这个类的上层继承的还是官方原有的类

```php
Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository
```

这里无需手动完成，生成的出来的Repository类代码会自动继承。

## 基本的技术策略

1. 最底层的使用逻辑，传入规则，对SQL的各部分进行字符串拼接，然后连接起来生成完整的SQL。

    主要需要理解两个数组即可，所有的工作都是在其上开展。
    
    1. 模版数组

        ```php
        //模版数组，每次项目初始化时赋值
        public $telSqlArray = array(
            'alias' => 't',  //表别名
            'from' => '',    //表名
            'join' => '',    //连表sql部分
            'select' => '',  //查询sql部分
            'where' => '',   //条件sql部分
            'orderBy' => '',  //排序sql部分
            'finalOrderBy' => '', //最终排序sql部分 默认主键ID倒序排列
            'primaryKey' => '', //主键字段
            'aliasIncrease' => '0', //别名计数器，用于动态计算，此值无需关注
            'falseDeleteField' => '' //假删除字段 系统默认为is_del，bool类型，如果表中存在此字段，则默认赋值
        );
        ```
   
        1. 赋值原理
        
            在初始化方法中根据Entity结构定义，给数组进行赋值。
        
        2. 赋值修改 
       
            可以重写初始化方法，对其进行调整。 
            
            **在此处进行调整，将应用于全局，对所有查询sql生效。**
            
            ```php
            public function __construct(ManagerRegistry $registry)
            {
                parent::__construct($registry, User::class);
        
                $this->telSqlArray['from'] = 'user';
            }
            ```
    
    2. 执行数组   
    
        ```php   
        //执行数组，每次查询时将telSqlArray值赋予
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
       
        1. 初始化策略
        
           在每个查询执行前，将 `$telSqlArray` 中的内容赋值给 `$sqlArray`。
           
        2. 组合生成完成完整SQL
        
            ```php
            private function generateSql()
            {
                return "SELECT {$this->sqlArray['select']} FROM {$this->sqlArray['from']} {$this->sqlArray['alias']} {$this->sqlArray['join']} WHERE 1 {$this->sqlArray['where']} {$this->sqlArray['orderBy']}";
            }
            ```
           
           代码中消失的`finalOrderBy会`在运用过程中拼接到`orderBy`的最后。
           
        3. 重写策略
        
           读到这里，我们就很清楚，这一套看似复杂系统的本质，其实是由一个很简单的策略在维持，我们只需要对`$sqlArray`的各部分进行改写，就可以影响最终形成的SQL。
           
           对其的修改，通常在以下两个场景中发生。
           
           1. 在机制内，通过定义规则，触发规则进行改写。
           
              _这里我们不过多的描述规则这个概念，你可以理解他为一组方法，具体可以在后续的规则篇中进行详细说明。_
           
           2. 在机制外，部分高级的sql过于复杂，需要定制化的处理。
             
              ```php 
              $userRepository = $this->getDoctrine()->getRepository('App:User');
              
              //调用规则处理方法，让系统形成一个基本完成的`$sqlArray`
              $userRepository->rules([]);
              
              //对sqlArray进行改写
              $userRepository->sqlArray['from'] = 'user';
              
              //得到sql
              $sql = $userRepository->getSql();
              
              //执行sql
              $users = $this->getDoctrine()->getConnection()->fetchAll($sql);
              ```
            
2. 对SQL进行结构分析，结合Entity结构，自动调用[Doctrine Native SQL](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/native-sql.html)方法。

   首先说明Native SQL并不复杂，学习难度不高，他本质上是用一组方法将表，字段和类，属性进行绑定。所以对其没有改造，只是觉得实体结构已经已知，还需要手动绑定，感觉很麻烦。
   
   我们希望这个过程足够的聪明，事实上现在绝大多数他都会让你满意，但是在一些高度自定义的场景中，机器的选择往往不能满足需要。所以我们在查询方法中增加 ResultSetMappingBuilder $resultSetMappingBuilder = null；参数。
   
   使用这个参数，你可以参照小标题链接，学习Native SQL的工作原理。
   
3. 横纵向SQL资源的打通。

   什么是纵向SQL资源了，简单点说就是关于这张表定义的条件，排序，子查询。
   
   什么是横向SQL资源了，就是你可以在在连表查询时可以使用目标表中全部所定义的SQL资源。
   
   我认为这两个方向的打通，可以使得定义SQL资源成为一个有意义的事情。
   
   本来这个功能是很难实现的，但是现在与symfony底层相结合，借助其生成的结构网络，让其变成可能。
   
   在使用中，希望你多多的定义sql资源，合理的定义和设置，不光使得你的sql变得更好管理，也将增加系统的功能储备。

4. 别名的负担和冲突。 

   表名不会重复，但别名会不会重复了，是会的。比如 `admin` 和 `article`，如果将这个独立来看，那么别名都是`a`。这时候就很尴尬了，因为我们在定义sql资源但时候，是以当前表入手的，所以不可能知道其他地方有没有使用过这个别名。
 
   这个问题，可能在传统写法中，不是问题，但是我们的
  
5. 查询出来的数据为实体或实体集合，可以通过系统`to_array()`方法将其自动转为数组，也可以通过定义数据解析方法，实现针对性差异化。

   我们为什么痴迷于实体转为对象，是因为对象可以提供更便捷的体验，更多的可能，更完整的概念。他很好。那么为什么我们需要将对象转为数组了，因为我们需要数据在各个系统之间交换。
   
   很好的体验是，在`twig`中可以使用对象。所以我们的集中需求是在API中。
 
   将实体对象自动转为数组，这很难么？以前我觉得其很难，但我后来知道了symfony序列化的方案，感觉应该不会很难。
   
   但我还是坚持保留下这个策略，因为他更直观，更方便。
   
   1. toArray()
   
       ```php
       final public function toArray($entity, $params = ['level' => 0]): array
       ```
   
       **方法解析**
       
       支持一个实体对象传入，对其进行递归，自动调取每个字段属性的get方法。
       
       `$params` 控制参数，可自定义。
       
       `level` 递归的层数
       
       如果对数组格式有特定要求的可以自定义方法，自定义方法要求参数名，参数个数，参数含义和此方法一致。
        
       例如
       
       ```php
       public function toApiArray($entity, $params = []);
       ```
   
   2. arraySerialization 数据序列化方法
   
       ```php
       final public function arraySerialization($result, $decoratorMethodParams = ['level' => 0], $decoratorMethodName = 'toArray') : array
       ```
   
       **方法解析**
         
       支持一个对象或者对象集合传入，底层使用调用`toArray`。
         
       `$decoratorMethodParams`：序列化方法的参数，参照`toArray`的`$params`参数。
       
       `$decoratorMethodName`: 序列化方法的名称。

## 规则执行顺序

1. 传入规则

2. 进行规则演算，加入必要规则和连带规则，且获得实体类和表的关系。

3. 运行规则，拼接sql。

4. 解析sql，和实体对照，对查询表，字段进行一一绑定，建立联系，保证查询出来的结构落入的位置是正确的。

5. 对sql进行最终整理，优化查询速度。

6. 执行sql返回实体结果。

## 使用小贴士

1. sql_pre是什么？ 

   当前表的别名是不确定的，所以使用sql_pre指代当前表的别名。这个指代是很重要的，他可以保证你可以集中经历思考如何以当前表构建查询。
   
   如
   
   实际sql：
   
   ```sql
   select u.id from user u
   ```
   
   编码时应该为：
   
   ```sql
   select sql_pre.id from user sql_pre 
   ``` 
   
   
   
   

