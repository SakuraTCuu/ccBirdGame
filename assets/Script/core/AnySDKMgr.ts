import VVMgr from "./VVMgr";
import { NotifyPath, LoginType, ChargeType } from "../Const";
import { ShareType } from "../hall/HallShare";

export default class AnySDKMgr {

    ANDROID_API = "com/birdgame/CocosBridgeAPI";
    IOS_API = "CocosBridgeAPI";

    constructor() {
        window['notifyJSName'] = this.notifyJSName.bind(this);
        window['notifyJSAvatarURL'] = this.notifyJSAvatarURL.bind(this);
        window['notifyJSUserIDToken'] = this.notifyJSUserIDToken.bind(this);
        window['notifyJSChargeResult'] = this.notifyJSChargeResult.bind(this);
        window['notifyJSShareResult'] = this.notifyJSShareResult.bind(this);
    }

    /**
     * 通知native 存储用户Token
     * @param token 用户Token
     */
    notifyNativeToken(token: string) {
        cc.info('notifyNativeToken ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "NotifyNativeToken", "(Ljava/lang/String)V", token);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "notifyNativeToken:", token);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement notifyNativeToken");
        }
    }

    /**
     * 通知native 存储用户姓名
     * @param name 用户姓名
     */
    notifyNativeName(name: string) {
        cc.info('notifyNativeName ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "NotifyNativeName", "(Ljava/lang/String)V", name);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "notifyNativeName:", name);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement notifyNativeName");
        }
    }
    
    /**
     * 通知native 显示原生UI
     * @param type UIType 0 - Info 1 - My 2 - Show
     */
    showNativeUI(type) {
        cc.info('showNativeUI ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShowNativeUI", "(II)V", type);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "showNativeUI:", type);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement showNativeUI");
        }
    }

    /**
     * 通知native 去分享
     * @param type LoginType 1 - Mobile     2 - QQ      3 - WX
     */
    notifyNativeLogin(type: LoginType) {
        cc.info('notifyNativeShare ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "NotifyNativeLogin", "(II)V", type);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "notifyNativeLogin:", type);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement notifyNativeLogin");
        }
    }

    /**
     * 通知native 显示充值UI
     * @param type 
     */
    showChargeUI(type: ChargeType) {
        cc.info('showChargeUI ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShowChargeUI", "(II)V", type);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "showChargeUI:", type);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement showChargeUI");
        }
    }

    /**
     * 通知native 去分享
     * @param type ShareType 0 - QQ     1 - WX      2 - PYQ
     */
    notifyNativeShare(type: ShareType) {
        cc.info('notifyNativeShare ---');
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "NotifyNativeShare", "(II)V", type);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "notifyNativeShare:", type);
        } else {
            cc.warn(cc.sys.os + "   dosn't implement notifyNativeShare");
        }
    }

    notifyJSName(name: string) {
        cc.info('notifyJSName ---', name);
        // VVMgr.userInfo.nickname = name;
        VVMgr.dispatchEvent(NotifyPath.NameUpdate, name);
    }

    notifyJSAvatarURL(url: string) {
        cc.info('notifyJSAvatarURL ---', url);
        // VVMgr.userInfo.pic = url;
        VVMgr.dispatchEvent(NotifyPath.AvatarUpdate, url);
    }

    notifyJSUserIDToken(token: string, userId: string) {
        cc.info('notifyJSUserIDToken ---' + token + "---" + userId);
        let data = {};
        if (token != "" && userId != "") {
            data['token'] = token;
            data['user_id'] = userId;
        }
        VVMgr.dispatchEvent(NotifyPath.ThirdLogin, data);
    }

    notifyJSChargeResult(result: string) {
        cc.info('notifyJSChargeResult ---' + result);
        try {
            result = JSON.parse(result);
            const type = parseInt(result['type']);
            if (type == ChargeType.Bullet) {
                VVMgr.userInfo.gold = parseInt[result['num']];
            }
            VVMgr.dispatchEvent(NotifyPath.ChargeResult, type);
        } catch (e) {
            cc.error("notifyJSChargeResult --- ", e);
        }        
    }

    notifyJSShareResult(result: string) {
        cc.info('notifyJSShareResult ---' + result);
        VVMgr.dispatchEvent(NotifyPath.ShareResult, result);
    }
}
