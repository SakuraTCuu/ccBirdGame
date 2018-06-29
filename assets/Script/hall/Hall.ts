import VVMgr from "../core/VVMgr";
import { WebCmd, NotifyPath } from "../Const";
import Loading from "../Loading";
import { GiftMsgInfo } from "./HallModel";
import NetMgr from "../core/NetMgr";
import HallUICtr from "./HallUICtr";
import HintUI, { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hall extends cc.Component {

    @property(cc.SpriteAtlas)
    hallAtlas: cc.SpriteAtlas = null;
    
    @property(cc.Sprite)
    avatarSprite: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    idLabel: cc.Label = null;
    @property(cc.Label)
    silverNumLabel: cc.Label = null;
    @property(cc.Label)
    goldNumLabel: cc.Label = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;
    @property(cc.Node)
    hintUINode: cc.Node = null; 

    @property(cc.Node)
    noticeNode: cc.Node = null;

    _noticeText: cc.RichText = null;
    _noticeMsgArr = new Array<GiftMsgInfo>();
    _noticeUpdating = false;

    private static _instance: Hall = null;
    public static get instance(): Hall {
        return Hall._instance;
    }

    onLoad () {
        Hall._instance = this;

        this.setupUserInfo();

        //连接websocket
        NetMgr._connect();

        cc.log("Hall onLoad");

        NetMgr._onEvent(WebCmd.CMD_GAME_MESSAGE, this.callbackUserMsg.bind(this));
        this._noticeText = this.noticeNode.getComponent(cc.RichText);

        this.node.on(NotifyPath.NameUpdate, (data) => {
            this.refreshUserName(data.detail);
        });
        this.node.on(NotifyPath.AvatarUpdate, (data) => {
            this.refreshUserAvatar(data.detail);
        });
        this.node.on(NotifyPath.SocketDisconnect, () => {
            this.socketDisconnect();
        });
        this.node.on(NotifyPath.ShareResult, (data) => {
            this.shareResult(data.detail);
        });
        this.node.on(NotifyPath.ShareResult, (data) => {
            this.chargeResult(data.detail);
        });
    }

    start () {
        VVMgr.dataEventHandler = this.node;
    }

    onDestroy () {
        // NetMgr._offEvent(WebCmd.CMD_GAME_USERBINGO);
        NetMgr._offEvent(WebCmd.CMD_GAME_MESSAGE);
        cc.info("Hall onDestroy");

        VVMgr.dataEventHandler = null;
    } 

    callbackUserMsg(callMsg) {
        // debugger;
        const data = <GiftMsgInfo>callMsg['data'];
        // if (data.message_type != "winning") return;

        this._noticeMsgArr.push(data);
        if (this._noticeUpdating) return;

        this._noticeUpdating = true;
        this.noticeNode.parent.active = true;
        this.refreshNotictText(data);
        // cc.log("   callbackUserMsg   ", callMsg);
    }

    update (dt: number) {
        if (this._noticeUpdating == false) return;

        let x = this.noticeNode.x;
        x -= dt*100;
        if (x + this.noticeNode.width < -450) { //x初始位置是-300
            x = 450;
            this._noticeMsgArr.shift();
            // cc.log("this._noticeMsgArr.length --- ", this._noticeMsgArr.length);
            if (this._noticeMsgArr.length < 1) {
                this._noticeUpdating = false;
                this.noticeNode.parent.active = false;
            } else {
                const giftMsg = this._noticeMsgArr[0];
                this.refreshNotictText(giftMsg);
            }
        }
        this.noticeNode.x = x;
    }

    refreshNotictText(giftMsg: GiftMsgInfo) {
        if (giftMsg.message_type == "winning") {
            this._noticeText.string = "<color=#D5C63C>"+giftMsg.nickname+"</c>"+"获得了"+"<color=#D5C63C>"+giftMsg.goods_name+"</c>";
        } else {
            this._noticeText.string = "<color=#D5C63C>"+giftMsg.message+"</c>";
        } 
    }

    setupUserInfo() {
        cc.log("---setupUserInfo---");
        const userInfo = VVMgr.userInfo;
        if (userInfo.pic) { //头像
            cc.loader.load({url: userInfo.pic, type: 'png'}, (err, texture) => {
                // cc.log('length', arguments.length);
                if (err == null) {
                    const sp = new cc.SpriteFrame(texture);
                    this.avatarSprite.spriteFrame = sp;
                }
            });
        }
        this.nameLabel.string = userInfo.nickname;
        this.idLabel.string = "ID:" + userInfo.show_user_id;
        this.silverNumLabel.string = userInfo.silver + "";
        this.goldNumLabel.string = userInfo.gold + "";

        VVMgr.sdkMgr.notifyNativeName(userInfo.nickname);
    }

    refreshUserName(name: string) {
        VVMgr.userInfo.nickname = name;
        this.nameLabel.string = VVMgr.userInfo.nickname;
    }

    refreshUserAvatar(avatar: string) {
        VVMgr.userInfo.pic = avatar;
        if (avatar) { //头像
            cc.loader.load({url: avatar, type: 'png'}, (err, texture) => {
                // cc.log('length', arguments.length);
                if (err == null) {
                    const sp = new cc.SpriteFrame(texture);
                    this.avatarSprite.spriteFrame = sp;
                }
            });
        }
    }   

    socketDisconnect() {
        this.node.getComponent(HallUICtr).onSocketFailure();
    }

    shareResult(ret: string) {
        const suc = parseInt(ret);
        if (suc == 1) {
            this.showHintUI(HintUIType.Success, "分享成功!!!");
        } else {
            this.showHintUI(HintUIType.Failure, "分享失败!!!");
        }
    }

    chargeResult(ret: number) {
        if (ret == -1) {
            this.showHintUI(HintUIType.Failure, "支付失败!!!");
        } else {
            this.showHintUI(HintUIType.Success, "支付成功!!!");
            this.setupUserInfo();
        }
    }

    showLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        if (loadingJS.isShowing()) return false;
        loadingJS.show();
        return true;
    }

    hideLoading() {
        const loadingJS = this.loadingNode.getComponent(Loading);
        loadingJS.hide();
    }

    showHintUI(hintUIType: HintUIType, msg?: string) {
        const failureJS = this.hintUINode.getComponent(HintUI);
        if (failureJS.isShowing()) return false;
        failureJS.show(hintUIType, msg);
        return true;
    }
}
