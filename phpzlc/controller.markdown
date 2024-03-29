---
title: 控制器(Controller)
description: Symfony控制器(Controller) 
keys: symfony,phpzlc,controller
---

## 官方文档

[Controller](https://symfony.com/doc/4.4/controller.html)

## 架构定义

1. Controller主要用于处理接收数据和返回响应。
2. 不建议在Controller中书写复杂的逻辑代码。他的合适用法应该是根据接口的要求组合底层的业务方法。
3. 不要认为完全不在Controller中书写逻辑代码是正确的。这是错误的认知。我们要根据逻辑代码的复用度和复杂度来选择书写的位置,不要给自己增加不必要的工作量。

## 继承父类

1. 继承父类
    
    官方继承父类: 
    
    ```php
    Symfony\Bundle\FrameworkBundle\Controller\AbstractController
    ```
   
    PHPZlc在继承`AbstractController`的基础上,增加了新的特性,用于确定项目代码的基本写法策略。
    
    ```php
    PHPZlc\PHPZlc\Bundle\Controller\SystemBaseController
    ```
   
2. 代码示例

    ```php
    use PHPZlc\PHPZlc\Bundle\Controller\SystemBaseController;
    
    class IndexController extends SystemBaseController
    
    public function inlet($returnType = SystemBaseController::RETURN_HIDE_RESOURCE, $isLogin = true)
    {
        return parent::inlet($returnType, $isLogin);
    }
    ```

## 文档

1. function inlet()

    **定义**
    
    接口入口方法,需要在每个接口中主动调用,成功则返回`true`,失败则直接返回http响应。
    
    **作用**
    
    用于每个接口的前置方法,用于鉴权,设置等等操作。
    
    **Action中写法**
    
    ```php
    public function index()
    {
        $r = $this->inlet();
        if($r !== true){
            return  $r;
        }

        return new Response('<h1>演示项目</h1>');
    }
    ```
   
   **参数注解**
   
   1. returnType
   
       **定义**
       
       returnType 为接口响应类型,有两个选项
       
       ```php
       //隐性
       SystemBaseController::RETURN_HIDE_RESOURCE
       ````
       ```php
       //显性
       SystemBaseController::RETURN_SHOW_RESOURCE
       ```
       
       **作用**
       
       隐性的主要用于返回数据信息的接口,这类返回不直接呈现在客户面前,例如APP-API请求,或者网站AJAX请求。
       
       显性的主要用于返回页面信息的接口,这类返回直接渲染呈现在客户面前,例如返回资源流,页面等。
       
       通过明确定义返回响应类型,可以在入口方法中或其他底层根据此值进行判断,从而返回正确的响应,以提高体验。
       
       常用的场景,在入口方法鉴权失败之后,如果显性的就返回登录授权等页面,如果是隐性就以返回错误码
       
       **要求**
       
       必须在每个接口中对其进行准确的指定。
       
       **可使用的方法**  
       
       ```php
       SystemBaseController::setReturnType($returnType)
       
       SystemBaseController::getReturnType()
       ```
      
   2. isLogin
   
       **定义**
      
       是否强制要求接口必须登录才可以访问。
   
  

## 请求(Request)

1. 官方文档

    [HttpFoundation](https://symfony.com/doc/4.4/components/http_foundation.html)

2. 常用方法

    ```php
    use PHPZlc\PHPZlc\Bundle\Controller\SystemBaseController;
    
    use Symfony\Component\HttpFoundation\Request;
    
    class IndexController extends SystemBaseController
    {
        public function request(Request $request)
        {
            //获取参数
            dump($request->get('param'));
    
            //获取get参数
            dump($request->query->get('param'));
    
            //获取post参数
            dump($request->request->get('param'));
    
            //获取请求类型 GET | POST
            dump($request->getMethod());
    
            //获取当前网络根地址
            dump($request->getSchemeAndHttpHost() . $request->getBaseUrl());
    
            //得到当前路由名
            dump($request->get('_route'));
            
        }
    }
    ```
3. 从服务中获取Request对象

    ```php
    $request = $this->get('request_stack')->getCurrentRequest();
    ```

## 响应(Responses)

PHPZlc在原有基础上集成了最常见的API接口响应,定义了返回的基本格式及code码。

1. 调用

    ```php
    use PHPZlc\PHPZlc\Responses\Responses;
    
    public function responsesError()
    {
        return Responses::error('操作失败');
    
    }
    public function responsesSuccess()
    {
        return Responses::success('操作成功');
    }
    ```

2. 返回格式示例

    ```json
    {"code":1,"msg":"\u64cd\u4f5c\u5931\u8d25","msgInfo":[],"data":[]}
    ```

3. 参数注解

   **code码说明**

   ```text
   0 成功
   1 常规错误
   -1 鉴权失败/登录失败
   ```

   **自定义code码**

   可以通过方法后面的参数进行设置

   **替换默认code值和其他默认参数**
  
   可以在环境变量中通过设置环境变量进行变更
    
   配置文件地址`.env`

   ```text
   API_SUCCESS_CODE: 成功code码
   API_ERROR_CODE: 错误code码
   API_RESPONSE_TYPE: 响应数据类型
   ```

   _支持传入Error对象,Error中的code和错误值会自动进行填充_
  
   _更多信息请了解[错误收集系统](/phpzlc/error.markdown)_
  
   ```php
   return Responses::error(Errors::getError());
   ```

4. 全局返回值机制
    
   **调用示例：**

   ```php
    Responses::addGlobalData('name', '这是个全局参数');

    return Responses::success('');
   ```

  **返回示例：**

    ```json
    {
        "code": 0,
        "msg": "",
        "msgInfo": [],
        "data": [],
        "system": {
            "name": "这是个全局参数"
        }
    }
    ```



 