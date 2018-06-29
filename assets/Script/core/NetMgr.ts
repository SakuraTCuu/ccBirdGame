import VVMgr from "./VVMgr";
import { WebCmd, NotifyPath } from "../Const";

export default class NetMgr {

    static _URL = "wss://test.zrabsz.com:8080";
    static _wss: WebSocket;

    //连接
    static _connect(extraUrl: string = NetMgr._URL) {

        if (this._isConnect()) return;

        // 第一次建立链接比如wss://192.168.1.188:9200?token=后台给的token 必须带token （如果是游客 那么是没有token的值）
        if (VVMgr.token) {
            extraUrl = extraUrl + encodeURI("?token=" + VVMgr.token);
        }
        cc.log("NetMgr _connect ", extraUrl);
        const _wss = new WebSocket(extraUrl);
        this._wss = _wss;
        _wss.onopen = function(evt) { 
            cc.log("JS-WSS Connection open ..."); 
            NetMgr._startHearbeat();
        };

        _wss.onmessage = function(evt) {
            cc.log( "JS-WSS Received Message ...", evt.data);
            NetMgr._reply(evt.data);
        };

        _wss.onclose = function(evt) {
            cc.warn("JS-WSS Connection closed ...", evt);
            NetMgr._close(true);
        };  

        _wss.onerror = function(evt: Event) {
            cc.error("JS-WSS Connection error ...", evt);
            NetMgr._close();
        };
    }

    //开始心跳
    static _pingInterval = null;
    static _startHearbeat() {
        if (this._pingInterval == null) {
            this._pingInterval = setInterval(() => {
                this._send({"cmd":"ping"});  
            }, 20000);//每15s发送心跳
        }   
    }

    //
    static _close(recon = false) {
        if (this._wss == null) return;

        this._wss.close();
        this._wss = null;
        clearInterval(this._pingInterval);
        this._pingInterval = null;
        if (recon) {
            VVMgr.dispatchEvent(NotifyPath.SocketDisconnect, "");
            setTimeout(() => {
                cc.warn("JS-WSS ReConnection ...");
                this._connect();
            }, 10000);//15s后自动连接
        }
    }

    static _isConnect() {
        return this._wss && this._wss.readyState == WebSocket.OPEN;
    }

    //发送数据
    static _send(data) {
        if (this._isConnect()) {
            if (data) {
                if (typeof(data) == "object") {
                    data = JSON.stringify(data);
                }
                cc.log('------_send-----', data);
                this._wss.send(data);
            } else {
                cc.warn("JS-WSS _send empty");
            }
        } else {
            VVMgr.dispatchEvent(NotifyPath.SocketDisconnect, "");
        }
    }

    static _callbackMap = {};
    static _onEvent(cmd: WebCmd, callback: Function) {
        this._callbackMap[cmd] = callback;
    }

    static _offEvent(cmd: WebCmd) {
        if (this._callbackMap[cmd]) {
            this._callbackMap[cmd] = null;
        }
    }

    static _reply(data) {
        data = JSON.parse(data);
        const cmd = data['cmd'];
        const callback = this._callbackMap[cmd];
        if (callback) {
            callback(data);
        }
    }
}