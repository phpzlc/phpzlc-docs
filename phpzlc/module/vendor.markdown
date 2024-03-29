---
title: 功能组件(Vendor Package)
description: 正常的Composer包,其代码安装之后不允许修改。提供高度封装的原子性功能。
keys: symfony,phpzlc,vender,功能
---

## 架构定义

正常的Composer包,其代码安装之后不允许修改。提供高度封装的原子性功能。

## 技术原理

基于 [Composer](https://getcomposer.org/) + [Symfony Flex](/phpzlc/symfony-flex.markdown),在安装包的时候将包内的代码复制到项目相应位置。

## 参照仓库

参照仓库:[phpzlc/phpzlc](https://github.com/phpzlc/phpzlc)

_需要了解更多写法,可以前往[业务组件(Business Package)](/phpzlc/module/business.markdown)了解。_

## 了解更多

[食谱书写文档](https://github.com/symfony/recipes/blob/master/README.rst)

[symfony-flxe 教程](/phpzlc/symfony-flex.markdown#如何创建自托管的flex服务器用于测试或私有化发布)

[phpzlc 食谱库](https://github.com/phpzlc/contrib)