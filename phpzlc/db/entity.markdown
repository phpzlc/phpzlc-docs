---
title: 设计Entity
description: Symfony设计Entity
keys: symfony,phpzlc,entity
---

## 架构定义

1. Entity定义了数据库结构,定义数据库的时候需要选择合适的类型,长度,约束,索引。

2. Entity作为数据库表的实体类,承担着将数据库资源可编程化的任务,要多用面向对象思维,便捷灵活的操作数据。

3. **Entity结合[Symfony-Validate](https://symfony.com/doc/4.4/validation.html),可以为字段添加注释,完成表最基础的,最普遍的验证规则。**

4. **我们既要将Entity看作表,看到其物理属性。也应当将其看作类,将物理层抽象出来,大胆的在编程中使用。这种融合统一的方式将决定你的开发水准。**

## 创建Entity
  
1. 命令
  
   ```php
   php bin/console make:entity {entityClassName}
   ```

   `{entityClassName}` _选填_ 未指定的话则对话式询问,询问不指定则对所有实体生效
   
   1. **通常不建议使用命令行创建实体,直接创建类文件会比较便捷**
    
      _下面提供了两组模版可以用于实体的创建。_
      _使用时请将模版中user和User部分替换。并且修改表的描述。_
      
      **UUID 代码模版(推荐方式)**
   
      ```php
      <?php        
      namespace App\Entity;
   
      use App\Repository\UserRepository;
      use Doctrine\ORM\Mapping as ORM;
      use Symfony\Component\Validator\Constraints as Assert;

      #[ORM\Entity(repositoryClass: UserRepository::class)]
      #[ORM\Table(name: "user", options:["comment" => "用户表"])]
      class User
      {
           #[ORM\Id]
           #[ORM\Column(name: "id", type: "string")]
           #[ORM\GeneratedValue(strategy: "CUSTOM")]
           #[ORM\CustomIdGenerator(class: SortIdGenerator::class)]
           private ?string $id = null;
      }
      ```
   
       _UUID更加方便系统向分布式系统转化。_
    
       _PHPZlc对UUID进行了改造,其在保持唯一性的同时,增加了如自增ID一样的排序性,缺点在于最终生成的ID较长,（如果有更好的算法,希望与我们联系）。_
    
       **自增ID代码模版**
            
       ```php
       <?php        
       namespace App\Entity;
    
       use App\Repository\UserRepository;
       use Doctrine\ORM\Mapping as ORM;
       use Symfony\Component\Validator\Constraints as Assert;
    
       #[ORM\Entity(repositoryClass: UserRepository::class)]
       #[ORM\Table(name: "user", options:["comment" => "用户表"])]
       class User
       {
           #[ORM\Id]
           #[ORM\Column(name: "id", type: "integer")]
           #[ORM\GeneratedValue()]
           private ?int $id = null;
       }
       ```
   
## 生成GetSet方法,生成RepositoryClass类

_使用命令创建Entity的时候,会自动生成这些。但如果是自己手动建立或者修改的话,就需要执行命令手动生成了。_
      
**生成get-set,RepositoryClass**

```shell
php bin/console make:entity {entityClassName} --regenerate
```

**覆盖get-set,RepositoryClass**

```shell
php bin/console make:entity {entityClassName} --regenerate --overwrite
```

`{entityClassName}` _选填_ 未指定的话则对话式询问,询问不指定则对所有实体生效

## 常用字段写法示例

```php
#[ORM\Column(name:"name", type:"string", length:30, options:["comment" => "名称"])]
private ?string $name = null;

#[ORM\Column(name:"content", type:"text", nullable:true, options:["comment" => "长文本"])]
private ?string $content = null;

//外键-多对一
#[ORM\ManyToOne(targetEntity:"App\Entity\UserAuth")]
#[ORM\JoinColumn(name:"user_auth_id", referencedColumnName:"id")]
private ?UserAuth $userAuth = null;

//外键-一对一
#[ORM\OneToOne(targetEntity:"App\Entity\UserAuth")]
#[ORM\JoinColumn(name:"user_auth_id", referencedColumnName:"id")]
private ?UserAuth $userAuth = null;

#[ORM\Column(name:"sort_value", type: "integer", options: ["comment" => "排序值"])]
private int $sortValue = 0;

#[ORM\Column(name:"status", type: "smallint", options: ["comment" => "状态"])]
private int $status = 0;

#[ORM\Column(name: "amount", type: "decimal", precision: 10, scale:2, nullable: true, options: ["comment" => "价格"])]
private ?string $amount = null;

#[ORM\Column(name: "amount", type: "decimal", precision: 10, scale:2, nullable: true, options: ["comment" => "价格"])]
private ?string $amount = null;

//_存储格式为:123,123,123_
#[ORM\Column(name: "tags", type: "simple_array", nullable: true, options: ["comment" => "标记集合"])]
private ?array $tags = [];

//储存格式为对象序列化之后的结果,检索能力较差
#[ORM\Column(name: "files", type: "array", nullable: true, options: ["comment" => "文件集"])]
private ?array $files = [];

#[ORM\Column(name:"is_del", type: "smallint", options: ["comment" => "是否删除", "default" => 0])]
private int $isDel = 0;

//直接定义成boolean类型不会生成get方法 会生成is方法
#[ORM\Column(name:"disable", type: "boolean", options: ["comment" => "是否禁用", "default" => 0])]
private bool $disable = false;

#[ORM\Column(name:"is_del", type: "smallint", options: ["comment" => "是否删除", "default" => 0])]
private int $isDel = 0;

#[ORM\Column(name: "date", type: "date", options:["comment" => "日期"])]
private ?\DateTime $date = null;

#[ORM\Column(name: "time", type: "time", options:["comment" => "时间"])]
private ?\DateTime $time = null;

#[ORM\Column(name: "create_at", type: "datetime", options:["comment" => "创建时间"])]
private ?\DateTime $createAt = null;
```
    
## 新特性-表外字段

   _这是PHPZlc独有的特性,可以将子查询Sql定义为字段,使其可以具有编程性,实现了Sql集中管理,提高了使用效率。_
   
   _该字段在数据库中不对应具体的实际字段,所以称为**表外字段**。在实际使用中,除了不能进行写相关的操作,其他部分和表内其他字段基本无差别。_
   
```php
#[OuterColumn(name: "role_string", type: "string", sql: "(IF(sql_pre.is_super = 1,'超级管理员', (select GROUP_CONCAT(r.name) from role r where id in (select role_id from user_auth_role uar where uar.user_auth_id = sql_pre.user_auth_id))))", options: ["comment" => "是否超级管理员"])]
private ?string $roleString = null;
 ```
   
1. 语法注解
   
   type: 字段类型。支持原生的大多数类型,未来会考虑支持对象类型,但目前不支持。
   
   options: 选项。 
   
   ```text
   comment: "描述"
   ```
   
   sql: 子查询sql。
   
2. 高级用法

   **支持`#[AddRule()]` attribute,利用规则注释可以为其成功执行提供必要保证。**

   ```php
    #[AddRule(name:"id", value: 1)]
   ```    

   _具体更多的知识,可以通过学习[高级查询-规则章节](/phpzlc/repository/rule/index.markdown)来了解。_

    **Sql重写**

   正常情况下,子查询的sql是固定不变的。但是有些情况下,子查询的Sql需要传入变量才可以正常的工作。这时候我们可以通过Sql重写解决。
   
   ```php
   #[OuterColumn(name: "distance", type: "string", sql: "repository内重写", options: ["comment" => "距离"])]
   private ?string $distance = null;
   ```

   _具体更多的知识,可以通过学习[规则-高级用法](/phpzlc/repository/rule/advanced-usage.markdown#定义新规则重写规则)来了解。_
   
## 表加索引

```php
use use Doctrine\ORM\Mapping\Index;

#[ORM\Table(
    name: "admin",
    indexes: [new Index(name: 'name', columns: ['name'])],
    options:["comment" => "管理员表"],
)]
```


