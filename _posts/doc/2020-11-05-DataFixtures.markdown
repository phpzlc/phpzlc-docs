---
title: 内置数据(DataFixtures)
permalink: doc/data-fixtures
prev_page: /doc/document-bundle
next_page: /doc/module/business
description_auto: 0
description: 用于项目部署之后内置一些初始数据到数据库中。
tags: symfony,phpzlc,data-fixtures,内置数据
---

## 架构定义

用于项目部署之后内置一些初始数据到数据库中。

**Symfony官方组件**

## 官方资料

[官方文档](https://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html#doctrinefixturesbundle)

## 内置命令

```shell
php bin/console doctrine:fixtures:load  --append
```

## 书写位置与文件命名

1. 书写位置

   _src/DataFixtures_
   
2. 类文件命名

   类文件需以 _Fixtures_ 为后缀。

## 代码示例

   ```php
   namespace App\DataFixtures;
   
   use App\Business\AdminBusiness\AdminAuth;
   use App\Entity\Admin;
   use Doctrine\Bundle\FixturesBundle\Fixture;
   use Doctrine\Persistence\ObjectManager;
   use Psr\Container\ContainerInterface;
   
   class AdminFixtures extends Fixture
   {
       private $container;
       
       public function __construct(ContainerInterface $container = null )
       {
           $this->container = $container;
       }
       
       public function load(ObjectManager $manager)
       {
           $admin = new Admin();
           $admin
               ->setName('超级管理员')
               ->setAccount('aitime')
               ->setIsBuilt(true)
               ->setIsSuper(true);
   
           
           (new AdminAuth($this->container))->create($admin, '123456');
       }
   }
   ```
