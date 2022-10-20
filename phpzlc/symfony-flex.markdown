---
title: 自托管的 Symfony Flex 服务器 (已弃用)
description: SymfonyFlex是Symfony4的重要新功能。
keys: symfony,phpzlc,symfony flex,flex,symfony-flex
---

## Symfony Flex 介绍

SymfonyFlex是Symfony4的重要新功能。这个功能看上去是全新的概念,其实没有那么高大上,大家不要望而止步。

这个功能就实现原理而言,是基于Composer支持在包的安装,更新,卸载前后挂载执行PHP脚本。

使用过Symfony4之前版本的小伙伴,都应该有过这样的经历,每次安装包之后,都需要将Bundle手动注册到Symfony内核中,卸载的时候也需要将加入的代码删除。

这种重复的过程,稍微嫌麻烦的同学都希望有个自动化的脚本来完成,可自己写一个很麻烦,所以也就想想。

SymfonyFlex通过配置食谱,在程序包安装、更新、卸载完之后,自动向食谱服务器发送请求,拉取与版本匹配的食谱配置,按照配置执行脚本程序,进行Bundle注册,移除等等操作。

如果只是自动化的话,很多资深的小伙伴都明白,顶多也就是方便一点,不值得说其是重要功能,其重要点在于与Symfony4的结构精简,灵活组合的方向打配合。

大家不妨想想,Symfony4在安装之初只保留最基础最通用的核心包。这就导致我们需要自己安装大量的包,这时候如果没有一个自动化工具,想想吐槽就一波接一波了,这也就导致SymfonyFlex是不可获缺的重要功能。

## 相关资料

1. 什么是Flex食谱? (原文摘抄)
     
     请记住,flex配方是与程序包存储库分开的存储库,需要托管在Flex服务器上。此过程使配方对于第三方捆绑包（IMO）的用处大大降低。对于“官方” Symfony食谱来说,它非常整洁,但对其他用户而言却不是那么多。
     
     最有可能的是,您必须将食谱提交到contrib存储库,使其获得批准并合并,以便将其作为社区食谱使用。（另一种选择是拥有一台自托管的Flex服务器,但这仅在测试配方时有用,如有必要）。
     
     另外,请务必记住,大多数用户默认不会启用contrib存储库。因此,如果这对于安装此捆绑包很重要,则应在安装配方之前告诉用户如何操作（例如,在捆绑包的自述文件中）。
     
     这样就可以了：基本上,Flex配方是一个带有manifest.json文件的存储库,该文件带有用于启用某些“配置程序”的特定密钥。
     
2. 官网链接

     配方官网: [https://flex.symfony.com/](https://flex.symfony.com/)    
   
3. 食谱存储库
   
     [主要配方公共存储库](https://github.com/symfony/recipes),是高质量和可维护包装的配方的精选列表。默认情况下,Symfony Flex仅在此存储库中查找。
 
     [Contrib食谱存储库](https://github.com/symfony/recipes-contrib),包含社区创建的所有食谱。保证它们全部都能正常工作,但是它们相关的软件包可能无法维护。在安装任何这些食谱之前,Symfony Flex都会征得您的许可。
      
     阅读Symfony [食谱文档](https://github.com/symfony/recipes/blob/master/README.rst), 了解有关如何为自己的包装创建食谱的所有信息。

4. PHPZlc食谱仓库
   
   仓库地址: [phpzlc/contrib](https://github.com/phpzlc/contrib)

## 如何创建自托管的flex服务器？用于测试或私有化发布 

1. 官方博客资料
   
   谷歌资料: [Symfony 4通过Flex使用私人食谱](https://blog.mayflower.de/6851-symfony-4-flex-private-recipes.html)
    
   官方文档: [Symfony Flex服务器官方使用文档](https://server-for-symfony-flex.readthedocs.io/en/latest/)

2. 克隆食谱服务器代码

   ```shell
   git clone https://github.com/moay/server-for-symfony-flex.git
   ```

3. 切入代码目录安装第三方包

   ```shell
   composer install
   ```

   如果你的是`composer 2`的话安装会出现报错
       
   ![compsoer2-error.png](/_image/posts/composer2-error.png)
      
   需要切换到`Composer 1`, 参照教程 [composer 更换版本](https://www.kancloud.cn/leizhenxing/composer/2129546)。

4. 项目配置

   打开`.env`文件,找到下述配置项配置
   
   ```shell
   APP_ENV=dev //运行环境改为dev
   FLEX_RECIPE_REPO_PRIVATE=https://github.com/phpzlc/contrib //设置私有仓库地址
   ```
 
5. 安装/更新食谱

   ```shell
   php bin/console recipes:initialize
   ```
   
   **之后食谱发生变化,需要更新食谱内容执行:**
  
       
   更新私有食谱

   ```shell
   php bin/console recipes:reset private
   ``` 
       
   或者
   
   更新全部食谱 
   
   ```shell
   php bin/console recipes:update
   ```

   更新之后需要运行
   
   ```shell
   php bin/console cache:clear
   ```
   
   清除缓存
   
6. 安装静态资源(非必须)

   _不安装页面无法正常工作。但不影响项目启动,食谱使用。_   
   
   ```shell
   npm install
   npm run build
   ```
   
   
7. 运行启动项目

   ```shell
   sudo chmod -R 777 var
   php bin/console server:run
   ```
   
   **部署完毕**
   
   ![server_run.png](/_image/posts/server_run.png)
  
8. 在项目中中配置本地食谱服务器地址

   打开项目中`composer.json`文件,将
   
   ```js
   "extra": {
       "symfony": {
           "allow-contrib": false,
           "require": "4.4.*"
       }
   }
   ```
   
   替换为
   
   ```js
   "extra": {
      "symfony": {
          "allow-contrib": true,
           "require": "4.4.*",
           "endpoint": "http://127.0.0.1:8000"
      }
   }
   ```

## 注意

   由于食谱安装和更新都有一定可能会覆盖一些不想覆盖的文件,所以在安装包,卸载包,更新包,重新安装食谱之前最好将代码提交到库中,操作完毕之后,比对下修改的文件,确认是否和心理预期相同。

## 要点

1. 项目中食谱如果执行无效,可以运行命令重新执行。
    
   ```shell
   composer symfony:sync-recipes
   ```
   
   如果命令没有效果则加上`--force`参数。
   

2. 在书写食谱的时候,版本如何对应的了？

   （1）数字版本号, 采取是是最近原则的匹配,例如食谱库中只有`1.0`版本,那么大于`1.0`的包也会使用这个食谱配方。
   
   （2）如`dev-master`这样的字符版本,需要完全对应。
   
   （3）提交合并到社区库中的时候必须要有最小稳定版本。