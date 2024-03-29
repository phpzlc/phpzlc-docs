---
title: 错误收集(Errors)
description: 更加有条理的记录,读取错误信息,并对错误进行更多的描述
keys: symfony,phpzlc,错误收集,errors,error
---

## 架构定义

这是一个自研的功能,很简单。作用就是对错误信息进行存储归纳,并将错误信息对象化,增加更多可编程属性。

## 引用

```php
use PHPZlc\PHPZlc\Abnormal\Error;
use PHPZlc\PHPZlc\Abnormal\Errors;
```

## 设置追加错误

```
Errors::setError(new Error('错误信息'));
Errors::setErrorMessage('错误信息');
```

## 设置异常错误

```php
Errors::exceptionError(new \Exception('错误信息'));
```

_如果在开发模式中,则会直接抛出错误,程序中止。_

_如果在生产模式中,则会写入错误**系统繁忙,请稍后再试**。程序不会报错将错误信息写入日志文件,返回**false**。_

**此方法一般放在try catch 语法结构中**

```php
try {

}catch (\Exception $exception){
   return Errors::exceptionError($exception);
}
```

## 验证类是否符合验证注释并设置错误
   
```php 
Errors::validate($validator, $class); //return bool
```
   
与[Symfony-Validate](https://symfony.com/doc/4.4/validation.html)相结合
   
在`Controller`中写法示例:
   
```php
use Symfony\Component\Validator\Validator\ValidatorInterface;

public function index(ValidatorInterface $validator)
{
   if(Errors::validate($validator, $class)){
       echo 'ok';
   }else{
       echo 'no';
   }
}   
```

## 得到错误
   
```php
Errors::getError();
Errors::getAllError();
Errors::getAllErrorArray();
```

**注意**

`getError` 获得最早记录的错误

## 判断是否存在错误

```php
Errors::isExistError(); // return bool
```
  

## 覆盖错误信息(在错误集合前追加错误信息)
   
```php
Errors::coverError(new Error('错误信息'));
Errors::coverErrorMessage('错误信息');
```

## 清空错误
   
```php
Errors::clearError()
```

## 主动发送报错邮件提醒开发者

```php
Errors::notificationError($msg);
```
   
邮箱配置和内容详见：[prod模式下报错信息邮箱通知功能启用](/phpzlc/exception.markdown#prod模式下报错信息邮箱通知功能启用)

## 详解 Class Error

```php
namespace PHPZlc\PHPZlc\Abnormal;

class Error
{
    /**
     * @var string 错误码
     */
    public $code;

    /**
     * @var string 错误信息
     */
    public $msg;

    /**
     * @var string 错误名或标识
     */
    public $name;

    /**
     * @var void
     */
    public $value;

    /**
     * @var string 错误分组
     */
    public $group;

    /**
     * @var array  错误其他信息
     */
    public $other;

    /**
     * Error constructor.
     *
     * @param $msg
     * @param int $code
     * @param string $name
     * @param static $group
     * @param array $other
     */
    public function __construct($msg, $code = '$_ENV[API_ERROR_CODE]def(1)', $name = '', $value = '', $group = '', $other = array())
}
```

_方法后面参数的的作用,主要用于对错误进行分组,标记。合理巧妙的使用这些参数,就可以获得丰富的体验。_

