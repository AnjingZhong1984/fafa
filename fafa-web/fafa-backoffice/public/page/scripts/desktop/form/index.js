$(function () {
    org.breezee.menu.topSelect('form');

    org.breezee.page = {
        init: function () {
            this._orgTree = this.orgTree('#orgTree');
            this.formList('#accountList');
        },
        
        orgTree: function (panelId) {
            var me = this;
            return new Dolphin.TREE({
                panel: arguments[0],
                mockPathData: ['id'],
                defaultId: '-1',
                multiple: false,
                data:[{
                    id: 'aa',
                    code: 'aa',
                    type:'folder',
                    name: '美食',
                    children:[{
                        code:'bb',
                        name:'面包'
                    }]
                }]
            });
        },

        formList: function (panelId) {
            var me = this;
            return new Dolphin.LIST({
                panel: panelId,
                idField: 'id',
                columns: [{
                    code: 'name',
                    title: '字段名称',
                    width: '120px'
                }, {
                    code: 'code',
                    title: '字段类型',
                    width: '100px'
                }, {
                    code: 'channel',
                    title: '字段描述'
                }, {
                    code: 'evalate',
                    title: '可评分'
                }, {
                    code: 'pic',
                    title: '图片'
                },{
                    code: 'pic',
                    title: '可输入'
                }, {
                    code:'item',
                    title: '内容'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (data) {
                }
            });
        }
    };
    org.breezee.page.init();
});