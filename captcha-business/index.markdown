---
title: 图形验证码(captcha-business)
description: 提供生成图形验证码接口,文档。
keys: captcha,captcha-business,phpzlc/captcha-business,图形验证码
---

## 业务介绍

提供生成图形验证码接口,文档。

## 源码地址

[phpzlc/captcha-business](https://github.com/phpzlc/captcha-business)

## 安装

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

    _如果使用,可以生成查看API文档。[文档知识](/document-bundle/index.markdown)_

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


