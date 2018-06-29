import Game from "./Game";
import { PropCardInfo } from "./GameModel";
import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath, PropType, ChargeType } from "../Const";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameProp extends cc.Component {

    @property(cc.Label)
    beiLLabel: cc.Label = null;
    @property(cc.Label)
    xuLLabel: cc.Label = null;
    @property(cc.Label)
    duZLabel: cc.Label = null;

    _giftData: Array<PropCardInfo> = null;

    onPropUse(touch: cc.Event.EventTouch, eventData) {
        const type = parseInt(eventData);
        this.node.active = false;
        if (type == PropType.BeiLKa) {
            const cardInfo = this._giftData[0];
            if (cardInfo.total > 0) {
                cardInfo.total--;
                Game.instance.willUseBeiLka(cardInfo);
            } else {
                Game.instance.toCharge(ChargeType.Prop);
            }
        } else if (type == PropType.XueLKa) {
            const cardInfo = this._giftData[1];
            if (cardInfo.total > 0) {
                cardInfo.total--;
                Game.instance.willUseXuLka(cardInfo);
            } else {
                Game.instance.toCharge(ChargeType.Prop);
            }
        } else if (type == PropType.DuZKa) {
            const cardInfo = this._giftData[2];
            if (cardInfo.total > 0) {
                cardInfo.total--;
                Game.instance.willUserDuZka(cardInfo);
            } else {
                Game.instance.toCharge(ChargeType.Prop);
            }
        }
        this.setupInfo();
        this.onCloseClick();
    }

    requestInfo() {
        // if (this._giftData) return;
        // this._gameTS.showLoading();
        HTTPMgr.get(HTTPPath.USERCARD,).then(info => {
            this.setupInfo(info["data"]);
            // this._gameTS.hideLoading();
        }).catch((err) => {
            Game.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
            // this._gameTS.hideLoading();
        });
    }
    
    setupInfo(data?) {
        if (data) this._giftData = <Array<PropCardInfo>>data;

        this.beiLLabel.string = "倍率卡 X" + this._giftData[0].total;
        this.xuLLabel.string = "血量卡 X" + this._giftData[1].total;
        this.duZLabel.string = "独占卡 X" + this._giftData[2].total;
    }

    showNode() {
        this.node.active = true;
        this.node.opacity = 0;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();

        this.requestInfo();
    }

    onCloseClick() {
        this.node.active = false;
    }
}
