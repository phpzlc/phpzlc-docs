#Mapping 表结构定义

## OuterColumn (phpzlc特性) 表外字段

# 说明

&nbsp;&nbsp;&nbsp;&nbsp;表外字段不是表中固有的字段，也不会映射到数据库表结构中。此字段的是对表资源的一种衍生字段。
&nbsp;&nbsp;&nbsp;&nbsp;通过表外字段我们可以把表的一些衍生数据资源进行定义,固化，组合运用。
  
> 语法演示
   
  ```php
    /**
     * @var string
     *
     * @OuterColumn(name="test", type="string",
     *     sql="1",
     *     options={"comment":"测试字段"})
     */
    private $test;
  ``` 
  
> 语法解释

1. `name`字段名
2. `type`字段属性,可以选择的选项和`doctrine`可以选择字段类型一致
3. `sql`该字段对应的sql查询sql语句
4. `options`字段的一些描述信息, 目前支持`comment`用于描述该字段

> 实际中如何使用

&nbsp;&nbsp;&nbsp;&nbsp;由于该字段属于表外字段,属于附加资源,需要指定查询。指定查询的方式和书写正常SQL字段查询一致。
在SQL的`SELECT`区间加上字段即可,例如`, sql_pre.test`。当前也可以写成`, test`。这里注
意还支持别名`sql.test as test1`。总而言之,在作为查询资源或者条件排序资源时和表内实际存
在的字段没有差别。
   
&nbsp;&nbsp;&nbsp;&nbsp;之所以如此方便是由于在实际查库时会将字段进行替换为`子查询`SQL。
  
&nbsp;&nbsp;&nbsp;&nbsp;为了使其更为方便,在原生支持上，除去本身无法进行编辑以外, 基本和`doctrine`支持的原生字段没有差别,
甚至更强。 
   
> 表外字段独有的高级特性

1. 规则注释

&nbsp;&nbsp;&nbsp;&nbsp;可以在表外字段上通过多次添加注释`@AddRule()`为其添加表外字段查询时需要跳用的规则,注释参数请参照规则模块

2. 重写SQL

&nbsp;&nbsp;&nbsp;&nbsp;可以通过`字段_sql`或`字段 . Rule::RA_SQL`规则对`sql`进行重写
   
> 未来开发计划

1. 表外字段类型支持 Entity Object。


    
