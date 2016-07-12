/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */

$(function () {

    $("#username").focus();

    $('#submit').click(function () {
        var data = Dolphin.form.getValue('form');
        var redirectUrl = $(this).data('redirect') || '/index';
        Dolphin.ajax({
            url: '/api/login',
            type: Dolphin.requestMethod.POST,
            data: Dolphin.json2string(data),
            success: function (reData, textStatus) {
                if(!reData.success){
                    $('.error-mess').css('display','block');
                    $('#error-message').html(reData.msg);
                }else{
                    $('.error-mess').css('display','none');
                    Dolphin.goUrl(redirectUrl);
                }
                $('#submit').attr("disabled", false);
                $('#submit').val("登录");
            },
            onError: function () {
                $('#submit').attr("disabled", false);
                $('#submit').val("登录");
            }
        });
        $('#submit').attr("disabled", true);
        $('#submit').val("正在登录...");
    });

    $("input[name='password']").keydown(function (e) {
        if (e.keyCode == 13) {
            $('#submit').click();
        }
    });
});