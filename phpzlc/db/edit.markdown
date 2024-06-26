---
title: 插入、更新、删除
description: Symfony表的插入、更新、删除
keys: symfony,phpzlc,orm,表,插入,更新,删除
---

## 官方链接

[数据库和ORM准则](https://symfony.com/doc/4.4/doctrine.html)

## 架构定义

1. 代码可以在Controller书写。前提是他足够的简单和用途单一。如果不符合应当在Business完成。

2. 普遍适用的验证的代码应当集中在一起,方便写库的代码便捷的调用。

3. 验证的逻辑通常情况下使用注释验证即可,如果出现注释验证不能满足的情况下,应该在Business中对验证方法进行重写。

## 可能需要的类依赖

1. Controller 写法依赖

    ```php
    use App\Entity\User;
    use PHPZlc\PHPZlc\Abnormal\Error;
    use PHPZlc\PHPZlc\Abnormal\Errors;
    use Symfony\Component\HttpFoundation\Request;
    use Symfony\Component\HttpFoundation\Response;
    use Symfony\Component\Validator\Validator\ValidatorInterface;
    use PHPZlc\PHPZlc\Bundle\Safety\ActionLoad;
    ```

2. Business 写法依赖

    ```php
    namespace App\Business;
   
    use App\Entity\User;
    use PHPZlc\PHPZlc\Bundle\Business\AbstractBusiness;
        
    class UserBusiness extends AbstractBusiness{}
    ```

## 插入

1. Controller 写法

    ```php
    use Symfony\Component\Validator\Validator\ValidatorInterface;
    use Symfony\Component\HttpFoundation\Request;
    
    public function createUser(ValidatorInterface $validator, Request $request)
    {
        $manager = ActionLoad::$globalDoctrine->getManager();

        $user = new User();
        $user->setName($request->get('name'));
        $user->setIsDisable(true);
        $user->setCreateAt(new \DateTime());

        //类注释验证
        if(Errors::validate($validator, $user)){
            $manager->persist($user);
            $manager->flush();

            return Responses::success('创建成功');
        }

        return Responses::error(Errors::getError());
    }
    ```

2. Business 写法

    ```php
    public function createUser(User $user)
    {
        $user->setCreateAt(new \DateTime());

        //类注释验证
        if($this->validator($user)){
            $this->em->persist($user);
            $this->em->flush();

            return $user;
        }

        return false;
    }
    ```

## 编辑

1. Controller 写法

    ```php
    use Symfony\Component\Validator\Validator\ValidatorInterface;
    use Symfony\Component\HttpFoundation\Request;
    
    public function updateUser(ValidatorInterface $validator, Request $request)
    {
        $manager = ActionLoad::$globalDoctrine->getManager();

        $user = ActionLoad::$globalDoctrine->getRepository('App:User')->find($request->get('id'));

        $user->setName($request->get('name'));

        //类注释验证
        if(Errors::validate($validator, $user)){
            $manager->flush();
            
            return Responses::success('编辑成功');
        }
        
        return Responses::error(Errors::getError());
    }
    ```

2. Business 写法

    ```php
    public function updateUser(User $user)
    {
        //类注释验证
        if($this->validator($user)){
            $this->em->flush();

            return true;
        }

        return false;
    }
    ```   

## 删除

1. Controller 写法

    ```php
    public function removeUser(Request $request)
    {
        $manager = ActionLoad::$globalDoctrine->getManager();

        $user = ActionLoad::$globalDoctrine->getRepository('App:User')->find($request->get('id'));

        $manager->remove($user);
        $manager->flush();

        return Responses::success('删除成功');
    }
    ```

2. Business 写法

    ```php
    public function removeUser(User $user)
    {
        $this->em->remove($user);

        $this->em->flush();

        return true;
    }
    ```
   
## 更多校验

1. Controller 写法

    _复杂的校验,应该在Business中完成。_

2. Business 写法

    ```php
    public function validator($class): bool
    {
        if(parent::validator($class)) {
            if($class instanceof User ) {
                //检查名称是否重复
                $user = $this->em->getRepository('App:User')->findOneBy(['name' => $class->getName()]);
                if(!empty($user) && $site->getId() != $class->getId()){
                    Errors::setErrorMessage('用户名称已存在');
                    return false;
                }
             }

             return true;
         }

        return false;
    }
    ```
   
## 了解更多

[事务与并发](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/transactions-and-concurrency.html#transactions-and-concurrency)
