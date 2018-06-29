import VVMgr from "../core/VVMgr";
import { GiftGoodInfo } from "../hall/HallModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScore extends cc.Component {

    @property([cc.Node])
    splashNodeArr = new Array<cc.Node>();
    
    @property(cc.Sprite)
    giftSprite: cc.Sprite = null;
    @property(cc.Label)
    giftName: cc.Label = null;

    onEnable () {
        cc.info("---Score onEnable---");
        let count = 0;
        this.schedule(() => { 
            this.splashNodeArr.forEach((node) => {
                node.active = false;
            });
            for (let i = 0; i < 3; i++) {
                const index = VVMgr.randomIndex(6);
                this.splashNodeArr[index].active = true;
            }
            count++;
            if (count == 9) {
                this.onCloseClick();
            }
        }, 0.2, 9, 0.2);
    }

    showNode(giftMsg: GiftGoodInfo) {
        if (giftMsg.g_type == "bullet") {

        } else if (giftMsg.g_type == "card") {

        } else if (giftMsg.g_type == "goods_id") {
            const pic = giftMsg.goodsInfo["pic"];
            cc.loader.load({url: pic, type: 'png'}, (err, texture) => {
                // cc.log('length', arguments.length);
                if (err == null) {
                    const sp = new cc.SpriteFrame(texture);
                    this.giftSprite.spriteFrame = sp;
                }
            });
        }
        this.giftName.string = giftMsg.goods_name;
        
        this.node.active = true;
        this.node.opacity = 0;
        const fadeAnim = this.node.getComponent(cc.Animation);
        fadeAnim.play();
    }

    isShowing() {
        cc.log("GameScore isShowing --- ", this.node.active);
        return this.node.active;
    }

    onCloseClick() {
        this.node.active = false;
    }
}
