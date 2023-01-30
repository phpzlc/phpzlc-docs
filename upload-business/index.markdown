---
title: 上传业务(upload-business)
description: 提供上传文件的接口,文档。
keys: 上传,upload,upload-business,phpzlc/upload-business
---

## 业务介绍

提供上传文件的接口,文档。

## 源码地址

[phpzlc/upload-business](https://github.com/phpzlc/upload-business)

## 安装

```shell
composer require phpzlc/upload-business
php bin/console phpzlc:flex:install upload-business
```

## 项目中引用

在项目根路由中`config/routes.yaml`引入

```yaml
upload:
  resource: "routing/upload/upload.yaml"
  prefix:   /upload
```

## 提供功能

1. 上传接口
  
   ```yaml
    # 上传接口
    upload_file:
      path: /
      controller: App\Controller\Upload\UploadController:upload
   ```

    _如果使用,可以生成查看API文档。[文档知识](/document-bundle/index.markdown)_
    
2. 上传方法

   ```php
    use  App\Business\UploadBusiness\UploadFile;
   
       /**
        * 上传方法
        *
        * @param string $inputName 文件上传name
        * @param null $relatively_path 文件存储相对路径,以public目录为根,不穿默认upload
        * @param int $fileType 文件类型
        * @param null $save_name 文件存储名称,不传系统随机命名
        * @return array|bool 失败返回false,成功返回文件信息
        */
       public function upload($inputName, $relatively_path = null, $fileType = self::TYPE_IMAGE, $save_name = null)
    
   ```
3. 根据相对地址获得文件的网络地址

   ```php
   use  App\Business\UploadBusiness\UploadFile;
   
   UploadFile::getFileNetworkPath(ContainerInterface $container, $path);
   ```

4. 富文本内容解码-将资源路径转为绝对路径

   ```php
   use  App\Business\UploadBusiness\UploadFile;
   
   UploadFile::contentDecode(ContainerInterface $container, $content);
   ```

5. 富文本内容加码-将资源路径转为相对路径

   ```php
   use  App\Business\UploadBusiness\UploadFile;
   
   UploadFile::contentEncode(ContainerInterface $container, $content);
   ```

## 底层技术

   [phpzlc/upload](/upload/index.markdown)

