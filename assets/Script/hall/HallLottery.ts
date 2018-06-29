import VVMgr from "../core/VVMgr";
import Hall from "./Hall";
import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import { SignGift } from "./HallModel";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

// export enum RotateState {
//     None = 0,
//     Start,
//     Main,
//     End
// };

export enum AwardType {
    GoldBullet = 1,
    SilverBullet,
    BeiLKa,
    XueLKa,
    DuZKa,
}

@ccclass
export default class HallLottery extends cc.Component {

    @property(cc.Node)
    itemContentNode: cc.Node = null;
    @property([cc.Node])
    itemNodeArr = new Array<cc.Node>();

    _allowLottery = false;

    _signData = null;
    _signRet: SignGift = null;



    requestInfo() {
        if (this._signData) return;
        HTTPMgr.get(HTTPPath.SIGNITEM).then(info => {
            this.setupInfo(info["data"]);
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
        });
    }

    setupInfo(data) {
        this._signData = data;
        this._allowLottery = data["isSign"] == 0;

        const list = <Array<SignGift>>data["list"];
        this.itemNodeArr.forEach((element, index)=> {
            const info = list[index];
            const num = info.num;
            element.getChildByName("value").getComponent(cc.Label).string = num + "";
            const type = info.type;
            const iconSprite = element.getChildByName("icon").getComponent(cc.Sprite);
            this.refreshIconSprite(iconSprite, type);
        });
        // 0: {type: 1, num: 1, name: "金子弹"}
    }

    refreshIconSprite(sprite: cc.Sprite, type: number) {
        if (type == AwardType.GoldBullet) {
            sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("dating_jindan");
        } else if (type == AwardType.SilverBullet) {
            sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("dating_yindan");
        } else if (type == AwardType.BeiLKa) {
            sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("daoju_beika");
        } else if (type == AwardType.XueLKa) {
            sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("daoju_xueka");
        } else {
            sprite.spriteFrame = Hall.instance.hallAtlas.getSpriteFrame("daoju_zhanka");
        }
    }

    getGiftName(type: number) {
        let giftName = null; 
        if (type == AwardType.GoldBullet) {
            giftName = "金子弹";
        } else if (type == AwardType.SilverBullet) {
            giftName = "银子弹";
        } else if (type == AwardType.BeiLKa) {
            giftName = "倍率卡";
        } else if (type == AwardType.XueLKa) {
            giftName = "血量卡";
        } else {
            giftName = "独占卡";
        }
        return giftName;
    }

    showNode() {
        this.node.active = true;
        this.node.opacity = 100;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo();
    }

    onCloseClick() {
        this.node.active = false;
    }

    onActionClick() {
        if (!this._allowLottery) {
            this.signSucc();
            return;
        }
        // this._hallTS.showLoading();
        HTTPMgr.post(HTTPPath.SIGN).then((info) => {
            this.handleSignRet(info["data"]);
            // this._hallTS.hideLoading();
        }).catch((err) => {
            Hall.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
            // this._hallTS.hideLoading();
        });
    }

    handleSignRet(data) {
        // type	1:金子弹2:银子弹3:倍率卡4:血量卡5: 独占卡
        // num	赠送的数量
        const ret = <SignGift>data;
        this._signRet = ret;

        const list = <Array<SignGift>>this._signData["list"];
        const length = list.length;
        let info = null;
        let index = -1;
        for (let i = 0; i < length; i++) {
            info = list[i];
            if (info.type == ret.type && info.num == ret.num) {
                index = i;
                break;
            }
        }
        cc.warn("---handleSignRet---", index);
        if (index == -1) return;
        const angle = -720 - index*36;
        const rotateAction = cc.rotateBy(2, angle).easing(cc.easeSineOut());
        // rotateAction.easing(cc.easeBackInOut());
        const callFunc = cc.callFunc(this.rotateAnimComplete, this);
        const sequence = cc.sequence(rotateAction, callFunc);
        this.itemContentNode.runAction(sequence);
    }

    rotateAnimComplete() {
        this.scheduleOnce(() => {
            this.signSucc();
        }, 1);
    }

    signSucc() {
        this.node.active = false;
        let word = null;
        if (this._signRet) {
            word = "恭喜你，获得了" + this.getGiftName(this._signRet.type) + "X" + this._signRet.num;
            Hall.instance.showHintUI(HintUIType.Success, word);
        } else {
            word = "今天已经抽奖了!!!";
            Hall.instance.showHintUI(HintUIType.Failure, word);
        }
    }
}
