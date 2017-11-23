var app = angular.module('guandaoMain',['ngRoute']);

// 路由配置
app.config(function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:"./module/indexList.html",
            controller:"indexList",
        })
        .when('/mapList',{
            templateUrl:"./module/mapList.html",
            controller:"mapList",
        })
        .when('/look',{
            templateUrl:"./module/look.html",
            controller:"looList",
        })
        .otherwise({
            // redirectTo:"/list/top250/1"
        })
});

// 总页面
app.controller('mainCtrl',['$scope', '$http',function($scope,$http) {
    $scope.isunityBox = false;
    $scope.mapListLog = 0;
    $scope.list = [{text:'首页',isActive:true,location:'#/'},{text:'管道监控',isActive:false,location:'#/mapList'},{text:'剖面查看',isActive:false,location:'#/look'},{text:'管道信息',isActive:false},{text:'管线申报',isActive:false},{text:'巡视记录',isActive:false},{text:'物联网',isActive:false}];
    for(var j = 0;j<$scope.list.length;j++) {
        $scope.list[j].isActive = false;
        if(location.hash == $scope.list[j].location) {
            $scope.list[j].isActive = true;
        }
    }

    // 改变导航栏样式
    $scope.getCurrentList=function(index) {
        for (var i = 0; i < $scope.list.length; i++) {
            $scope.list[i].isActive = false; //点击的时候其他的都不加样式
        }
        $scope.list[index].isActive=true; //ng-click时当前的添加样式
    }
}]);

// 可视化模块
app.controller('indexList',['$scope', '$routeParams','$http',function($scope,$routeParams,$http) {
    $scope.$parent.isunityBox = false;
    var rainLine = echarts.init($(".rain-line")[0]),
        milLine = echarts.init($(".mileage-line")[0]),
        warnColumnar = echarts.init($(".warn-columnar")[0]),
        occuColumnar = echarts.init($(".occupancy-columnar")[0]),
        rainLineDate,
        milLineDate,
        warnColumnarDate,
        occuColumnarDate;

    // 管道容量
    occuColumnarDate = {
        tooltip: {
            trigger: 'axis',
            axis:'radius',
            axisPointer: {
                type: 'shadow',

                // 弹出样式
                /* label: {
                        show: true,
                        padding:5,
                        margin:[1,1],
                        backgroundColor: '#fff',
                        borderColor: '#FEA41E',
                        borderRadius: 10,
                        borderWidth: 2,
                        shadowBlur: 10,
                        shadowcolor:'rgba(254,164,30,.1)',
                        barBorderRadius: 5,
                    }*/
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            top: '30%',
            containLabel: true
        },
        xAxis: {
            data: [1,2,3,4,5,6,7,8,9,10,11,12],
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#0798D9'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            splitLine: {show: false},
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#0798D9'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        series: [{
            name: '管道容量量',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#14c8d4'},
                            {offset: 1, color: '#43eec6'}
                        ]
                    )
                }
            },
            data: [100,200,400,100,500,400,100,500,600,700,400,100]
        }]
    }

    // 告警数目,水位,有害气体按月
    warnColumnarDate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
        },
        legend: {
            itemGap: 15,
            data: ['水位', '有害气体'],
            right: '20%',
            top: '5%',
            itemHeight: 10,
            borderRadius: 50,
            textStyle: {
                fontSize: 12,
                color: '#F1F1F3'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    show: false
                },
            }
        ],
        yAxis: [
            {
                type: 'value',

                // 背景刻度
                splitLine: {
                    lineStyle: {
                        color: ['#3277a5']
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    show: false
                },
            }
        ],
        series: [
            {
                name: '水位',
                type: 'bar',
                data: [100, 130, 140, 142,145,180,190,130,160,175,153,130],
                itemStyle: {
                    normal: {
                        color: '#6F9E58',
                        barBorderRadius: 10,
                        shadowBlur: 1
                    }
                },
                barCategoryGap: '60%'
            },
            {
                name: '有害气体',
                type: 'bar',
                data: [320, 640, 301, 334,410,300,350,390,420,340,300,410],
                itemStyle: {
                    normal: {
                        color: '#47C5F7',
                        barBorderRadius: 10,
                        shadowBlur: 1
                    }
                },
                barCategoryGap: '60%'
            },
        ]
    }

    // 降雨量数据
    rainLineDate = {
        color: ['#F89406'],
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '30%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月'],
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'value',

            // 背景刻度
            splitLine: {
                lineStyle: {
                    color: ['#3277a5']
                }
            },

            // 设置轴
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#fff'
                }
            },

            // 隐藏刻度线
            axisTick: {
                show: false
            },
        },
        series: [
            {
                name: '降雨量',
                type: 'line',
                data: [6, 2, 5, 3, 4, 6, 7,9.1,4.1,5,4.2],
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#F89406'
                        }
                    }
                },
            },
            {
                name: '雨水管水位',
                type: 'line',
                data: [1, 3, 5, 6, 7, 9, 10,12.13,11.10,9,15],
                itemStyle: {
                    normal: {
                        color: '#7a35c1'
                    }
                },
                lineStyle: {
                    normal: {
                        color: '#7a35c1'
                    }
                }
            },
        ]
    };

    // milCharts
    milLineDate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(255,255,255,0.1)',
                    shadowBlur: 10,
                    shadowColor:'rgba(0,0,0,0.5)'
                }
            },
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: true,
                boundaryGap: true,
                lineStyle: {
                    color:'#83B460',
                    width : '5',
                    type: 'dotted',
                }
            },
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#767779',
                    type: 'dashed'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#83B460'
                }
            },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 12
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#3277a5'
                }
            }
        }],
        series: [{
            name: '管道建设里程数',
            type: 'line',
            symbol: 'none',
            smooth: true,
            lineStyle: {
                normal: {
                    width:0
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(32,149,237, 1)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(57,128,167, 0.5)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(32,149,237)'
                }
            },
            data: [200,220,250,200.300,400,450,330,250,200,300,220,100]
        }]
    };
    rainLine.setOption(rainLineDate);
    occuColumnar.setOption(occuColumnarDate);
    milLine.setOption(milLineDate);
    warnColumnar.setOption(warnColumnarDate)

}]);

// 3D
app.controller('mapList',['$scope', '$routeParams','$http',function($scope,$routeParams,$http) {
    $scope.$parent.isunityBox = true;
    $scope.isToggle = false;
    $scope.mapHeight = 0;
    $scope.isShowTable = true;
    $scope.mapListLog = $scope.$parent.mapListLog++;
    $scope.timer;
    var combox = $('.table-from')[0],
        $toggleIcon = $('.widget-header-toggle i');

    // 表格数据
    fetch("http://rj.zzx1983.com:30073/datest/spring/DataAccessSQL",{method:"POST",headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: "method=query&options={serviceName:postgresql}&params={}&scripttext=SELECT  name,gdstart,gdend,type,code,size,sdeepth,edeepth,owner FROM public.nb_pipeline order by id"
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        $scope.tableList = json.data;
        $scope.$apply();//需要手动刷新
    });

    fetch("http://rj.zzx1983.com:30073/datest/spring/DataAccessSQL",{method:"POST",headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: "method=query&options={serviceName:postgresql}&params={}&scripttext=SELECT name,type,address,code FROM public.nb_gj_monitor order by id"
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        $scope.tableListGJ = json.data;
        $scope.$apply();//需要手动刷新
    });

    // 事件
    $scope.guandaoTable = function () {
        $scope.isShowTable = true;
    }
    $scope.guanjinTable = function () {
        $scope.isShowTable = false;
    }
    $scope.toggleTable = function () {
        if ($scope.flag) {
            $toggleIcon.attr('class','glyphicon glyphicon-chevron-down');
            mapHeight = -4;
            timer = setInterval(slideleft, 20);
        } else {
            $toggleIcon.attr('class','glyphicon glyphicon-chevron-up');
            mapHeight = -30;
            timer = setInterval(slideright, 20);
        }
    }
    $scope.TrdbClick = function (index) {
        alert(index);
    }

    // 展开收缩
    function slideright() {
        if (mapHeight >= -4) {
            clearInterval(timer);
            $scope.flag = !$scope.flag;
            return false;
        } else {
            mapHeight += 2;
            combox.style.top = mapHeight + '%';
        }
    }

    // 展开
    function slideleft() {
        if (mapHeight <= -30) {
            clearInterval(timer);
            $scope.flag = !$scope.flag;
            return false;
        } else {
            mapHeight -= 2;
            combox.style.top = mapHeight + '%';
        }
    }
    var tian_di_tu_road_layer = new ol.layer.Tile({
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    var tian_di_tu_annotation = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    var power_line_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:power_line',
            }
        })
    });
    var tx_line_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:tx_line',
            }
        })
    });
    var watch_point_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:watch_point',
            }
        })
    });
    var monitor_point_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:monitor_com_layer',
            }
        })
    });
    var testsource = new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://localhost:8080/geoserver/cite/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'cite:watch_point',
        }
    });
    var bounds = [13488451.2345924, 3528135.88133545, 13489479.0683189, 3528267.02237706];
    var map = new ol.Map({
        layers: [tian_di_tu_road_layer, tian_di_tu_annotation],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: [13489000, 3528200],
            zoom: 17
        })
    });

    map.on('singleclick', function (evt) {
        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        var url = testsource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            { 'INFO_FORMAT': 'application/json' });//text/html
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            var fc = json;
            if (fc.features.length > 0) {
                alert(fc.features[0].properties.name);
                sendmessageto3d(fc.features[0].properties.name);
            }
        });
    });
    if($scope.mapListLog < 1) {
        // var gameInstance = UnityLoader.instantiate("gameContainer", "./assets/webapps/PipelineViewer/Build/PipelineViewer.json", {onProgress: UnityProgress});
    }
    function sendmessageto3d(txt){
        gameInstance.SendMessage("CommunicationStub", "FocusToPipelineByWeb", txt);
    }
    function GetParamsFromUnity(obj){
    }

}]);

// look
app.controller('looList',['$scope', '$routeParams','$http',function($scope,$routeParams,$http) {
    $scope.$parent.isunityBox = false;
    $scope.isToggle = false;
    $scope.mapHeight = 0;
    $scope.timer;
    $scope.mapListLog = $scope.$parent.mapListLog++;
    var combox = $('.table-from')[0];
    var $toggleIcon = $('.widget-header-toggle i');

    // TODO
    /*$.ajax({
        url:'http://rj.zzx1983.com:30073/datest/spring/DataAccessSQL',
        type:'post',
        contentType:'application/x-www-form-urlencoded',
        data:"method=query&options={serviceName:postgresql}&params={}&scripttext=SELECT name,type,address,code FROM public.nb_gj_monitor order by id",
        success:function (data) {
            console.log(data);
        },
        error:function () {
            console.log('error');
        }

    })*/

    // 表格数据
    fetch("http://rj.zzx1983.com:30073/datest/spring/DataAccessSQL",{method:"POST",headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: "method=query&options={serviceName:postgresql}&params={}&scripttext=SELECT name,code,type,size,owner FROM public.nb_gongjin order by id"
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        $scope.tableList = json.data;
        $scope.$apply();//需要手动刷新
    });

    $scope.toggleTable = function () {
        if ($scope.flag) {
            $toggleIcon.attr('class','glyphicon glyphicon-chevron-down');
            mapHeight = -4;
            timer = setInterval(slideleft, 20);
        } else {
            $toggleIcon.attr('class','glyphicon glyphicon-chevron-up');
            mapHeight = -30;
            timer = setInterval(slideright, 20);
        }
    }
    $scope.TrdbClick = function (index) {
        alert(index);
    }

    // 展开收缩
    function slideright() {
        if (mapHeight >= -4) {
            clearInterval(timer);
            $scope.flag = !$scope.flag;
            return false;
        } else {
            mapHeight += 2;
            combox.style.top = mapHeight + '%';
        }
    }

    // 展开
    function slideleft() {
        if (mapHeight <= -30) {
            clearInterval(timer);
            $scope.flag = !$scope.flag;
            return false;
        } else {
            mapHeight -= 2;
            combox.style.top = mapHeight + '%';
        }
    }
    var tian_di_tu_road_layer = new ol.layer.Tile({
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    var tian_di_tu_annotation = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    var power_line_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:power_line',
            }
        })
    });
    var tx_line_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:tx_line',
            }
        })
    });
    var watch_point_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:watch_point',
            }
        })
    });
    var monitor_point_layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cite/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                STYLES: '',
                LAYERS: 'cite:monitor_com_layer',
            }
        })
    });
    var testsource = new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://localhost:8080/geoserver/cite/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'cite:watch_point',
        }
    });
    var bounds = [13488451.2345924, 3528135.88133545, 13489479.0683189, 3528267.02237706];
    var map = new ol.Map({
        layers: [tian_di_tu_road_layer, tian_di_tu_annotation],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: [13489000, 3528200],
            zoom: 17
        })
    });

    map.on('singleclick', function (evt) {
        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        var url = testsource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            { 'INFO_FORMAT': 'application/json' });//text/html
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            var fc = json;
            if (fc.features.length > 0) {
                alert(fc.features[0].properties.name);
                sendmessageto3d(fc.features[0].properties.name);
            }
        });
    });
    if($scope.mapListLog < 1) {
        // var gameInstance = UnityLoader.instantiate("gameContainer", "./assets/webapps/PipelineViewer/Build/PipelineViewer.json", {onProgress: UnityProgress});
    }
    function sendmessageto3d(txt){
        gameInstance.SendMessage("CommunicationStub", "FocusToPipelineByWeb", txt);
    }
    function GetParamsFromUnity(obj){
    }
}])




