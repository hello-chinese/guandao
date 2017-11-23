    var websocket = null;
    
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://localhost:8080/nbwebsocket/chat");
    }
    else {
        alert('当前浏览器 Not support websocket')
    }

    
    websocket.onerror = function () {
        setMessageInnerHTML("WebSocket连接发生错误");
    };

    
    websocket.onopen = function () {
        setMessageInnerHTML("WebSocket连接成功");
    }

    
    websocket.onmessage = function (event) {
        setMessageInnerHTML(event.data);
       monitor_point_layer.getSource().updateParams({"time": Date.now()});      
       // alert('1');
    }

    
    websocket.onclose = function () {
        setMessageInnerHTML("WebSocket连接关闭");
    }

    
    window.onbeforeunload = function () {
        closeWebSocket();
    }

   
    function setMessageInnerHTML(txt) {
        //alert(txt);
    }

    
    function closeWebSocket() {
        websocket.close();
    }
