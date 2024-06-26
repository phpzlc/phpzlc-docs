---
title: 后台内核(Admin)
description: 后台内核,为后台业务提供底层策略,写法支持.(导航菜单,基础页面)
keys: admin,phpzlc/admin,后台
---

## 业务介绍

后台内核,为后台业务提供底层策略,写法支持.(导航菜单,基础页面,导入,导出等功能)

## 源码地址

[phpzlc/admin](https://github.com/phpzlc/admin)

## 安装

```shell 
composer require phpzlc/admin
```

## 服务引入

后台控制器需要按照下列来实现基类
   
```php
class AdminController extends SystemBaseController
{
          /**
           * @var AdminStrategy
           */
          private $adminStrategy;
      
          /**
           * @var string
           */
          private $pageTag;
          
          public function inlet($returnType = SystemBaseController::RETURN_HIDE_RESOURCE, $isLogin = true)
          {
              $this->adminStrategy = new AdminStrategy($this->container);
              $this->adminStrategy->setPageTag($this->pageTag);
              
              return parent::inlet($returnType, $isLogin);
          }
}
```


## AdminStrategy

是后台核心机制类,主要用于设置后台系统的基本属性和动作
   
```php
 //菜单配置
$menus = [
    new Menu($title, $ico, $tag, $url, $url_target, [
    new Menu($title, $ico, $tag, $url, $url_target, $childs = array())
    ])
];           
    
$this->adminStrategy = new AdminStrategy($this->container);
    
//设置管理端基本信息(名称,页面标记,菜单......)
$this->adminStrategy
    // 设置后台标题
    ->setTitle('admin')
    // 设置后台入口URL
    ->setEntranceUrl($this->generateUrl('admin_manage_index'))
    // 设置后台退出登录URL
    ->setEndUrl($this->generateUrl('admin_manage_logout'))
    // 设置修改密码页面URL
    ->setSettingPwdUrl($this->generateUrl('admin_manage_edit_password'))
    // 设置后台页面模式
    ->setMenuModel(AdminStrategy::menu_model_simple)
    // 设置页面标记
    ->setPageTag($this->page_tag)
    // 设置清除缓存API地址url
    ->setClearCacheApiUrl($this->generateUrl('admin_manage_clearCache'))
    // 设置后台favicon_ico图标
    ->setFaviconIco('public/image/100.png')
    // 设置后台logo
    ->setLogo('public/image/200.png')
    // 设置后台导航菜单
    ->setMenus($menus)
    // 设置登陆页面背景图片
    ->setLoginLackGroundImg('public/image/200.png');
```

1. 设置锚点url
   
   用于设置表单提交,取消等需要返回到某个控制器层的action中时,我们可以使用该方法,将action设为锚点,一般在列表中设置。
   
     ```php
     public function setUrlAnchor()
     ```
   
2. 设置页面标记
   
   页面标记配置，需要在菜单相对应配置，用于菜单选项选中后高亮显示。
   
    ```php
    public function setPageTag($tag)
    ```

3. 设置后台标题
   
    ```php
    public function setTitle($title)
    ```

4. 设置后台favicon_ico图标
    
    ```php
    public function setFaviconIco($favicon_ico)
    ```

5. 设置后台logo
    
    ```php
    public function setLogo($logo)
    ```

6. 设置后台入口URL,一般用于返回首页功能

    ```php
    public function setEntranceUrl($entrance_url)
    ```
   
7. 设置退出登录URL
    
    ```php
    public function setEndUrl($end_url)
    ```

8. 设置密码修改页面url
   
    ```php
    public function setSettingPwdUrl($setting_pwd_url)
    ```

9. 设置清除缓存API地址url
   
    ```php
    public function setClearCacheApiUrl(string $clear_cache_api_url)
    ```

10. 设置管理员角色名称
   
    ```php
    public function setAdminRoleName($admin_role_name)
    ```
   
11. 设置登陆页面背景图片
   
    ```php
    public function setLoginLackGroundImg(string $login_lack_ground_img)
    ```
   
12. 设置管理员登录头像

    ```php
    public function setAdminAvatar(string $admin_avatar)
    ```

13. 设置head自定义代码

    ```php
    public function setHendCode(string $head_code)
    ```

## 面包线配置
        
1. 设置面包线
         
   ```php
   $this->adminStrategy->setNavigations(array $navigations)
   ```

2. 在原有的面包线上添加面包线
     
   ```php
   $this->adminStrategy->addNavigation(new Navigation($title, $url = ''));
   ```
   
## 模式切换

   本框架提供两种后台页面模式.这两种模式可以进行切换,适合不同量级的后台.
   
1. 简单模式(三级菜单,后期业务升级可便捷地切换到复杂模式)

   ![简单模式](/_image/posts/admin/model_simple.png)

2. 复杂模式(四级菜单,增加头部菜单,功能划分更精确直观)

   ![复杂模式](/_image/posts/admin/model_all.png)
   
3. 代码配置  
    
    ```php
    $this->adminStrategy = new AdminStrategy(ContainerInterface $container);
    $this->adminStrategy->setMenuModel(AdminStrategy::menu_model_simple) // 简单模式 menu_model_simple; 复杂模式 menu_model_all; 
    ```
   
## 设置导航菜单   
   
1. 我们将要显示的导航菜单根据它的层级设置一个多维数组$menus,然后调用
   
    ```php
    $this->adminStrategy->setMenus(array $menus);
    ```
   
2. 比较常用三级层级的导航菜单
   
    ```php
    new Menu('博客管理系统', null, null, null, null, [
          new Menu('博客管理', 'fa fa-clone', null, null, null, [
              new Menu('文章管理', null, 'admin_article_index', $this->generateUrl('admin_blog_manage_article_index'), null),
          ]),
    ]);
    ```
   
## 设置后台环境

我们提供全局变量参数，来改变后台环境显示.例如,内测;开发;样品;正式环境
   
1. 内测环境(配置地址.env.local)
   
   ```php
   ADMIN_ENV=beta
   ```   
   
   ![效果](/_image/posts/admin/beta.png)
   
2. 开发模式环境(配置地址.env.local)

   ```php
   ADMIN_ENV=dev
   ```
   
   ![效果](/_image/posts/admin/dev.png)
   
3. 样品环境(配置地址.env.local)

   ```php
   ADMIN_ENV=demo
   ```
   
   ![效果](/_image/posts/admin/demo.png)
   
4. 正式环境(配置地址.env.local)

   ```php
   ADMIN_ENV=prod
   ```      
   
   ![效果](/_image/posts/admin/prod.png)
   
## 页面技术栈

   [Vue.js](https://cn.vuejs.org/)
    
   [ElementUI](https://element.eleme.io/#/zh-CN/component/installation)
    
   [Twig](https://www.kancloud.cn/yunye/twig-cn/159454)
    
   [Font图标库](https://fontawesome.dashgame.com/)
    
## 仪表盘基本写法
   
1. 我们提供可复制的仪表盘页面[代码参考模板](https://github.com/phpzlc/demo-blog/blob/master/templates/page/statistical-station.html.twig)
   
2. 页面效果
   
   ![效果](/_image/posts/admin/data.png)

   
## 列表页面基本写法
   
1. 我们提供可复制的列表页面[代码参考模板](https://github.com/phpzlc/demo-blog/blob/master/templates/page/list.html.twig)
   
2. 页面效果
   
   ![效果](/_image/posts/admin/index.png)
   
3. 控制器层
   
    ```php
    /**
    * 用户管理首页
    *
    * @param Request|null $request
    * @return bool|JsonResponse|RedirectResponse|Response
    */
    public function index(Request $request = null)
    {
        $r = $this->inlet(self::RETURN_SHOW_RESOURCE, true);
        if($r !== true){    
            return $r;
        }

        // 设置当前页面为锚点
        $this->adminStrategy->setUrlAnchor();

        // 获取搜索框数据
        $user_name = $request->get('user_name');
        
        // 添加需要搜索字段的规则
        $rules = [
          'user_name' . Rule::RA_LIKE => '%' . $user_name . '%',
        ];
        
        // 页面页码配置(必须在控制器配置) 
        $page = $request->get('page', 1);

        // 页面展示数据的行数(必须在控制器配置， 默认展示20行数据)    
        $rows = $request->get('rows', 20);
        
        // 页面展示的数据    
        $data = $this->userRepository->findLimitAll($rows, $page, $rules);

        // 数据库数据的数量(必须在控制器配置)
        $count = $this->userRepository->findCount($rules);
        
        // 返回数据和页面
        return $this->render('admin/user/index.html.twig', array(
            'page' => $page,
            'rows' => $rows,
            'count' => $count,
            'users' => $data
        ));
    }
    ```      
   
   
## 新建/编辑页面基本写法
   
1. 我们提供可复制的新建/编辑页面[代码参考模板](https://github.com/phpzlc/demo-blog/blob/master/templates/page/edit.html.twig)

2. 页面效果

   ![效果](/_image/posts/admin/edit.png) 
   
3. 主要页面控件请进入[主要控件参考模板](https://github.com/phpzlc/demo-blog/blob/master/templates/page/control.html.twig)
   
4. 更多页面控件请进入[ElementUI](https://element.eleme.io/#/zh-CN/component/input)

   
## 导入功能基本写法

1. 安装组件[phpoffice/phpspreadsheet](https://packagist.org/packages/phpoffice/phpspreadsheet)
   
   ```text
   composer require phpoffice/phpspreadsheet
   ```
2. 页面层   
   
    ```php

    //  该功能控件常见于在列表页中,位置处于搜索框和数据列表页中间部分跟新建按钮存在一个标签中(特殊情况根据需求可以编写在任何你想要的页面)

    // 下载导入模板
    <el-button size="mini" @click="handleImportTemplate">下载导入模板</el-button>

    // 导入按钮
    <el-upload
       class="upload-demo"
       action="导入地址"
       :limit="1"
       :on-success="handleImport"
       :on-error = "handleImport"
       :file-list="fileList">
       <el-button size="small" type="primary">点击上传</el-button>
       <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
    </el-upload>
    
    <script>
       export default {
           methods: {
               handleImport(result){
                   const that = this;
                   resultPreprocess(that, result, "admin_url_anchor()");
               },
           }
       }
    </script>
    ```

3. 效果图

   ![效果](/_image/posts/admin/export.png)
   
4. 控制器层
       
    ```php
    /**
    * 导入模板下载
    *
    * @param Request $request
    * @return bool|JsonResponse|RedirectResponse|Response|void
    */
    public function importTemplate(Request $request)
    {
           $r = $this->inlet(self::RETURN_HIDE_RESOURCE, true);
           if($r !== true){
               return $r;
           }
           // 根据业务所设置的Business层
           $driverImportBusiness  = new DriverImportBusiness($this->container);
           return $driverImportBusiness->goUrl($driverImportBusiness->downloadImportTemplate($request));
    }
   
    /**
    * 导入功能
    *
    * @return bool|JsonResponse|RedirectResponse|Response
    * @throws \Doctrine\DBAL\ConnectionException
    */
    public function import()
    {
       // phpzlc框架控制器的入口方法
       $r = $this->inlet(self::RETURN_HIDE_RESOURCE, true);
       if($r !== true){
           return $r;
       }
    
       set_time_limit(0);
       ob_start();
       // 该Business层封装导入方法(该Business层根据业务需求所编写,但是必须继承Business/ExcelBusiness/ImportBusiness类)
       $ImportBusiness  = new ImportBusiness($this->container);
    
       /**
       * @var Connection $conn
       */
       $conn = ActionLoad::$globalDoctrine->getConnection();
       $conn->beginTransaction();
    
       try {
           // 通过Excel组件的Import获取上传导入的数据
           $data = $ImportBusiness->importData();
           // 循环data数据
           foreach ($data as $k => $v) {
               //将数据导入数据库当中
           }
           $conn->commit();
    
           return Responses::success('导入成功');
    
       }catch (PhpZlcApiException $exception){
           $conn->rollBack();
           return Responses::error($exception->getMessage());
       }
    
    }
    ```
      
5. Business层
  
    ```php
   // 命名空间
   namespace App\Business\DriverBusiness;
   
   //引用的文件
   use App\Business\ExcelBusiness\ImportBusiness;
   use PHPZlc\PHPZlc\Bundle\EventListener\ApiExceptionListener\PhpZlcApiException;
   
   class DriverImportBusiness extends ImportBusiness
   {
       public function importTemplateFilePath()
       {   
           // 导入模板的名称
           return '司机导入模板.xlsx';
       }
       
       // 序列化导入的数据
       public function format($data)
       {
           if(empty($data)){
               throw new PhpZlcApiException('导入数据不能为空');
           }
   
           $info = [];
           $drivers = [];
           
           // 数据的循环与判断
           foreach ($data as $index => $value){
               $name = $this->getValue($value, 0);
               $sex = $this->getValue($value, 1);
               $phone = $this->getValue($value, 2);
               $password = $this->getValue($value, 3);
               $id_card_no = $this->getValue($value, 4);
   
               $rows = $index + 1;
   
               if(empty($phone)){
                   throw new PhpZlcApiException('第' . $rows . '行手机号不能为空');
               }
   
               if(empty($sex)){
                   throw new PhpZlcApiException('第' . $rows . '行性别不能为空');
               }else{
                   if($sex == '男'){
                       $sex = 1;
                   }elseif ($sex == '女'){
                       $sex = 2;
                   }else{
                       throw new PhpZlcApiException('第' . $rows . '行请输入正确的性别');
                   }
               }
   
   
               $info[] = array(
                   'name' => $name,
                   'sex' => $sex,
                   'phone' => $phone,
                   'password' => $password,
                   'id_card_no' => $id_card_no
               );
   
           }
           return $info;
       }
   }
    ```
     
## 导出功能基本写法

1. 页面层
   
    ```php
    // 该控件的编写位置跟上面的下载导入模板和导入的位置相同(具体位置具体分析)
    <el-button size="mini" type="success" @click="export_data()">导出</el-button>

    <script>
       export default {
           methods: {
               export_data(){
                   window.location.href = urlParamWrite(getSelfUrl(), 'ex', '1');
               },
           }
       }
    </script>
    ```

2. 效果图

   ![效果](/_image/posts/admin/export.png)
     
3. 控制器层
  
    ```php
    /**
    * 导出
    *
    */
    public function info(Request $request)
    {
       $r = $this->inlet();
       if($r !== true){
           return $r;
       }
    
       $this->adminStrategy->setUrlAnchor();
    
       $rows = $request->get('rows', 20);
       $page = $request->get('page', 1);
       
       // 获取数据的规则
       $rules = [
           'feedDayDaily' => $request->get('id')
       ];
           
       $daily = ActionLoad::$globalDoctrine->getRepository('App:FeedDayDaily')->find($request->get('id'));
       
       // 通过ex判断是否是导出数据, 如若ex的值为1,则导出数据,如若不是,则显示页面
       if($request->get('ex') != 1){
   
       }else{
           // 调用phpzlcExport组件
           $ex = new Export();
   
           // 设置导出Excel表头(一维数组)
           $head = [];
    
           // 获取需要导出的数据
           $list = ActionLoad::$globalDoctrine->getRepository('App:FeedDayDailyInfo')->findAll($rules);
    
           $data = [];
           
           // 对需要导出的数据进行循环处理,放入data数组中(二维数组)
           foreach ($list as $value){
               $data[] = array(
                  $value->getId(),
                  $value->getName
               ）
           }
           
           // 调用Excel组件的export方法
           $ex->export($daily->getTitle(), $head, $data, true);
       }
    }
    ```

## 后台实战(更多写法)
  
  具体写法,更多特性可通过[demo项目](https://github.com/phpzlc/demo-blog)了解。

    
