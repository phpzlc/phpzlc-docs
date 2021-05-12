---
title: 图形验证码(captcha-business)
permalink: doc/module/captcha-business
prev_page: /doc/module/platform-business
next_page: /doc/module/upload-business
description_auto: 0
description: 提供生成图形验证码接口,文档。
tags: captcha,captcha-business,phpzlc/captcha-business,图形验证码
---

## 业务介绍

提供生成图形验证码接口,文档。

## 源码地址

[phpzlc/captcha-business](https://github.com/phpzlc/captcha-business)

## 安装

部署本地食谱服务器(必要的步骤)

部署方式详见: [自托管的 Symfony Flex 服务器](/doc/symfony-flex)

部署他的原因是框架的组件食谱尚未成功合并到官方仓库,未部署配置的话组件无法正常工作。

```shell
composer require phpzlc/captcha-business
```

## 项目中引用

在项目根路由中`config/routes.yaml`引入

```yaml
captcha:
  resource: "routing/captcha/captcha.yaml"
  prefix:   /captcha
```

## 提供功能

1. 验证码生成接口

   ```yaml
   # 验证码生成
   captcha_generate:
     path: /generate
     controller: App\Controller\Captcha\CaptchaController:generate
   ```

    _如果使用,可以生成查看API文档。[文档知识](/doc/document-bundle)_

2. 验证图像码

    ```php
    use App\Business\CaptchaBusiness\CaptchaBusiness;

    $captcha = new CaptchaBusiness($this->container);
   
    if (!$captcha->isCaptcha('admin_auth_login', $request->get('imgCode'))) {
        return Responses::error(Errors::getError());
    }
    ```

## 底层技术

   [gregwar/captcha](https://github.com/Gregwar/Captcha)


