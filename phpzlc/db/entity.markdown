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
   
2. **通常不建议使用命令行创建实体,直接创建类文件会比较便捷**
    
   _下面提供了两组模版可以用于实体的创建。_
   _使用时请将模版中user和User部分替换。并且修改表的描述。_
      
   **UUID 代码模版(推荐方式)**
   
   ```php
   <?php        
   namespace App\Entity;
   
   use App\Repository\UserRepository;
   use Doctrine\ORM\Mapping as ORM;
   use Symfony\Component\Validator\Constraints as Assert;
   
   /**
    * @ORM\Entity(repositoryClass=UserRepository::class)
    * @ORM\Table(name="user", options={"comment":"用户表"})
    */
   class User
   {
       /**
        * @var string
        *
        * @ORM\Column(name="id", type="string")
        * @ORM\Id()
        * @ORM\GeneratedValue(strategy="CUSTOM")
        * @ORM\CustomIdGenerator(class="PHPZlc\PHPZlc\Doctrine\SortIdGenerator")
        */
       private $id;
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
    
    /**
     * @ORM\Entity(repositoryClass=UserRepository::class)
     * @ORM\Table(name="user", options={"comment":"用户表"})
     */
    class User
    {
        /**
         * @ORM\Id
         * @ORM\GeneratedValue
         * @ORM\Column(type="integer")
         */
        private $id;
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

1. string 

    ```php
    /**
     * @var string
     * 
     * @ORM\Column(name="name", type="string", length=30, options={"comment":"名称"})
     */
    private $name;
   
   /**
    * @var string
    * 
    * @ORM\Column(name="content", type="text", options={"comment":"长文本"})
    */
   private $content;
    ```

2. boolean

    ```php
   /**
     * @var boolean
     *
     * @ORM\Column(name="is_disable", type="boolean", options={"comment":"是否禁用", "default":"0"})
     */
   private $isDisable = false;
   
   /**
    * @var boolean
    *
    * @ORM\Column(name="is_del", type="boolean", options={"comment":"是否删除", "default":"0"})
    */
   private $isDel = false;
   
   
   /**
    * @var boolean
    *
    * @ORM\Column(name="is_built", type="boolean", options={"comment":"是否内置", "default":"0"})
    */
   private $isBuilt = false;
    ```

3. datetime

    ```php
   /**
    * @var \DateTime
    *
    * @ORM\Column(name="create_at", type="datetime", options={"comment":"创建时间"})
    */
   private $createAt;
    ```
   
4. date

    ```php
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date", options={"comment":"日期"})
     */
    private $date; 
    ```   

5. time
   
   ```php
   /**
    * @var \DateTime
    *
    * @ORM\Column(name="date", type="time", options={"comment":"时间"})
    */
   private $date; 
   ```   

5. int

    ```php
    /**
     * @var integer
     *
     * @ORM\Column(name="sort_value", type="integer", options={"comment":"排序值"})
     */
    private $sortValue = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="show_num", type="integer", options={"comment":"展现数"})
     */
    private $showNum = 0;
   ```

6. smallint

    ```php
   
    const STATUS_COMPLETE = 1;

    const STATUS_CANCEL = 2;

    const STATUS_REFUND = 3;

    const STATUS_PAYMENT = 4;


    public static function getStatusArray()
    {
        return [
            self::STATUS_COMPLETE => '已完成',
            self::STATUS_CANCEL => '已取消',
            self::STATUS_REFUND => '已退款',
            self::STATUS_PAYMENT => '已支付'
        ];
    }
   
    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="smallint", options={"comment":"订单状态"})
     */
    private $status;
    ```
   
   _简单选项在表的头部定义成常量,并且设置读取全部的静态方法。_

7. simple_array(简单数组)

    ```php
    /**
     * @var array
     *
     * @ORM\Column(name="tags", type="simple_array", options={"comment":"标签"})
     */
    private $tags;
   ```
   
   _存储格式为:123,123,123_

8. array

    ```php
    /**
     * @var array
     *
     * @ORM\Column(name="files", type="array", options={"comment":"文件集合"})
     */
    private $files;
   ```
   
   _储存格式为对象序列化之后的结果,检索能力较差_

10. double

    ```php
    /**
     * @var string
     *
     * @ORM\Column(name="lon", type="decimal", precision=10, scale=6, options={"comment":"经度"})
     */
    private $lon;

    /**
     * @var string
     *
     * @ORM\Column(name="lat", type="decimal", precision=10, scale=6, options={"comment":"纬度"})
     */
    private $lat;
    
    /**
     * @var string
     *
     * @ORM\Column(name="amount", type="decimal", precision=10, scale=2, nullable=true, options={"comment":"价格"})
     */
    private $amount;
    ```

11. 外键

    **多对一**
    ```php
    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;
    ```
    
    **一对一**
    ```php
    /**
     * @var User
     *
     * @ORM\OneToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;
    ```
    
## 新特性-表外字段

   _这是PHPZlc独有的特性,可以将子查询Sql定义为字段,使其可以具有编程性,实现了Sql集中管理,提高了使用效率。_
   
   _该字段在数据库中不对应具体的实际字段,所以称为**表外字段**。在实际使用中,除了不能进行写相关的操作,其他部分和表内其他字段基本无差别。_
   
   ```php
   /**
    * @OuterColumn(name="site_domains", type="simple_array", sql="(SELECT GROUP_CONCAT(sd.site_domain) FROM site_domain sd WHERE sd.site_id = sql_pre.id),  options={"comment":"站点域名"}")
    */
   public $siteDomains;
   ```
   
1. 语法注解
   
   type: 字段类型。支持原生的大多数类型,未来会考虑支持对象类型,但目前不支持。
   
   options: 选项。 
   
   ```text
   comment: "描述"
   ```
   
   sql: 子查询sql。
   
2. 高级用法

   **支持`@AddRule`注释,利用规则注释可以为其成功执行提供必要的保证。**

   ```php
   @AddRule(name="id", value="1")
   ```    

   _具体更多的知识,可以通过学习[高级查询-规则章节](/phpzlc/repository/rule/index.markdown)来了解。_

    **Sql重写**

   正常情况下,子查询的sql是固定不变的。但是有些情况下,子查询的Sql需要传入变量才可以正常的工作。这时候我们可以通过Sql重写解决。
   
   ```php
   /**
    * @OuterColumn(name="distance", type="string", sql="repository内重写", options={"comment":"距离"})
    */
   public $distance;
   ```

   _具体更多的知识,可以通过学习[规则-高级用法](/phpzlc/repository/rule/advanced-usage.markdown#定义新规则重写规则)来了解。_
   
## 表加索引

```php
@ORM\Table(name="sms_record", options={"comment"="短信动态码"}, indexes={@ORM\Index(name="phone", columns={"phone"})})
```


