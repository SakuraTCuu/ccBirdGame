import { callServerInfo } from "../../HallModel";
import HallMine_callServer from "./HallMine_callServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_callServer_item extends cc.Component {

    @property(cc.Node)
    wechat_icon: cc.Node = null;

    @property(cc.Node)
    qq_icon: cc.Node = null;

    @property(cc.Node)
    phone_icon: cc.Node = null;

    @property(cc.Node)
    call_btn: cc.Node = null;

    @property(cc.Node)
    copy_btn: cc.Node = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Label)
    phoneLab: cc.Label = null;

    _callServerJs: HallMine_callServer = null;
    _type: number = null;

    setData(callServerJs: HallMine_callServer, data: callServerInfo) {
        this._callServerJs = callServerJs;
        this._type = data.type;
        if (data.type == 1) { //电话
            this.typeLab.string = "客服电话"
            this.phone_icon.active = true;
            this.qq_icon.active = false;
            this.wechat_icon.active = false;
            this.call_btn.active = true;
            this.copy_btn.active = false;
        } else if (data.type == 2) { //qq
            this.typeLab.string = "客服qq"
            this.phone_icon.active = false;
            this.qq_icon.active = true;
            this.wechat_icon.active = false;
            this.call_btn.active = false;
            this.copy_btn.active = true;
        } else if (data.type == 3) {  //wechat
            this.typeLab.string = "客服微信"
            this.phone_icon.active = false;
            this.qq_icon.active = false;
            this.wechat_icon.active = true;
            this.call_btn.active = false;
            this.copy_btn.active = true;
        }
        this.phoneLab.string = data.Contact;
    }

    //复制按钮
    onClickCopy() {
        if (this._callServerJs) {
            this._callServerJs.callNativeInterface(this._type);
        }
    }

    //拨打电话
    onClickCall() {
        if (this._callServerJs) {
            this._callServerJs.callNativeInterface(this._type);
        }
    }

    onDestroy() {
        this._callServerJs = null;
        this._type = null;
    }
}
