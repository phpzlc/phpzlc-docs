> php内核主要组成组件

1. [phpzlc/phpzlc](#) 内核组件，确定基本技术特征，技术组织形式，技术规范，写法，接口定义等。
2. [phpzlc/validate](#) 常用的验证方法和验证正则(可以独立使用)。
3. [phpzlc/document-bundle](#) API文档组件(可以独立使用), 用于项目API文档书写以及业务组件API文档书写。让API文档可以自由组合，随码而动。
4. [doctrine/doctrine-fixtures-bundle](#) 内置数据组件，symfony官方组件，用于通过命令向数据库写入数据。
5. [ramsey/uuid](#) 用于支持`Entity`实体类的主键从自增变为具有排序属性的UUID。方便项目向分布式拓展。

## PHPZlc组件安装

PHPZlc提供了很多好用的`vendor组件`和`业务组件`，你可以在根据实际情况进行自由组合。

> 比较常用的组件有:

1. [phpzlc/admin-admin](/doc/module/admin-business) 用于开发管理后台。

更多的组件请进入[组件中心](#)。