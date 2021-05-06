---
title: 文档书写(Document)
permalink: doc/document-bundle
prev_page: /doc/symfony-flex
next_page: /doc/data-fixtures
description_auto: 0
description: 用于编写接口文档,通过命令生成,在线的,可测试,可交付的技术文档。
tags: symfony,phpzlc,php,document,api,文档
---

## 概述

用于编写接口文档,通过命令生成,在线的,可测试,可交付的技术文档。

**可独立使用**

## 环境要求

**Symfony 4 +**

**[配置本地食谱服务器](/doc/symfony-flex)**

## 安装

```json
composer require phpzlc/document-bundle
```

## 文档配置

1. 配置接口主机域名

   **配置位置**
   
   _.env.local_
   
   **配置**

   ```text
   DOC_HOST=http://dome-api.com
   ```
 
2. 配置文档全局内容

   **配置位置**
   
   _src/Document/Config.php_
   
   **配置项**
   
   标题, 出版商, 说明, 注意, 附录。

## 生成文档

1. 命令
   
   ```shell
   php bin/console phpzlc:generate:document
   ```
   
2. 生成文件位置

   _public/apidoc_
  
3. 访问文档

   ```text
   {host}/public/apidoc/index.html
   ```
   
4. 效果

   **首页**
   
   ![首页](/assets/posts/document/index.png)

   **前要页**
   
   ![概要](/assets/posts/document/gaiyao.png)
   
   **数据字典页**
   
   ![数据字典](/assets/posts/document/data.png)
   
   **接口详情页**
   
   ![接口详情](/assets/posts/document/info.png)
   
   **Debug页**
   
   ![Debug](/assets/posts/document/debug.png)

## 书写文档

1. 书写位置

   _src/Document_
  
2. 工作原理

   命令执行之后会扫描 _src/Document_ 下所有后缀为 _Document_ 的类文件中后缀为 _Action_ 的方法。
   
3. 文档目录构建规范

   和 _src/Controller_ 下的目录类结构保持一致即可。
   
4. 代码示例

   ```php
   namespace App\Document\Api;
   
   use PHPZlc\Document\Document;
   
   class ApiDocument extends Document
   {
       public function add()
       {
           $this->addParam('platform', '平台', 'string', false, 'applets');
   
           return parent::add();
       }
   
       public function setUrl($url)
       {
           return parent::setUrl('/api' . $url);
       }
   }
   ```

   ```php
    namespace App\Document\Api;
    
    class AuthDocument extends ApiDocument
    {
        public function add()
        {
            $this->setGroup('登录模块');
            parent::add();
            return $this;
        }
    
        public function setUrl($url)
        {
            parent::setUrl('/auth'.$url);
            return $this;
        }
    
        public function phoneLoginAction()
        {
            $this->add()
                ->setTitle('手机号登录')
                ->setUrl('/phone-login')
                ->setMethod('post')
                ->addParam('phone', '手机号')
                ->addParam('password', '密码')
                ->setReturn(
                    <<<EOF
    <pre>
    "{
        "code": 0,
        "msg": "登录成功",
        "msgInfo": [],
        "data": []
    }"
    "{
        "code": 1,
        "msg": "常规错误",
        "msgInfo": [],
        "data": []
    }"
    </pre>
    EOF
    
                )
                ->generate();
        }
   ```