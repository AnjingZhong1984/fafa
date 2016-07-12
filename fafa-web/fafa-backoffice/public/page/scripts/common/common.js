/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */

/**
 * 命名空间的定义
 * @param namespace
 * @returns {namespace}
 */
function namespace(namespace) {
    var object = this,
        tokens = namespace.split("."),
        token;
    while (tokens.length > 0) {
        token = tokens.shift();
        if (typeof object[token] === "undefined") {
            object[token] = {};
        }
        object = object[token];
    }
    /**
     * 此空间内的对象销毁
     * @param key
     */
    object.destroy = function (key) {
        //TODO:研究:我们需要知道当我们删除此对象的时候，
        // 在此对象中设置的一些事件绑定，是否会清除掉。
        if (this[key]) {
            for(var k in this[key]){
                delete this[key][k];
            }
        }
        this[key]=null;
    };
    return object;
}
namespace("org.breezee");

/**
 * 设置本地的log，来支持在debug
 */
org.breezee.logger = console;

/**
 * list空间中的一些util方法
 * @type {{edit: org.breezee.buttons.edit, del: org.breezee.buttons.del, editCallback: org.breezee.buttons.editCallback, delCallback: org.breezee.buttons.delCallback}}
 */
org.breezee.buttons = {
    /**
     * 创建编辑按钮，在list中
     * @param data
     * @param callback
     * @returns {string}
     */
    edit: function (data, callback) {
        var s = '<a class="btn btn-outline btn-circle btn-sm purple editBtn" ';
        if (data) {
            for (var k in data) {
                if (data[k])
                    s += 'data-' + k + '="' + data[k] + '"';
            }
        }
        s += ' href="javascript:;"><i class="fa fa-edit"></i>编辑</a>';
        return s;
    },
    /**
     * 创建删除按钮，在list中
     * @param data
     * @param callback
     * @returns {string}
     */
    del: function (data, callback) {
        var s = '<a class="btn btn-outline btn-circle btn-sm dark delBtn" ';
        if (data) {
            for (var k in data) {
                if (data[k])
                    s += 'data-' + k + '="' + data[k] + '"';
            }
        }
        s += ' href="javascript:void(0);"><i class="fa fa-trash-o"></i>删除</a>';
        return s;
    },
    /**
     * 查看按钮
     * @param data
     * @param callback
     * @returns {string}
     */
    view: function (data, callback) {
        var s = '<a class="btn btn-outline btn-sm dark viewBtn" ';
        if (data) {
            for (var k in data) {
                if (data[k])
                    s += 'data-' + k + '="' + data[k] + '"';
            }
        }
        s += ' href="javascript:;"><i class="fa fa-share"></i>查看</a>';
        return s;
    },
    /**
     * 编辑按钮的回调
     * @param apiId
     * @param field
     * @param cb
     */
    editCallback: function (apiId, field, cb) {
        $('.editBtn').click(function () {
            var _this = $(this);
            Dolphin.ajax({
                url: '/api/' + apiId + '@' + field + '=' + _this.data(field),
                type: Dolphin.requestMethod.GET,
                onSuccess: function (reData) {
                    Dolphin.form.setValue(reData.value, '.edit-form');
                    if (cb)
                        cb.call(this, reData)
                }
            });
        });
    },
    /**
     * 删除按钮的回调
     * @param apiId
     * @param cb
     */
    delCallback: function (apiId, cb) {
        $('.delBtn').click(function () {
            var _this = $(this);
            Dolphin.confirm('确认删除？', {
                callback: function (flag) {
                    if (flag) {
                        Dolphin.ajax({
                            url: '/api/' + apiId + '@id=' + _this.data('id'),
                            type: Dolphin.requestMethod.DELETE,
                            onSuccess: function (reData) {
                                if (cb)
                                    cb.call(this, reData)
                            }
                        });
                    }
                }
            })
        });
    },
    /**
     * 查看按钮的回调
     * @param apiId
     * @param cb
     */
    viewCallback: function (apiId, field, cb) {
        $('.viewBtn').click(function () {
            var _this = $(this);
            Dolphin.ajax({
                url: '/api/' + apiId + '@' + field + '=' + _this.data(field),
                type: Dolphin.requestMethod.GET,
                onSuccess: function (reData) {
                    Dolphin.form.setValue(reData.value, '.edit-form');
                    if (cb)
                        cb.call(this, reData)
                }
            });
        });
    }
};
