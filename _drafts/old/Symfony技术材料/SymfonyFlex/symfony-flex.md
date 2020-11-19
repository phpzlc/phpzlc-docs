
# Symfony Flex

## 官方链接

   [配方官网](https://flex.symfony.com/)
   
## 资料

1. [如何为新捆绑包编写Symfony Flex配方？](https://stackoverflow.com/questions/58595101/how-write-a-symfony-flex-recipe-for-a-new-bundle)

    **什么是Flex食谱？**
    
    请记住，flex配方是与程序包存储库分开的存储库，需要托管在Flex服务器上。此过程使配方对于第三方捆绑包（IMO）的用处大大降低。对于“官方” Symfony食谱来说，它非常整洁，但对其他用户而言却不是那么多。
    
    最有可能的是，您必须将食谱提交到contrib存储库，使其获得批准并合并，以便将其作为社区食谱使用。（另一种选择是拥有一台自托管的Flex服务器，但这仅在测试配方时有用，如有必要）。
    
    另外，请务必记住，大多数用户默认不会启用contrib存储库。因此，如果这对于安装此捆绑包很重要，则应在安装配方之前告诉用户如何操作（例如，在捆绑包的自述文件中）。
    
    这样就可以了：基本上，Flex配方是一个带有manifest.json文件的存储库，该文件带有用于启用某些“配置程序”的特定密钥。

2. 
   Symfony Flex食谱由社区贡献，并存储在两个公共存储库中：
   
   [主要配方公共存储库](https://github.com/symfony/recipes)，是高质量和可维护包装的配方的精选列表。默认情况下，Symfony Flex仅在此存储库中查找。
   [Contrib食谱存储库](https://github.com/symfony/recipes-contrib)，包含社区创建的所有食谱。保证它们全部都能正常工作，但是它们相关的软件包可能无法维护。在安装任何这些食谱之前，Symfony Flex都会征得您的许可。
   阅读Symfony [食谱文档](https://github.com/symfony/recipes/blob/master/README.rst)，以了解有关如何为自己的包装创建食谱的所有信息。
______

## 问题？

1. 将配置项脱离存储库为何？ 不易于维护。

2. 如果将食谱提交到公共库?

3. 版本对照关系

4. 如何创建自托管的flex服务期？用于测试或私有化发布 

   **谷歌检索关键词: symfony flex localhost server**
   
    (1) ~~github构建关联服务（新版本已舍弃）~~
    
    [Symfony 4通过Flex使用私人食谱](https://blog.mayflower.de/6851-symfony-4-flex-private-recipes.html)
    
    ~~您将在GitHub上需要一个空的（最佳情况下）私有存储库。请为您的存储库使用[此链接](https://github.com/apps/symfony-flex-server/installations/new)和活动的Symfony Recipe Server –请小心，仅在该单个存储库上将其激活，否则可能会导致非弹性配方存储库出现一些问题.~~
    
    (2) 部署本地服务器
    
    [Server for Symfony Flex 服务器部署官方文档](https://server-for-symfony-flex.readthedocs.io/en/latest/topics/setup/)
    
    初始化步骤还需要
    
    ```shell
        chmod -R 777 var/*
    ```
    
    生成 webpack 入口文件 [教程](https://stackoverflow.com/questions/54968197/could-not-find-the-entry-dummy-entrypointlookup-php)
    
    如果本地服务器域名不是https,需要在引用项目composer.json文件中配置允许http链接，因为company默认需要https的链接才能使用
    
    ```shell
        "config": {
            "secure-http": false
        },
    ```
    
    本地食谱服务器需运行*php bin/console server:run*否则安装食谱的时候需要验证身份信息
    
    ![authentication-required.png](https://github.com/phpzlc/docs/blob/master/Symfony%E6%8A%80%E6%9C%AF%E6%9D%90%E6%96%99/SymfonyFlex/authentication-required.png)
    
    **注意**
    
    (1) 食谱服务器中更新私有食谱`php bin/console recipes:reset private` 或者更新全部食谱 `php bin/console recipes:update`之后需要运行`php bin/console cache:clear`清除缓存
    
    (2) 项目中可以重新安装食谱运行`composer symfony:sync-recipes` 如果该命令没有效果则加上`--force`参数
    






