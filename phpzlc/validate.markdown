---
title: 验证(Validate)
description: Symfony验证(Validate)
keys: symfony,phpzlc,验证,validate
---

## 架构定义

**PHPZlc的验证体系,主要由两项技术支撑。**

1. [Symfony-Validate](https://symfony.com/doc/4.4/validation.html) (Symfony 官方认证,自行阅读官方文档)

2. [PHPZlc-Validate](https://github.com/phpzlc/validate) (PHPZlc自研组件, 下文介绍)

**使用说明**

1. 两种组件,都可以直接使用。

2. Symfony-Validate与框架的具体结合,可以前往[错误收集](/phpzlc/error.markdown#文档)了解。

3. Symfony-Validate是一种通过在类中为属性添加验证注释的方法实现快捷验证。 是symfony原生支持的验证技术。

4. PHPZlc-Validate是一种简单补充措施,其简单直接。其主要提供两个功能,常量正则和返回`bool`的静态验证方法,可以在系统的任何位置简单调用,快捷验证。

## PHPZlc-Validate文档

1. 仓库地址

   [https://github.com/phpzlc/validate](https://github.com/phpzlc/validate)

2. 主要类

    ```php
    PHPZlc\Validate\Validate:Class  //存放静态验证方法  只返回真假
    
    PHPZlc\Validate\Regular:Class  //存放定义为常量的验证正则
    ```

3. 示例

    ```php
    Validate::isRealEmpty($variable); //验证是否真实为空,解决empty()方法对0的误判。
    ```
    ```php
    Regular::REG_PRICE; //正则 价格:2位小数
    ```
   
4. 常量正则如何和`Symfony-Validate`结合使用

    ```php
    @Assert\Choice(choices=YourClass::SOME_CONSTANT)
    ```

## PHPZlc-Validate维护发行说明

_正则集成成库,是存在严重的问题的。因为正则一方面是普遍规则,又一方面又具有个性化。_

_个性化举个例子,比如密码强度。普遍情况下,安全度适中的规则都可以接受。但是密码强度经常每个用户有自己的需要,这就产生了矛盾。_

_所以我们需要明白这一点,才能更好的使用其便利的地方。_
   
1. 解决了什么问题？

    将常用的正则和验证方法集成,方便使用,避免寻找和产生bug。
       
    维护这些正则,使其保持最新的标准,例如手机号这类验证规则不是一直不变的。
       
    统一项目中验证的标准,避免因为人员差异,导致验证规则的混乱。
    
2. 维护的目标

    加入更多通用常用的正则和方法。
           
    保持正则和方法的普遍适用性,实时性,正确性。
           
    不会删除正则库和方法库中的代码。

3. **明显短板和使用时注意**
   
   拿密码正则来说,不同系统,不同项目对于密码强度和组成都是不一致的,但从组件的特性,我们可以知道,在维护中是不可能为某一种特定业务维护的,我们对于密码正则的维护遵循普遍适用性。
        
   所以你应该基于这样的认知,使用此工具。如果你的业务中存在明确定义的验证规则,你应当自行定义正则或方法。