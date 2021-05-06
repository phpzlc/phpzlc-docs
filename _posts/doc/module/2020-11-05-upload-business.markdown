---
title: 上传业务(upload-business)
permalink: doc/module/upload-business
prev_page: /doc/module/captcha-business
next_page: /doc/module/vendor
description_auto: 0
description: 提供上传文件的接口，文档。
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

1. 上传接口
  
   ```yaml
    # 上传接口
    upload_file:
      path: /
      controller: App\Controller\Upload\UploadController:upload
   ```

    _如果使用，可以生成查看API文档。[文档知识](/doc/document-bundle)_
    
2. 上传方法

   ```php
    use  App\Business\UploadBusiness\UploadFile;
   
       /**
        * 上传方法
        *
        * @param string $inputName 文件上传name
        * @param null $relatively_path 文件存储相对路径,以public目录为根,不穿默认upload
        * @param int $fileType 文件类型
        * @param null $save_name 文件存储名称，不传系统随机命名
        * @return array|bool 失败返回false,成功返回文件信息
        */
       public function upload($inputName, $relatively_path = null, $fileType = self::TYPE_IMAGE, $save_name = null)
    
   ```
3. 根据相对地址获得文件的网络地址

   ```php
   use  App\Business\UploadBusiness\UploadFile;
   
   UploadFile::getFileNetworkPath(ContainerInterface $container, $path);
   ```

## 底层技术

   [phpzlc/upload](/doc/module/upload)

