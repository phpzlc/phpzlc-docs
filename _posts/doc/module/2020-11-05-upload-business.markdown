---
title: 上传业务(upload-business)
permalink: doc/module/upload-business
prev_page: /doc/module/captcha-business
next_page: /doc/module/vendor
description_auto: 0
description: 上传业务(upload-business)
tags: 上传,upload,upload-business,phpzlc/upload-business
---

## 业务介绍

提供上传文件的接口，文档。

## 源码地址

[phpzlc/upload-business](https://github.com/phpzlc/upload-business)

## 安装

部署本地食谱服务器(必要的步骤)

部署方式详见: [自托管的 Symfony Flex 服务器](/doc/symfony-flex)

部署他的原因是框架的组件食谱尚未成功合并到官方仓库,未部署配置的话组件无法正常工作。

```shell
composer require phpzlc/upload-business
```

## 项目中引用

在项目根路由中`config/routes.yaml`引入

```yaml
upload:
  resource: "routing/upload/upload.yaml"
  prefix:   /upload
```

## README.md 补充

> php.ini

```apacheconfig
upload_max_filesize = 1024M
post_max_size = 1024M
```

> nginx

```apacheconfig
client_max_body_size     1024M;
proxy_connect_timeout    9000s;
proxy_read_timeout       9000s;
proxy_send_timeout       9000s;
```

> 文件夹权限

```shell
sudo chmod -R 777 public/upload/
```

## 提供功能

1. 验证码生成接口

   ```yaml
   # 验证码生成
   captcha_generate:
     path: /generate
     controller: App\Controller\Captcha\CaptchaController:generate
   ```

    _如果使用，可以生成查看API文档。[文档知识](/doc/document-bundle)_

2. 验证图像码

    ```php
    use App\Business\CaptchaBusiness\CaptchaBusiness;

    $captcha = new CaptchaBusiness($this->container);
   
    if (!$captcha->isCaptcha('admin_auth_login', $request->get('imgCode'))) {
        return Responses::error(Errors::getError());
    }
    ```

## 底层技术

