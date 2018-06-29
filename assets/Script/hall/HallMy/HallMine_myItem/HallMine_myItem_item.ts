import { CardInfo } from "../../HallModel";
import HallMine_myItem from "./HallMine_myItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_myItem_item extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    cardIcon: cc.Node = null;

    @property(cc.SpriteFrame)
    beilv_sp: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    xueliang_sp: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    duzhan_sp: cc.SpriteFrame = null;

    _itemJs: HallMine_myItem = null;
    _cardId: number = null;


    onClickBuy() {
        if (this._itemJs) {
            this._itemJs.showCharge(this._cardId);
        }
    }

    setData(itemJs: HallMine_myItem, data: CardInfo) {
        this._itemJs = itemJs;
        this._cardId = data.card_id;
        let itemSp = this.cardIcon.getComponent(cc.Sprite)

        if (data.card_id == 1) {
            this.nameLab.string = "倍率卡 x " + data.total;
            itemSp.spriteFrame = this.beilv_sp;
        } else if (data.card_id == 2) {
            this.nameLab.string = "血量卡 x " + data.total;
            itemSp.spriteFrame = this.xueliang_sp;
        } else if (data.card_id == 3) {
            this.nameLab.string = "独占卡 x " + data.total;
            itemSp.spriteFrame = this.duzhan_sp;
        }

        this.moneyLab.string = data.price + "元/张";
        this.descLab.string = data.desc;

    }

    onDestroy() {
        this._itemJs = null;
        this._cardId = null;
    }
}
