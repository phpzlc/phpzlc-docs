---
title: 规则
permalink: doc/repository/rule
prev_page: /doc/repository
next_page: /doc/repository/rule-advanced-usage
description_auto: 0
description: 规则
tags: symfony,phpzlc,rule,规则
---

## 架构定义

规则本身用数组进行驱动。传入一组键值对,如果满足执行条件,则会执行代码对`Sql`进行修改。

## 使用方法

规则支持`数组`和`对象`两种格式传入。

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
    
    //将规则对象作为新规则的初始规则
    $rules = new Rules($rules);
    
    //追加数组、规则对象进入规则
    $rules =  $rules->addRules([]);
    ```
   
## 全局规则

全局规则用于对`SQL`主结构进行干预。

_(1)全局规则不允许覆写。_

_(2)全局规则在所有规则之前执行,决定`SQL`主结构。_

1. `Rule::R_SELECT`

    对`select`部分进行修改,指定查询字段。
    
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

    对`join`部分进行修改,指定连表查询。
   
    ```php
    $rules = [
       Rule::R_JOIN => 'LEFT JOIN user u on u.id = sql_pre.user_id'
    ];
    ```
   
    _注意： 运用此规则直接定义联结的表,此表可能无法被底层识别,可以通过`ResultSetMappingBuilder`参数手动绑定(不是必须)。_
   
3. `Rule::R_WHERE `

    对`where`部分进行修改。
    
    ```php
    $rules = [
      Rule::R_WHERE => "AND sql_pre.name = '张三'"
    ];
    ```

4. `Rule::R_ORDER_BY`

    对`order_by`部分进行修改。
    
   ```php
   $rules = [
      Rule::R_ORDER_BY => 'sql_pre.name ASC,sql_pre.id ASC'
   ];
   ```

5. `R_HIDE_SELECT`
    
   对查询的一些字段进行隐藏,在所有规则运行之后运行。
    
   ```php
   $rules = [
      Rule::R_HIDE_SELECT => 'sql_pre.name, sql_pre.id'
   ];
   ```

6. `R_FREED_FALSE_DEL` 

   释放逻辑删除数据。
    
   ```php
   $rules = [
      Rule::R_FREED_FALSE_DEL => 1,
   ];
   ```

## 字段规则

字段规则为表中的每个字段配套附属的规则。

规则由两部分组成,`别名.规则名`,当前表别名为`sql_pre`,可以忽略不写。

_字段的属性名和字段名都可以识别。_

1. `字段名本身`(绝对查询)

   **生效条件**
  
   无条件生效
   
   **写法**
   
   ```php
   $rules = [
      'id' => '1'
   ];
   ```
      
   **对应的sql资源**
   
   ```sql
    AND sql_pre.id = '1'
   ```   

2. `RA_NOT_REAL_EMPTY`(不为空查询)   

   **生效条件**

   如果规则值真不为空,则生效。
        
   **写法**
   
   ```php
   $rules = [
      'id' . Rule::RA_NOT_REAL_EMPTY => '1'
   ];
   ```   
        
   **对应的Sql资源**
   
   ```sql
    AND sql_pre.id = '1'
   ```   
      
3. `RA_LIKE`(LIKE模糊查询)

     **生效条件**
  
     如果规则值真不为空,则生效。
          
     **写法**
   
     ```php
     $rules = [
        'name' . Rule::RA_LIKE => '%张三%'
     ];
     ```
   
     **对应的Sql资源**
     
     ```sql
     AND sql_pre.id LIKE '%张三%'
     ```  
       
4. `RA_CONTRAST`(比较查询)

     **生效条件**
  
     如果规则值真不为空,则生效。
         
     **写法**

     ```php
     $rules = [
        'id' . Rule::RA_CONTRAST => ['>', '1']   
     ];
     ```    
        
     **对应的Sql资源**
     
     ```php
     AND sql_pre.id > '1'
     ```
     
     _如果需要两个比较,第二个比较可以使用`RA_CONTRAST_2`规则；使用方法同上。_   

5. `RA_IS`(is 查询)

     **生效条件**
  
     如果规则值真不为空,则生效。
         
     **写法**
     
     ```php
     $rules = [
        'id' . Rule::RA_IS => "null"
     ];
     ```  
        
     **对应的Sql资源**
      
     ```sql
     AND sql_pre.id is null
     ```
         
6. `RA_IN`(in 查询)

     **生效条件**
    
     如果规则值真不为空,则生效。 
         
     **写法**
     
     ```php
     use PHPZlc\PHPZlc\Doctrine\ORM\Untils\SQL;
    
     $rules = [
        'id' . Rule::RA_IN => SQL::in("1,2,3")
     ];
     ```  
     
     **对应的Sql资源**
     
     ```sql
     AND sql_pre.id in ("1", "2", "3")
     ```
        
7. `RA_NOT_IN`(not in 查询)

     **生效条件**
    
     如果规则值真不为空,则生效。 
         
     **写法**
     
     ```php
     use PHPZlc\PHPZlc\Doctrine\ORM\Untils\SQL;
    
     $rules = [
        'id' . Rule::RA_NOT_IN => SQL::in("1,2,3")
     ];
     ```  
     
     **对应的Sql资源**
     
     ```sql
     AND sql_pre.id not in ("1", "2", "3")
     ```

8. `RA_JOIN` (连表)

    **生效条件**
    
    如果规则值真不为空,则生效。

    **简便写法**
   
    ```php    
    $rules = [
       'user_id' . Rule::RA_JOIN => 'u' //必填参数 表别名
    ];
    ```
        
    **完整写法**
        
    ```php    
    $rules = [
       'user_id' . Rule::RA_JOIN => array(
          'type' => 'LEFT JOIN',  // 可选参数, 默认值为 'LEFT JOIN'
          'tableName' => 'user', //可选参数, 系统根据字段结构注释自动读取表名
          'alias' => 'u', //必填参数 表别名
          'no' => 'sql_pre.user_id = u.id' // 可选参数,系统根据字段结构注释自动读取关联
        )   
    ];
    ```
   
    **对应的Sql资源**
    
    ```sql
    LEFT JOIN user u on sql_pre.user_id = u.id
    ```
   
   _一般情况下, 系统会分析字段,自动完成关联表与实体的绑定关系。_
   
   _非正常自由度比较高的写法,可能会导致系统无法完成分析工作, 出现问题,可以通过`ResultSetMappingBuilder`参数手动绑定(不是必须)。_
        
9. `RA_ORDER_BY`(排序)

    **生效条件**
    
    如果规则值真不为空,则生效。 
        
    **写法**
    
    ```php
    $rules = [
       'create_at' . Rule::RA_ORDER_BY => "ASC"
    ];
    ```
       
    **对应的Sql资源**
    
    ```sql
    sql_pre.create_at ASC
    ```   

10. `RA_SQL`(sql重写)

    **生效条件**
        
    如果规则值真不为空,则生效。 
        
    **写法**
    
    ```php
    $rules = [
       'id' . Rule::RA_SQL => "(1 + 1)"
    ];
    ```
       
    **对应的Sql资源**
    
    ```sql
    SELECT (1 + 1) as id from table_name
    ```
      
    _当我们需要字段不变,但查询的内容需要编化的时候,就可以使用此规则对查询该字段的字段`Sql`进行重写。_

    
    
   
   

