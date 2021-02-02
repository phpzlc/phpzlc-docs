---
title: 规则
permalink: doc/repository/rule
---

## 前言

规则本身实质上用数组进行驱动。传入一组键值对，如果满足规则且满足条件，则会将执行代码对sql进行修改。

## 使用

规则支持数组和对象两种格式传入。

1. 数组格式

    ```php
    $rules = [
        "id" => $id
    ];
    ```

2. 对象格式

    ```php
    use PHPZlc\PHPZlc\Doctrine\ORM\Rule\Rules;
    
    $rules = new Rules([
            "id" => $id
        ]);
    
    //支持将规则对象作为新规则的初始规则
    $rules = new Rules($rules);
    
    //追加数组或规则对象进行规则
    $rules =  $rules->addRules([]);
    ```

## 规则碰撞

规则碰撞所面对的业务场景是这样的。

我们在编程中代码是分层的，我们喜欢将公共部分集成到方法，复杂公共性强的查询也不例外。

集成不代表万事大吉了，我们通常需要通过传参进行调整执行策略。回过头看查询，我们认为规则作为一个指令集合，他应该有资质很好的完成这个工作。

但经过实现，简答的数组是不胜任这份工作的。因为如果出现传入方法中已使用的规则，那么底层的规则会直接覆盖传入的规则。所以我们为了解决这个问题，

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
    Rule::REPLACE 取代  //如果底层出现相同规则，则忽略底层规则
    
    Rule::FORGO 放弃  //如果底层出现相同规则，则使用底层规则
    
    Rule::JOINT 联合  //如果底层出现相同规则，则将规则值拼接或连结
    ```
   
    默认值：
    
    全局规则默认联合，排序顺序为`Rule::ASC`。其他规则默认取代。

4. `jointClass`

   联合执行策略类，当碰撞规则为`Rule::JOINT`时有效。
   
   默认值：`new \PHPZlc\PHPZlc\Doctrine\ORM\Rule\Joint\StringJoint()`; 对字符串进行拼接。
   
   **如何自定义拼接执行类？**
   
   可以通过实现接口`PHPZlc\PHPZlc\Doctrine\ORM\Rule\InterfaceJoint`来完成。
   
5. `jointSort`

   联合执行优先顺序，当碰撞规则为`Rule::JOINT`时有效。
   
   默认值: `Rule::ASC`

   ```php
   Rule::ASC // 正序  （上一级排在前面）
    
   Rule::DESC// 倒序   （当前级排在前面）
   ```
   
## 全局规则

全局规则可以对SQL各部分进行大段的干预。这些规则不允许重写。

**注意：全局规则在所有规则之前执行，对初始结构进行丰富，所以其他的规则依然会执行**

1. `Rule::R_SELECT`

    对select部分进行修改，指定查询字段。
    
    ```php
    $rules = [
       Rule::R_SELECT => 'sql_pre.id, sql_pre.name'
    ];
   
   //*的写法只支持主表
   $rules = [
      Rule::R_SELECT => 'sql_pre.*'
   ];
    ```

2. `Rule::R_JOIN`

    对join部分进行修改，指定连表查询。
   
    ```php
    $rules = [
       Rule::R_JOIN => 'LEFT JOIN user u on u.id = sql_pre.user_id'
    ];
    ```
   
    **注意： 运用此规则直接定义联结的表，此表将无法被底层识别**
    
    出现问题，可以通过`ResultSetMappingBuilder`参数手动绑定(不是必须)。
    
3. `Rule::R_WHERE `

    对where部分进行修改
    
    ```php
    $rules = [
      Rule::R_WHERE => "AND sql_pre.name = '张三'"
    ];
    ```

4. `Rule::R_ORDER_BY`

    对order_by部分进行修改
    
   ```php
   $rules = [
      Rule::R_ORDER_BY => 'sql_pre.name ASC,sql_pre.id ASC'
   ];
   ```

5. `R_HIDE_SELECT`
    
    对最终查询的一些字段进行隐藏，在所有规则运行之后运行。
    
   ```php
   $rules = [
      Rule::R_HIDE_SELECT => 'sql_pre.name, sql_pre.id'
   ];
   ```

6. `R_FREED_FALSE_DEL` 

   ```php
   $rules = [
      Rule::R_FREED_FALSE_DEL => 1,
   ];
   ```

   释放假删除数据
    
## 字段规则

字段规则指的是为表中的每个字段提供的一组规则。

规则由两部分组成，`别名.规则名`;当前表别名为`sql_pre`，可以忽略不写;

**注意：字段的属性名和字段名都可以识别**

1. `字段名本身` (绝对查询)

   1. 生效原则:
  
        无条件生效
   
   2. 写法:
   
       ```php
       $rules = [
          'id' => '1'
       ];
       ```
      
   3. 对应的sql资源
   
       ```sql
        AND sql_pre.id = '1'
       ```   

2. `RA_NOT_REAL_EMPTY` （不为空查询）    

   1. 生效原则

        如果规则值真不为空，则生效。
        
   2. 写法:
   
       ```php
       $rules = [
          'id' . Rule::RA_NOT_REAL_EMPTY => '1'
       ];
       ```   
        
   3. 对应的sql资源
   
       ```sql
        AND sql_pre.id = '1'
       ```   
      
3. `RA_LIKE` （LIKE模糊查询）

     1. 生效原则
  
         如果规则值真不为空，则生效。
          
     2. 写法
   
         ```php
         $rules = [
            'name' . Rule::RA_LIKE => '%张三%'
         ];
         ```
     
     3. 对应的sql资源
     
        ```sql
         AND sql_pre.id LIKE '%张三%'
        ```  
       
4. `RA_CONTRAST` (比较查询)

     1. 生效原则
  
         如果规则值真不为空，则生效。
         
     2. 写法

         ```php
         $rules = [
            'id' . Rule::RA_CONTRAST => ['>', '1']   
         ];
         ```    
        
     3. 对应的sql资源
     
        ```php
            AND sql_pre.id > '1'
        ```
     
     如果需要两个比较，第二个比较可以使用`RA_CONTRAST_2`规则；使用方法同上。   

5. `RA_IS` (is 查询)

     1. 生效原则
  
         如果规则值真不为空，则生效。
         
     2. 写法
     
         ```php
         $rules = [
            'id' . Rule::RA_IS => "null"
         ];
         ```  
        
     3. 对应的sql资源
      
         ```sql
         AND sql_pre.id is null
         ```
         
6. `RA_IN` (in 查询)

     1. 生效原则
    
         如果规则值真不为空，则生效。 
         
     2. 写法
     
         ```php
         use PHPZlc\PHPZlc\Doctrine\ORM\Untils\SQL;
        
         $rules = [
            'id' . Rule::RA_IN => SQL::in("1,2,3")
         ];
         ```  
     
     3. 对应的sql资源
     
        ```sql
        AND sql_pre.id in ("1", "2", "3")
        ```
        
7. `RA_NOT_IN` (not in 查询)

     1. 生效原则
    
         如果规则值真不为空，则生效。 
         
     2. 写法
     
         ```php
         use PHPZlc\PHPZlc\Doctrine\ORM\Untils\SQL;
        
         $rules = [
            'id' . Rule::RA_NOT_IN => SQL::in("1,2,3")
         ];
         ```  
     
     3. 对应的sql资源
     
        ```sql
        AND sql_pre.id not in ("1", "2", "3")
        ```

8. `RA_JOIN` (连表)

    1. 生效原则
    
        如果规则值真不为空，则生效。 
        
    2. 写法
        
        ```php    
        $rules = [
           'user_id' . Rule::RA_JOIN => array(
              'type' => 'LEFT JOIN',  // 可选参数， 默认值为 'LEFT JOIN'
              'tableName' => 'user', //可选参数， 系统根据字段结构注释自动读取表名
              'alias' => 'u', //必填参数 表别名
              'no' => 'sql_pre.user_id = u.id' // 可选参数，系统根据字段结构注释自动读取关联
            )   
        ];
        ```
   
    3. 对应的sql资源
    
        ```sql
        LEFT JOIN user u on sql_pre.user_id = u.id
        ```
   
   **注意**
   
   一般情况下， 系统会分析字段，自动完成关联表与实体的绑定关系。
   
   非正常自由度比较高的写法，可能会导致系统无法完成分析工作， 出现问题，可以通过`ResultSetMappingBuilder`参数手动绑定(不是必须)。
        

9. `RA_ORDER_BY` (排序)

    1. 生效原则
    
        如果规则值真不为空，则生效。 
        
    2. 写法
    
        ```php
        $rules = [
           'create_at' . Rule::RA_ORDER_BY => "ASC"
        ];
        ```
       
    3. 对应的sql资源
    
       ```sql
       sql_pre.create_at ASC
       ```   

10. `RA_SQL` (sql重写)

    1. 生效原则
        
        如果规则值真不为空，则生效。 
        
    2. 写法
    
        ```php
        $rules = [
           'id' . Rule::RA_SQL => "(1 + 1)"
        ];
        ```
       
    3. 对应的sql资源
    
       ```sql
       SELECT (1 + 1) as id from table_name
       ```
        
    4. 说明
    
       当我们需要字段不变，但查询的内容需要修饰的时候，就可以使用此规则对查询该字段的sql进行重写。
    
    
   
   

