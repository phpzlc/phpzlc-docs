---
title: Apache配置Jekyll
permalink: /blog/14.html
description_auto: 0
description: Apache配置Jekyll
tags: apache,jekyll
author_no: 1
img_all: 1
---

## 环境要求(自行百度)

1. centos6.5 +

2. php56 +

3. apache

4. jekyll

## 站点生成命令

```shell
jekyll build
```

## apache 配置

```apacheconf
<VirtualHost *:80>
    ServerAdmin 1044295598@qq.com
    ServerName phpzlc.com
    DocumentRoot /home/zlc/website/phpzlc/_site/
    DirectoryIndex index.html

    <Directory /home/zlc/website/phpzlc/_site/>
        Options -Indexes +FollowSymlinks +MultiViews
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:443>
    ServerAdmin 1044295598@qq.com
    ServerName phpzlc.com
    DocumentRoot /home/zlc/website/phpzlc/_site/
    DirectoryIndex index.html

    SSLEngine on

    SSLProtocol all -SSLv2 -SSLv3
    SSLCipherSuite HIGH:!RC4:!MD5:!aNULL:!eNULL:!NULL:!DH:!EDH:!EXP:+MEDIUM
    SSLHonorCipherOrder on
    SSLCertificateFile  /home/zlc/cart/phpzlc.com/cer.cer
    SSLCertificateKeyFile  /home/zlc/cart/phpzlc.com/key.key
    SSLCertificateChainFile  /home/zlc/cart/phpzlc.com/crt.crt

    <Directory /home/zlc/website/phpzlc/_site/>
        Options -Indexes +FollowSymlinks +MultiViews
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```


