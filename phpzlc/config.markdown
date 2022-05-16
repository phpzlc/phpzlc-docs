---
title: 常量参数配置与环境变量
description: Symfony常量参数配置与环境变量
keys: symfony,phpzlc,参数,环境变量
---

## 官方文档

[配置Symfony](https://symfony.com/doc/4.4/configuration.html#importing-configuration-files)

## 常量参数配置

配置文件位置：
```text
config/services.yaml
```
常量配置：
```yaml
parameters:
    ##字符串
    var_string: 这是个字符串
    ##数组
    var_array:
        0 : 选项1
        1 : 选项2
```
调用方法
```yaml
$this->getParameter('var_string');
```

## 环境变量

配置文件位置

```text
.env
```

写法示例

```text
##字符串
ENV_STRING=这是个字符串
```

## 本地环境变量

配置文件位置

```text
.env.local
```
_.env.local文件不入git,属于本机环境独有的环境变量,需要手动创建。_

写法示例

```text
##字符串
ENV_STRING=这是个字符串
```

_.env.local文件配置的环境变量会对应覆盖.env文件中设置的值_

调用方法

```php
$_ENV['ENV_STRING'];
```

