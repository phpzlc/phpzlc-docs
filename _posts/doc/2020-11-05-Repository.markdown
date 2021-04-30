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

规则即查询规则,传入规则,查询系统就会根据规则自动的生成需要的查询`Sql`,返回查询结果。

这个理念,不是什么高级的想法,对于`Symfony`本身而言,其本身的查询系统,也支持这样去做,并且还有辅助的`IDE`提示。

但我还是要说,`PHPZlc`的查询系统在`Symfony`原有的查询系统上做了一次较大的革新,会给你带来的全新的体验。

## 架构定义

1. 易用性

   `Symfony`,`Doctrine`提供了许多的手段来完成`SQL`的构建。在单表查询中,其表现的是十分便捷良好的。 

   需要进行连表查询等高级查询的时候,需要学习使用[Doctrine Native SQL](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/native-sql.html)。
 
   这个知识主要内容就是将表,字段和类,属性进行绑定,完成查询结果对象化的工作。
 
    `PHPZlc`认为这个过程是机械繁琐的,这种方式不是未来的方向。并且当下我们已经可以通过`Entity`得到了数据库全部的结构,应该可以尝试分析表结构来自动完成这部分工作。

2. 资源性
    
   `SQL`是系统重要的资源,有些业务逻辑就是`SQL`本身。在某种程度上来说,后端的主要工作就是在写`SQL`。
   
    但是现在的情况是,这些重要复杂的资源在系统中却是零散的。零散不是说重要的`SQL`没有被复用。而是定义和复用的时候都没有系统的体系,书写者几乎都是在各自为战。
    
    各自为战是因为架构师的问题么？是规范制定的问题么？我想不是的,主要原因是`SQL`作为资源却没有上升到定义的层次。如果一个概念无法简单清晰的被使用者认知,那么任何个体,任何规范都是虚无的。

3. 串连性

   实现`SQL`资源性,定义的位置好确定,但是易用性却很难解决,要解决易用性的问题,就需要一个体系来完成。
   
   举个例子,在`User`表中定义个`where`条件`SQL`,那么我在`join user`的时候,可以直接使用定义的`where`条件么？
   
   这是个资源通达的问题,解决了这个问题,定义资源才有实质的使用意义。

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
    
## 当前表别名,关键词sql_pre 

   表名不会重复,但别名是会重复的。比如 `admin` 和 `article`,如果将这个独立来看,那么别名都是`a`。
 
   这就产生了问题,因为我们在定义`SQL`资源的时候,只能知道当前的别名,但是却无法保证别名不会重复。
 
   **处理方法**
 
   我们规定在定义书写`SQL`的时候,定义关键词`sql_pre`作为当前表别名的描述词。系统底层演算的时候会自主安排。
   
   **实际sql:**
   
   ```sql
   select u.id from user u
   ```
   
   **编码时应该为:**
   
   ```sql
   select sql_pre.id from user sql_pre 
   ``` 
   
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

## 手动弥补自动化工作的缺陷

自动化的绑定工作,是基于`SQL`的分析。但是当分析的素材不足的时候,有些绑定工作无法正常完成。这时候需要手动补充。

我们可以使用查询方法中的参数:

```php
ResultSetMappingBuilder $resultSetMappingBuilder = null;
```

使用这个参数,需要学习[Doctrine Native SQL](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/native-sql.html)。
   
## 解决别名的冲突

当我们将子查询定义为`SQL`资源的时候,那么就无法避免`子查询`中`join`其他表。这样不同表中定义的`SQL`除了本表的别名被关键词锁定之外,其他连接表的别名就无法避免出现冲突的问题。

**处理方法**

```php
string $aliasChain = ''
```

**传参格式**
  
```text
sql_pre:a=>c,b=>a;at:a=>c,b=>a;
```

**格式解析:**

```text
表别名1: 目标别名1=>修正别名1;目标别名2=>修正别名2;
```
   
## 查询结果对象转数组
   
1. toArray()

   ```php
   final public function toArray($entity, $params = ['level' => 0]): array
   ```

   **方法解析**
   
   支持一个实体对象传入,对其进行递归,自动调取每个字段属性的`get`方法。
   
   `$params` 控制参数,可自定义。
   
   `level` 递归的层数
   
   如果对数组格式有特定要求的可以自定义方法,自定义方法要求参数名,参数个数,参数含义和此方法一致。
    
   例如
   
   ```php
   public function toApiArray($entity, $params = []);
   ```

2. `arraySerialization` 数据序列化方法

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

3. 运行规则,拼接`Sql`。

4. 解析`Sql`,和实体对照,对查询表,字段进行一一绑定,建立联系,保证查询出来的结果落入的位置是正确的。

5. 对`Sql`进行最终整理,优化查询速度。

6. 执行`Sql`返回实体结果。
   
   
   
   

