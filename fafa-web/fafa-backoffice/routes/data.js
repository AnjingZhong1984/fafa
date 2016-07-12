/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */

var router = require('express').Router();
var request = require('request');
var api = require('../utils/api');
var logger = global.log4js.getLogger('data');

/**
 * 登录验证
 */
router.use('/login', function (req, res, next) {
    req.session = req.session || {};
    req.session.userData = {
        userCode: 'anjing',
        userName: '安静'
    };
    res.json({success:true});
    // global.tool.send({
    //     method: req.method,
    //     uri: api.get('dd3bcbbc5b7e4a06b8118ab44395a21d'),
    //     json: req.body
    // }, function (error, response, body) {
    //     if (body) {
    //         if(body.success){//登录成功，设置session
    //             req.session.userData = {
    //                 userCode: body.value.code,
    //                 userName: body.value.name,
    //                 language: req.headers["accept-language"] && req.headers["accept-language"].substr(0, 2),
    //                 company: body.value.company,
    //                 channel: body.value.channel,
    //                 orgId: body.value.org && body.value.org.id,
    //                 orgCode: body.value.org && body.value.org.code,
    //                 orgCategory: body.value.org && body.value.org.category,
    //                 province: body.value.province
    //             };
    //         }
    //         res.json(body);
    //     } else {
    //         res.json({success: false, msg: '后台服务请求出错'})
    //     }
    // });
});

router.all('*', api.apiAuthentication);

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    logger.info('data::' + req.path, Date.now());
    next();
});

/**
 * 转发请求
 */
router.use('/', function (req, res, next) {
    var realUri = pathMapping(req.originalUrl);
    if (!realUri) {
        res.json({success: false, code: 404, msg: 'No api route.'});
        return;
    }
    if (realUri.indexOf('/{') > 0) {
        res.json({success: false, code: 503, msg: 'Api Route Error:存在未替换变量'});
        return;
    }
    /**
     * 设置发送到后台的对象的公共值
     * @type {*|void}
     */
    var bodyData = global.tool.extend(req.body, {
        creator: req.session.userData.userCode,
        updator: req.session.userData.userCode,
        language: req.session.userData.language,
        equipment: global.tool.endTypeEnum[req.session.endType]
    });
    if (req.method == 'POST') {//如果是POST请求，则把后面的?参数放到JSON中去
        if (!bodyData.properties)
            bodyData.properties = {};
        for (var k in req.query) {
            bodyData.properties[k] = req.query[k];
        }
    }
    logger.info("Real Uri:" + realUri);
    global.tool.send({
        method: req.method,
        uri: realUri,
        json: bodyData
    }, function (error, response, body) {
        if (body)
            res.json(body);
        else
            res.json({success: false, msg: '后台服务请求出错'})
    });
});

/**
 * 根据映射关系，进行地址转换
 * 发送的地址为：/api/uuid@pathv1=v1&pathv2=v2?paramv1=pv1&paramv2=pv2
 *
 * @param path
 */
function pathMapping(path) {
    var sUrl = path.match(/\/api\/([\w-]+)@*([^\?]*)\?*(.*)/),
        uuid = sUrl[1],
        pathVar = sUrl[2],
        paramVar = sUrl[3],
        realUri = api.get(uuid),
        pathVar_ = pathVar.split('&'),
        items,
        regExp;
    if (realUri) {
        for (var i = 0; i < pathVar_.length; i++) {
            items = pathVar_[i].split("=");
            regExp = new RegExp('{' + items[0] + '}');
            realUri = realUri.replace(regExp, items[1]);
        }
        if (paramVar)
            realUri += '?' + paramVar;
    }
    return realUri;
}

module.exports = router;