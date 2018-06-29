import { GiftMsgInfo } from "../hall/HallModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMsgCtr extends cc.Component {

    @property(cc.Node)
    noticeNode: cc.Node = null;
    @property(cc.Node)
    hintNode: cc.Node = null;

    _noticeText: cc.RichText = null;
    _noticeMsgArr = new Array<GiftMsgInfo>();
    _noticeUpdating = false;

    _hintText: cc.RichText = null;
    _hintMsgArr = new Array();
    _hintAnim: cc.Animation = null;

    onLoad () {
        this._noticeText = this.noticeNode.getComponent(cc.RichText);
        this._hintText = this.hintNode.getComponent(cc.RichText);
        this._hintAnim = this.hintNode.getComponent(cc.Animation);
        this._hintAnim.on('finished', this.hintAnimComplete, this);
    }

    receiveCommonMsg(callMsg) {
        const data = <GiftMsgInfo>callMsg;
        // if (data.message_type != "winning") return;

        this._noticeMsgArr.push(data);
        if (this._noticeUpdating) return;

        this._noticeUpdating = true;
        this.noticeNode.parent.active = true;
        this.refreshNotictText(data);
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

    // <color=#ff0000>妈妈</c><outline color=red width=3>再也</outline><size=20>不用担心</size>
    // 我在 <size=56><color=#00ff00>Creator</c></s> 里面
    // 使用<color=#ff0000>五</c><color=#00ff00>彩</c><color=#00e0ff>缤</c><color=#ffff00>纷</>，
    // <size=20>大小</s><size=60>不一</s>
    // 的<size=33><outline color=#00ff00 width=3>文字</o></s>了

    receiveUserIn(callMsg) {
        this.hintNode.active = true;
        this._hintMsgArr.push(callMsg);
        if (this._hintMsgArr.length < 2) {
            this.playHintAnim();
        } 
        

        const nickname = callMsg["nickname"];
        this._hintText.string = "玩家" + "<color=#D5C63C>" + nickname +"</c>" + "进入了游戏";
    }

    // receiveUserExit(callMsg) {
    //     this.hintNode.active = true;
    //     const nickname = callMsg["nickname"];
    //     this._hintText.string = "玩家" + "<color=#D5C63C>" + nickname +"</c>" + "离开了游戏";
    // }

    playHintAnim() {
        const callMsg = this._hintMsgArr[0];
        const nickname = callMsg["nickname"];
        this._hintText.string = "玩家" + "<color=#D5C63C>" + nickname +"</c>" + "进入了游戏";
        this._hintAnim.play();
    }

    hintAnimComplete() {
        this._hintMsgArr.shift();
        if (this._hintMsgArr.length > 0) {
            this.playHintAnim();
        }
    }
}
