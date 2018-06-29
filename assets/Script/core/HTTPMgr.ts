import VVMgr from "./VVMgr";

export default class HTTPMgr {

    //URL
    static _URL = "https://test.zrabsz.com";

    static get(path: string, param?: Object) {
        return this._request(this._URL + path, 'GET', param);
    }

    static post(path: string, param?: Object) {
        return this._request(this._URL + path, 'POST', param);
    }

    static get2(path: string, param?: Object) {
        return this._request2(path, 'GET', param);
    }

    //请求城市地址 特殊操作
    private static _request2(url: string, method: string, param?: Object) {
        return new Promise<any>((resolve, reject) => {
            const req = new XMLHttpRequest();
            let paramData = null;
            if (method == 'GET') {
                url = url + encodeURI(this.objParam2GetString(param));
            } else {
                paramData = param == null ? null : encodeURI(this.objParam2PostString(param));
            }
            cc.log("_request url ----- ", url);
            req.open(method, url, true);

            req.onreadystatechange = () => {
                // cc.log("---server status---", req.status);
                cc.log("---req readyState---", req.readyState);
                if (req.readyState == 4 && (req.status > 199 && req.status < 300)) {
                    cc.log("---req responseText---", req.responseText);
                    try {
                        const ret = JSON.parse(req.responseText);
                        cc.log(ret);
                        resolve(ret);
                        // reject(ret);
                    } catch (e) {
                        const ret = {
                            code: -1,
                            msg: 'parse err'
                        }
                        reject(ret);
                    } finally {
                    }
                }
            }
            req.onerror = (ev: ErrorEvent) => {
                const ret = {
                    code: -3,
                    msg: 'unknown err'
                }
                reject(ret);
            }
            req.ontimeout = (ev: ProgressEvent) => {
                const ret = {
                    code: -4,
                    msg: 'ontimeout err'
                }
                reject(ret);
            }
            req.send(paramData);
        });
    }

    private static _request(url: string, method: string, param?: Object) {
        return new Promise<any>((resolve, reject) => {
            const req = new XMLHttpRequest();
            let paramData = null;
            if (method == 'GET') {
                url = url + encodeURI(this.objParam2GetString(param));
            } else {
                paramData = param == null ? null : encodeURI(this.objParam2PostString(param));
            }
            cc.log("_request url ----- ", url);
            req.open(method, url, true);
            req.setRequestHeader("_version", "1.0");
            req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            req.setRequestHeader("system", cc.sys.os);
            if (cc.sys.osVersion) {
                req.setRequestHeader("systemversion", cc.sys.osVersion);
            }
            if (VVMgr.token) {
                req.setRequestHeader("token", VVMgr.token);
            }
            req.onreadystatechange = () => {
                // cc.log("---server status---", req.status);
                cc.log("---req readyState---", req.readyState);
                if (req.readyState == 4 && (req.status > 199 && req.status < 300)) {
                    cc.log("---req responseText---", req.responseText);
                    try {
                        const ret = JSON.parse(req.responseText);
                        const code = ret['code'];
                        if (code == 1) {
                            resolve(ret);
                        } else {
                            reject(ret);
                        }
                    } catch (e) {
                        const ret = {
                            code: -1,
                            msg: 'parse err'
                        }
                        reject(ret);
                    } finally {
                    }
                } /*else {
                    const ret = {
                        code: -2,
                        errmsg: 'server err'
                    }
                    reject(ret);  
                }*/
            }
            req.onerror = (ev: ErrorEvent) => {
                const ret = {
                    code: -3,
                    msg: 'unknown err'
                }
                reject(ret);
            }
            req.ontimeout = (ev: ProgressEvent) => {
                const ret = {
                    code: -4,
                    msg: 'ontimeout err'
                }
                reject(ret);
            }
            req.send(paramData);
        });
    }

    /**
     * 将对象转成 a=1&b=2的形式
     * @param obj 对象
     */
    static objParam2PostString(obj) {
        let paramStr = "";
        for (var k in obj) {
            paramStr += (k + "=" + obj[k]);
            paramStr += "&";
        }
        if (paramStr != "") {
            paramStr = paramStr.slice(0, paramStr.length - 1);
        }
        return paramStr;
    }

    static objParam2GetString(obj) {
        let paramStr = "?";
        for (var k in obj) {
            paramStr += (k + "=" + obj[k]);
            paramStr += "&";
        }
        if (paramStr != "") {
            paramStr = paramStr.slice(0, paramStr.length - 1);
        }
        return paramStr;
    }
}
