---
title: PHP生成全景图(krpano)
permalink: /blog/5.html
description_auto: 0
description: PHP生成全景图(krpano)
tags: 全景图,krpano,PHP
author_no: 1
---

## 技术背景

krpano是一款全景漫游制作软件和工具。

## 引用链接

官网: [https://krpano.com/](https://krpano.com/)

购买、下载、注册、更新krpano: [http://www.krpano360.com/buykrpano/](http://www.krpano360.com/buykrpano/)

## 开发环境

Centos6.5\PHP5.5

## 技术实现

1. 下载官方代码
   
    [https://krpano.com/download/](https://krpano.com/download/) 【根据操作系统进行选择下载】
    
2. krpano目录结构
    
    ![krpano目录结构](/assets/posts/blog/krpano目录结构.png)
    
    **说明**

    1. krpanotools  命令脚本
    
    2. templates  模版 （存放可供生成的模版样例配置文件）
    
## 执行生成代码

```php
exec($krpano . 'krpanotools makepano -config=' . $krpano . 'templates/vtour-vr.config %F ' . $krpano_dir_beta . '/*', $opt, $r);
```

**说明**    

1. $r 返回0代表生成成功 

2. $krpano 脚本包路径
    
3. $krpano_dir_beta 待生成文件资源路径

**注意**

单个图片长宽比例需为2：1

## 执行注册代码去除水印

```php
exec( $krpano . 'krpanotools register ' . self::REGISTER_CODE);
```

**说明**

1. $r 返回0代表生成成功

2. $krpano 脚本包路径

**注意**

单个图片长宽比例需为2：1

需用apache用户执行注册命令才能去除水印




