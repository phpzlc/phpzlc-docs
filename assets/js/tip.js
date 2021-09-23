$(function(){
    var show_id = '';

      // 设置Cookie
    function setCookie(cname,cvalue,exdays){
        var d = new Date();
        // d.setTime(d.getTime()+(exdays*24*60*60*1000));
        d.setTime(d.getTime()+(exdays*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }

    // 获取Cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }

    // 判断是否有Cookie
    function checkCookie(){
        var user=getCookie("username");
        if (user!=""){
            alert("欢迎 " + user + " 再次访问");
        }
        else {
            user = prompt("请输入你的名字:","");
                if (user!="" && user!=null){
                setCookie("username",user,10);
            }
        }
    }

    // 判断Cookie是否存在
    if(window.localStorage.getItem('time_ready') == null){
        if(getCookie('name') == ''){
            // console.log('Cookie不存在');
            window.localStorage.removeItem('time');
            window.localStorage.setItem('time_ready',true);
            setCookie('name','Noir1','216000');
            if(window.localStorage.getItem('time') == null){
                var num = 0;
            }else {
                var num = window.localStorage.getItem('time');
            }
            var timer = setInterval(() => {
                num++;
                if(num >= 20){
                    show();
                    window.localStorage.removeItem('time_ready');
                    clearInterval(timer);
                }else {
                    window.localStorage.setItem('time',num);
                    // console.log(num);
                }
            }, 1000);
        }else {
            // console.log(getCookie('name'));
            window.localStorage.removeItem('time');
            window.localStorage.removeItem('time_ready');
        }
    }else {
        if(window.localStorage.getItem('time') == null){
            var num = 0;
        }else {
            var num = window.localStorage.getItem('time');
        }
        var timer = setInterval(() => {
            num++;
            if(num >= 20){
                show();
                window.localStorage.removeItem('time_ready');
                clearInterval(timer);
            }else {
                window.localStorage.setItem('time',num);
                // console.log(num);
            }
        }, 1000);
    }

    $(".cancel_btn").click(function(){
        hide();
    })

    $(".cancel_btn_2").click(function(){
        hide();
    })

    show();

    function show(){
        $(".mask_tip").css({"display":"block"});
        $.ajax({
            url: "http://api.phpzlc.com/api/feedback/show",
            data: {
            },
            type: "POST",
            dataType: "json",
            success: function(data) {
                if(data.code == 0){
                    show_id = data.data.show_id;
                }
            }
        });
    }

    function hide(){
        $(".mask_tip").css({"display":"none"});
    }

    $(".send_btn").click(function(){
        var advice = $("#advice").val();
        var contact = $("#contact").val();
        // console.log(advice,contact);
        $.ajax({
            url: "http://api.phpzlc.com/api/feedback/submit",
            data: {
                content: advice,
                contact_way: contact,
                show_id: show_id
            },
            type: "POST",
            dataType: "json",
            success: function(data) {
                // console.log(data)
                if(data.code == 0){
                    // alert(data.msg)
                    $(".tips").text(data.msg);
                    $(".tips").css({"color":"#2fea2f"});
                }else {
                    $(".tips").text(data.msg);
                    $(".tips").css({"color":"#e62e2f"});
                }
            }
        });
    })
})