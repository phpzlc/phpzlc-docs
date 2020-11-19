# 对symfony-doctrine的改造

> 前言

为满足框架的设计要求及技术要求且减少使用者的学习成本,所以使用symfony-flex将symfony-doctrine中的一些文件在不影响原有功能的情况下增加了需要的新特性。

> symfony-flex食谱

```json
    "copy-from-package": {
        "Doctrine/ORM/Rewrite/Templates/Repository.tpl.php": "vendor/symfony/maker-bundle/src/Resources/skeleton/doctrine/Repository.tpl.php",
        "Doctrine/ORM/Rewrite/Hydration/ObjectHydrator.php": "vendor/doctrine/orm/lib/Doctrine/ORM/Internal/Hydration/ObjectHydrator.php",
        "Doctrine/ORM/Rewrite/MakeEntityRegenerate/ClassSourceManipulator.php": "vendor/symfony/maker-bundle/src/Util/ClassSourceManipulator.php",
        "Doctrine/ORM/Rewrite/MakeEntityRegenerate/EntityRegenerator.php": "vendor/symfony/maker-bundle/src/Doctrine/EntityRegenerator.php"
      }
```

> 具体修改和新增说明

1. *ObjectHydrator*、*Result* Object实体解析类增加对表外资源字段```@OuterColumn```的识别和解析
2. *ClassSourceManipulator* *EntityRegenerator.php* 增加了执行 *生成get-set,RepositoryClass* 命令时对表外资源字段```@OuterColumn```的识别和解析,支持为其生成get-set方法
3. *Repository.tpl.php* 修改了生成*EntityRepository*类模版文件,使生成出来的文件继承框架内核

