import { RechargeInfo } from "../../HallModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_recharge_item extends cc.Component {

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Label)
    moneyLab: cc.Label = null;

    setData(data: RechargeInfo) {
        this.moneyLab.string = "￥" + data.amount;
        this.timeLab.string = data.create_date;
        if (data.r_type == 1) {
            if (data.bullet_type && data.bullet_type == 1) {
                this.typeLab.string = "充值金弹";
            } else {
                this.typeLab.string = "充值银弹";
            }
        } else {
            if (data.card_id && data.card_id == 1) {
                this.typeLab.string = "充值倍率卡";
            } else if (data.card_id && data.card_id == 2) {
                this.typeLab.string = "充值血量卡";
            } else if (data.card_id && data.card_id == 3) {
                this.typeLab.string = "充值独占卡";
            }
        }
    }


    onDestroy() {

    }
}
