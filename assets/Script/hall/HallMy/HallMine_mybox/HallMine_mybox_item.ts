import { UserGoodsInfo } from "../../HallModel";
import HallMine_mybox from "./HallMine_mybox";

const { ccclass, property } = cc._decorator;


enum goodsType {
    bullet = "bullet",
    card = "card",
    goods_id = "goods_id",
}

@ccclass
export default class HallMine_mybox_item extends cc.Component {

    @property(cc.Label)
    time_lab: cc.Label = null;

    @property(cc.Label)
    value_lab: cc.Label = null;

    @property(cc.Label)
    goods_gold_lab: cc.Label = null;

    @property(cc.Label)
    virtual_goods_silver_lab: cc.Label = null;

    @property(cc.Label)
    true_goods_silver_lab: cc.Label = null;

    @property(cc.Node)
    true_goods: cc.Node = null;

    @property(cc.Node)
    virtual_goods: cc.Node = null;

    @property(cc.Node)
    true_goods_logistics_normal: cc.Node = null;

    @property(cc.Node)
    true_goods_logistics_select: cc.Node = null;

    @property(cc.Node)
    true_goods_pickup_normal: cc.Node = null;

    @property(cc.Node)
    true_goods_pickup_select: cc.Node = null;

    @property(cc.Node)
    camera_normal: cc.Node = null;

    @property(cc.Node)
    camera_select: cc.Node = null;

    @property(cc.Node)  //物品头像
    avatarNode: cc.Node = null;


    @property(cc.SpriteFrame)  //倍率卡
    beilvka: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)  //独占卡
    duzhanka: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)  //血量卡
    xueliangka: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)  //金弹头
    gold_icon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)  //银弹头
    silver_icon: cc.SpriteFrame = null;

    _data: UserGoodsInfo = null;   // 用户信息

    _myboxJs: HallMine_mybox = null; //脚本

    onLoad() {
        this.true_goods_logistics_select.on(cc.Node.EventType.TOUCH_END, this.logisticsClick, this);
        this.true_goods_pickup_select.on(cc.Node.EventType.TOUCH_END, this.pickupClick, this);
        this.camera_select.on(cc.Node.EventType.TOUCH_END, this.cameraClick, this);
    }

    //物流  展示物流状态
    logisticsClick() {
        if (this._myboxJs) {
            this._myboxJs.showLogisticsUi(this._data);
        }
    }

    //提货  展示提货地址
    pickupClick() {
        if (this._myboxJs) {
            this._myboxJs.showSelectAddressUi(this._data);
        }
    }

    //晒宝
    cameraClick() {
        if (this._myboxJs) {
            this._myboxJs.showcameraCtr();
        }
    }

    setData(myboxJs: HallMine_mybox, data: UserGoodsInfo) {
        this._myboxJs = myboxJs;
        let self = this;
        this._data = data;
        if (data.g_type == goodsType.goods_id) {   //实物
            this.true_goods.active = true;
            this.virtual_goods.active = false;
            //实物市场价值
            if (data.goodsInfo.p_price) {
                this.value_lab.string = "市场价值:" + data.goodsInfo.p_price + "元";
            }
            //消耗的金弹银弹数
            this.true_goods_silver_lab.string = "消耗x" + data.use_silver;
            this.goods_gold_lab.string = "消耗x" + data.use_gold;

            if (data.status == 1) {  //拍中  可以进行提货
                this.true_goods_logistics_normal.active = true;
                this.true_goods_logistics_select.active = false;
                this.true_goods_pickup_normal.active = false;
                this.true_goods_pickup_select.active = true;
            } else if (data.status == 2) { //已申请提货 但还未发货
                this.true_goods_logistics_normal.active = true;
                this.true_goods_logistics_select.active = false;
                this.true_goods_pickup_normal.active = true;
                this.true_goods_pickup_select.active = false;
            } else if (data.status == 3) {//已发货
                this.true_goods_logistics_normal.active = false;
                this.true_goods_logistics_select.active = true;
                this.true_goods_pickup_normal.active = true;
                this.true_goods_pickup_select.active = false;
            } else if (data.status == 4) {//已收货
                this.true_goods_logistics_normal.active = true;
                this.true_goods_logistics_select.active = false;
                this.true_goods_pickup_normal.active = true;
                this.true_goods_pickup_select.active = false;
            }

            let avatarUlr = data.goodsInfo.pic;
            //实物头像远程加载
            cc.loader.load(avatarUlr, function (err, texture) {
                // Use texture to create sprite frame
                self.avatarNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });

        } else {  //虚拟物品
            this.true_goods.active = false;
            this.virtual_goods.active = true;

            //虚拟物品没有价值
            this.value_lab.string = "";

            //消耗的金弹银弹数
            this.virtual_goods_silver_lab.string = "消耗x" + data.use_silver;
            this.goods_gold_lab.string = "消耗x" + data.use_gold;
            if (data.g_type == goodsType.bullet) {
                if (data.goods_id == 1) { //金弹
                    this.avatarNode.getComponent(cc.Sprite).spriteFrame = this.gold_icon;
                } else { //银弹
                    this.avatarNode.getComponent(cc.Sprite).spriteFrame = this.silver_icon;
                }
            } else if (data.g_type == goodsType.card) {
                if (data.goods_id == 1) { //倍率卡
                    this.avatarNode.getComponent(cc.Sprite).spriteFrame = this.beilvka;
                } else if (data.goods_id == 2) { //血量卡
                    this.avatarNode.getComponent(cc.Sprite).spriteFrame = this.xueliangka;
                } else if (data.goods_id == 3) { //独占卡
                    this.avatarNode.getComponent(cc.Sprite).spriteFrame = this.duzhanka;
                }
            }
        }

        //时间
        this.time_lab.string = data.create_date;

        //是否晒宝
        if (data.isSubmit == 1) {
            this.camera_normal.active = true;
            this.camera_select.active = false;
        } else {
            this.camera_normal.active = false;
            this.camera_select.active = true;
        }
    }

    
    onDestroy() {
        this._data = null;
        this._myboxJs = null;
    }
}
