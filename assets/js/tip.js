$(function(){
    var show_id = '';

    function show(){
        $.ajax({
            url: "https://api.phpzlc.com/api/feedback/show",
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

    show();

    $(".send_btn").click(function(){
        var advice = $("#advice").val();
        var contact = $("#contact").val();
        $.ajax({
            url: "https://api.phpzlc.com/api/feedback/submit",
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