---
title: Centos7 + Apache2.4 + 多版本PHP共存 服务器环境搭建
permalink: /blog/1.html
description_auth: 0
description: Centos7 + Apache2.4 + 多版本PHP共存 服务器环境搭建
tags: linux,Centos7,PHP,Apache,多版本
---

## 参照链接

主要的：[centos7上配置apache不同域名多版本php共存](https://segmentfault.com/a/1190000023540385)

安装多版本php参照：

[CentOS 7上使用Apache的多个PHP版本(Multiple PHP version with Apache on CentOS 7)](https://www.it1352.com/1825609.html)

[Apache fcgid 下载]: [http://httpd.apache.org/download.cgi#apache24]

[Linux之Redhat Apache添加mod_fcgid模块](https://blog.csdn.net/baidu_28553605/article/details/106425528)

[如何设置默认版本及替换他](https://blog.csdn.net/zhouzme/article/details/53995566)

## 配置文件

```apacheconfig
<VirtualHost *:80>
    ServerAdmin 1044295598@qq.com
    ServerName shop.des.b.yayuanzi.com
    DirectoryIndex index.php

    #添加映射 
    AddHandler fcgid-script .fcgi .php
    # 设置PHP\_FCGI\_MAX\_REQUESTS大于或等于FcgidMaxRequestsPerProcess，防止php-cgi进程在处理完所有请求前退出 
    #FcgidInitialEnv PHP\_FCGI\_MAX\_REQUESTS 1000 
    #php-cgi每个进程的最大请求数 
    #FcgidMaxRequestsPerProcess 1000 #php-cgi最大的进程数 
    #FcgidMaxProcesses 3 
    #最大执行时间 
    #FcgidIOTimeout 120 
    #FcgidIdleTimeout 120 

    FcgidInitialEnv PHP_FCGI_MAX_REQUESTS      1000
    FcgidMaxRequestsPerProcess       1000
    FcgidMaxProcesses             15
    FcgidIOTimeout             120
    FcgidIdleTimeout                120


    #限制最大请求字节 (单位b) 
    #FcgidMaxRequestLen 2097152 
    AddType application/x-httpd-php .php

    #------这里是默认虚拟主机配置 
    #php.ini的存放目录 
    FcgidInitialEnv PHPRC "/etc/opt/remi/php56/"
    #php-cgi的路径 
    FcgidWrapper "/usr/bin/php56-cgi" .php

    <Directory /var/www/html>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]

        Options -Indexes +FollowSymlinks +ExecCGI
        AllowOverride All
        Require all granted

    </Directory>

    ErrorLog /home/yyz/logs/790-des-shop-error_log
    CustomLog /home/yyz/logs/790-des-shop-access_log common
</VirtualHost>

```