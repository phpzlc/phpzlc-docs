---
title: 登录授权(auth-business)
description: 提供登录,修改密码等基础功能
keys: auth,auth-business,phpzlc/auth-business,登录,授权
---
## 业务介绍

提供登录,修改密码等基础功能

## 源码地址

[phpzlc/auth-business](https://github.com/phpzlc/auth-business)

## 安装

```shell
composer require phpzlc/auth-business
```

安装完成后执行更新数据库的操作

```shell 
php bin/console doctrine:schema:update --force
```

## YAML配置

config/packages/phpzlc-auth-business.yaml

```yaml
# 登录session名后缀
login_tag_session_name: _login_tag

# 操作主体- 系统
subject_system: system

# 操作主体- 管理员
subject_admin: admin

# 全部操作主体
subject_array:
    '%subject_system%': 系统
```

## 当前登录用户授权信息类(CurAuthSubject)

[CurAuthSubject](#) 当前登录用户授权信息类,属于该业务的基本类,用来对管理系统当前登录用户信息的存储与操作

```php
namespace App\Business\AuthBusiness;

use App\Entity\UserAuth;
use App\Business\AuthBusiness\UserInterface;

class CurAuthSubject
{
    /**
     * 当前管理员授权信息
     *
     * @var UserAuth
     */
    private static $cur_user_auth;

    /**
     * 当前管理员信息
     *
     * @var UserInterface
     */
    private static $cur_user;

    /**
     * 当前可跳转路由
     *
     * @var string
     */
    private static $cur_auth_success_go_url = '';

    /**
     * 设置当前管理员授权信息
     * 
     * @param UserAuth $userAuth
     */
    public static function setCurUserAuth(UserAuth $userAuth)
    {
        self::$cur_user_auth = $userAuth;
    }

    /**
     * 设置当前可跳转路由
     *
     * @param $cur_auth_success_go_url
     */
    public static function setCurAuthSuccessGoUrl($cur_auth_success_go_url)
    {
        self::$cur_auth_success_go_url = $cur_auth_success_go_url;
    }

    /**
     * 获取当前管理员授权信息
     * 
     * @return mixed
     */
    public static function getCurUserAuth()
    {
        return self::$cur_user_auth;
    }

    /**
     * 获取当前可跳转路由
     * 
     * @return string
     */
    public static function getCurAuthSuccessGoUrl()
    {
        return self::$cur_auth_success_go_url;
    }

    /**
     * 设置当前登录用户信息
     *
     * @param UserInterface $user
     */
    public static function setCurUser(UserInterface $user)
    {
        self::$cur_user = $user;
    }

    /**
     * 获取当前登录管理员信息
     *
     * @return UserInterface
     */
    public static function getCurUser()
    {
        return self::$cur_user;
    }
}
```
## 登录组件接口类(SubjectAuthInterface)

[SubjectAuthInterface](#) 登录组件接口类,属于该业务的基本类,用来规定多用户类型多平台类型的基本方法,该基本类可以根据多用户类型多平台类型进行改写

```php
namespace App\Business\AuthBusiness;

interface SubjectAuthInterface
{
    /**
     * 检查用户状态
     * 
     * @param $user
     * @return mixed
     */
    public function checkStatus($user);

    /**
     * 获取用户信息
     * 
     * @param $rules
     * @return mixed
     */
    public function user($rules);
}
```

## 多操作主体接口类(UserInterface)

[UserInterface](#) 多操作主体接口类,属于该业务的基本类,当管理系统设置多操作主体继承该类

```php
namespace App\Business\AuthBusiness;

interface UserInterface
{

}
```

## 授权标记类(AuthTag)

[AuthTag](#) 授权标记类,属于该业务的基本类,用来操作管理系统的Session标记

```php
namespace App\Business\AuthBusiness;

use App\Business\PlatformBusiness\PlatformClass;
use App\Entity\UserAuth;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Exception;

class AuthTag
{
    /**
     * 设置Session标记
     *
     * 该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台登录进行设置session的操作
     * 
     * @param ContainerInterface $container
     * @param UserAuth $userAuth
     * @return string
     * @throws Exception
     */
    public static function set(ContainerInterface $container, UserAuth $userAuth)
    {
        $tag = '';
        
        //根据不同的操作平台,进行不同的Session标记设置
        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $container->get('session')->set(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'), $userAuth->getId());
                break;
            default:
                throw new \Exception('来源溢出');
        }
        // 根据业务需要,需要返回业务内容,可通过此参数返回
        return $tag;
    }

    /**
     * 获取Session标记内容
     * 
     * 该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台进行获取session的操作,在本组件中,我们统一获取的返回值为对象
     *
     * @param ContainerInterface $container
     * @return UserAuth|false|object
     * @throws Exception
     */
    public static function get(ContainerInterface $container)
    {
        $userAuth = null;

        /**
         * @var ManagerRegistry $doctrine
         */
        $doctrine = $container->get('doctrine');
        
        // 根据不同的操作平台,进行对应平台的Session标记获取
        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $user_auth_id = $container->get('session')->get(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'));
                $userAuth = $doctrine->getRepository('App:UserAuth')->find($user_auth_id);
                break;
            default:
                throw new \Exception('来源溢出');
        }
        // 返回对应操作平台当前登录的用户授权信息
        return $userAuth;
    }

    /**
     * 移除Session标记
     * 
     * 该方法可以根据实际使用场景进行改写,具体改写形式：添加switch 的 case 判断条件可以给多类型平台进行删除session的操作
     *
     * @param ContainerInterface $container
     * @throws Exception
     */
    public static function remove(ContainerInterface $container)
    {
        switch (PlatformClass::getPlatform()){
            case $container->get('parameter_bag')->get('platform_admin'):
                $container->get('session')->remove(PlatformClass::getPlatform() . $container->get('parameter_bag')->get('login_tag_session_name'));
                break;
            default:
                throw new \Exception('来源溢出');
        }
    }

}
```
## 登录业务类(UserAuthBusiness)

[UserAuthBusiness](#) 登录业务类,属于该业务的基本核心类,是整个授权登录组件的业务层,用来对管理系统中的登录业务的操作

```php
namespace App\Business\AuthBusiness;

use App\Business\AdminBusiness\AdminAuth;
use App\Entity\UserAuth;
use App\Repository\UserAuthRepository;
use PHPZlc\PHPZlc\Abnormal\Errors;
use PHPZlc\PHPZlc\Bundle\Business\AbstractBusiness;
use Psr\Container\ContainerInterface;

class UserAuthBusiness extends AbstractBusiness
{
    /**
     * 新建用户授权
     * 
     * 我们将所有不同类型操作主体的基本内容(类型,密码,创建时间等)都进行统一管理,该方法用于对所有操作主体的基本内容进行新建,在新建不同主体登录账号时即可调用该方法.
     *
     * @param UserAuth $userAuth
     * @param bool $is_flush
     * @return bool
     * @throws \Exception
     */
    public function create(UserAuth $userAuth, $is_flush = true)
    {
        $userAuth->setCreateAt(new \DateTime());
        
        if(!$this->validator($userAuth)){
            return false;
        }

        try {
            $this->em->persist($userAuth);
            
            if($is_flush){
                $this->em->flush();
                $this->em->clear();
            }
            
            return true;
            
        }catch (\Exception $exception){
            $this->networkError($exception);
            return false;
        }
    }
    
    /**
    * 获取指定平台端方法
    *
    * @param $subject_type
    * @return SubjectAuthInterface
    * @throws \Exception
    */
    private function getUserAuthService($subject_type)
    {
        if(!array_key_exists($subject_type, $this->subjectAuthCaches)){
            // 根据操作主体来获取对应的平台端方法
            switch ($subject_type){
                case $this->getParameter('subject_admin'):
                    //将获取的平台方法存到对应的操作主体缓存数组中
                    $this->subjectAuthCaches[$subject_type] = new AdminAuth($this->container);
                    break;
    
                    default:
                        throw new \Exception('授权登录权限不存在');
            }
        }
        // 返回获取到的不同主体对应的平台端方法
        return $this->subjectAuthCaches[$subject_type];
    }
    
    /**
    * 账号登录
    *
    * @param $account
    * @param $password
    * @param $subject_type
    * @param string $account_field
    * @param string $userAuthFunctionName
    * @param string $account_title
    * @return false|void
    * @throws \Exception
    */
    public function accountLogin($account, $password, $subject_type, $account_field = 'account', $account_title = '账号', $userAuthFunctionName = 'getUserAuth')
    {
        $userAuth = $this->accountCheck($account, $password, $subject_type, $account_field, $account_title, $userAuthFunctionName);
    
        if($userAuth === false){
            return false;
        }
    
        return $this->login($userAuth);
    }
    
    /**
    * 修改密码
    *
    * @param UserAuth $userAuth
    * @param $old_password
    * @param $new_password
    * @return bool
    * @throws \Exception
    */
    public function changePassword(UserAuth $userAuth, $old_password, $new_password)
    {
        if(empty($userAuth)){
            Errors::setErrorMessage('账号不存在');
            return false;
        }
            
        if(empty($old_password)){
            Errors::setErrorMessage('原始密码不能为空');
            return false;
        }
            
        if(empty($new_password)){
            Errors::setErrorMessage('新密码不能为空');
            return false;
        }
            
        if($userAuth->getPassword() != $this->encryptPassword($old_password, $userAuth->getSalt())){
            Errors::setErrorMessage('原始密码不正确');
            return false;
        }
    
        $userAuth->setPassword($new_password);
    
        if(Errors::isExistError()){
            return false;
        }
    
        try {
            $this->em->flush();
            $this->em->clear();
    
            return true;
        }catch (\Exception $exception){
            $this->networkError($exception);
            return false;
        }
    }

}
```

