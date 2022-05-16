---
title: 业务层(Business)
description: PHPZlc业务层
keys: symfony,phpzlc,业务,业务层,business
---

## 架构定义

1. 书写业务有些人认为一个类就可以了,但实际上不行。我们需要独立的工作区间,才能尽情的运用技术。

2. 优雅工作的保证,是可以很轻松的调用一切代码资源。

3. 每个业务应该内部连接,外部独立。这样才可能轻松组合。

4. 当我们将业务按照目录独立构建,就可以尝试将这部分的代码抽离出来,发布业务组件。


## 创建目录

1. 在`src/business`目录中创建业务目录,目录名称例如`UserBusiness`。

2. 在目录中创建类

    ```php
    namespace App\Business\UserBusiness;
    
    
    use App\Entity\User;
    use PHPZlc\PHPZlc\Bundle\Business\AbstractBusiness;
    use Psr\Container\ContainerInterface;
    
    class UserBusiness extends AbstractBusiness
    {
        public function __construct(ContainerInterface $container)
        {
            parent::__construct($container);
        }
    }
    ```
   
   _`AbstractBusiness`是业务层的基础类,其通过继承`AbstractController`,获得了`Controller`层中所有的`Symfony`支持。_

3. 代码规范
   
  `src/Business`目录下第一级目录必须以Business结尾。
  
   类文件如果是直接操作实体类的的话,命名需为`实体名Business`,例如`UserBusiness`。
   
   业务方法执行失败,一律返回`false`。
   
## 基本用法

```php
<?php
namespace PHPZlc\PHPZlc\Bundle\Business;

use Doctrine\DBAL\Connection;
use Psr\Container\ContainerInterface;
use PHPZlc\PHPZlc\Abnormal\Errors;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

abstract class AbstractBusiness extends AbstractController
{
    protected $em;

    /**
     * @var Connection
     */
    protected $conn;

    /**
     * @var ValidatorInterface
     */
    private static $validation;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->em = $this->getDoctrine()->getManager();
        $this->conn = $this->getDoctrine()->getConnection();

        if(empty(self::$validation)){
            self::$validation =  Validation::createValidatorBuilder()
                ->enableAnnotationMapping()
                ->getValidator();
        }
    }

    public function validator($class) : bool
    {
        return Errors::validate(self::$validation, $class);
    }

    /**
     * 网络错误服务
     *
     * @param \Exception $exception
     */
    final protected function networkError(\Exception $exception)
    {
        return Errors::exceptionError($exception);
    }
}
```

**解析**

1. function networkError

    网络错误服务,这个方法在[错误收集](/phpzlc/error.markdown)中也存在。
    
    _在这里强调的原因是,在使用` try catch` 语法的时候,不要遗漏该方法的使用。_
    
    _这个方法在`dev`模式下会报出错误,中止程序。但如果是`prod`模式下则返回`false`, 将错误信息写入日志(`prod.log`)中, 呈现在用户面前的信息为**系统繁忙,请稍后再试**。_
    
    ```php
    try {
        
    }catch (\Exception $exception) {
        $this->networkError($exception);
    } 
    ```
   
2. function validator($class) 
   
   参照[数据库插入编辑](/phpzlc/db/edit.markdown)章节的使用案例。
   
## 使用注意

**我们不希望这个目录被滥用,过度封装,他应该存放的是逻辑缜密,复杂,复用率高的核心代码。**

**我们试想了几种他可能被滥用的场景：**

1. 规定Controller只允许接收参数,所有的功能在Business中实现。

2. 诉求Business和Repository一样和Entity建立一对一的关联关系。

3. 诉求在Business中集成统一的插入、编辑、删除、验证方法,因为他们是基本的业务且代码重复率高。

4. 由于Business层提供了书写逻辑的天然理论性和优势性,如果存在可能的话,会将可以复用的代码都塞入到Business中,以希望可以复用。

**以上的做法都是盲目恐慌的,好的结构不怕变化。**

1. 过多的封装只是平增无用功。

2. 程序是人来书写的,符合心理认知的代码才是身心愉悦的。

3. 好的技术应该是帮助人们减少负担的,好的架构是容许弯路的。

**在需要集成的时候在集成,是一种架构底气。**