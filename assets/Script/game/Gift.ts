import Game from "./Game";
import HTTPMgr from "../core/HTTPMgr";
import { HTTPPath } from "../Const";
import { BirdGoodInfo, GoodInfo } from "./GameModel";
import VVMgr from "../core/VVMgr";
import { HintUIType } from "../HintUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameGift extends cc.Component {

    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    _giftData: Array<BirdGoodInfo> = null;

    requestInfo() {
        if (this._giftData) return;
        const param = {
            type: VVMgr.gameType,
            group: VVMgr.group
        }
        // this._gameTS.showLoading();
        HTTPMgr.get(HTTPPath.BIRDGOODS, param).then(info => {
            this.setupInfo(info["data"]);
            // this._gameTS.hideLoading();
        }).catch((err) => {
            Game.instance.showHintUI(HintUIType.Failure, err['msg']);
            cc.error("---err----" + err);
            // this._gameTS.hideLoading();
        });
    }
    
    setupInfo(data) {
        this._giftData = <Array<BirdGoodInfo>>data;;
        this._giftData.forEach((element, index) => {
            const item = cc.instantiate(this.itemPrefab);
            this.contentNode.addChild(item);
            item.y = -(item.height * (0.5 + index));
            const birdSp = Game.instance.getBirdNodeSprite(element.bird_id);
            item.getChildByName("bird").getChildByName("img").getComponent(cc.Sprite).spriteFrame = birdSp;

            const good1 = element.goods[0];
            if (good1 == null) {
                item.getChildByName("gift1").active = false;
                return;
            }
            const gift1 = item.getChildByName("gift1").getChildByName("img").getComponent(cc.Sprite);
            this.refreshGiftSprite(gift1, good1);

            const good2 = element.goods[1];
            if (good2 == null) {
                item.getChildByName("gift2").active = false;
                return;
            }
            const gift2 = item.getChildByName("gift2").getChildByName("img").getComponent(cc.Sprite);
            this.refreshGiftSprite(gift2, good2);
        });
        if (this._giftData.length > 0) {
            this.contentNode.height = this._giftData.length * this.contentNode.children[0].height;
        }
        // export interface BirdGoodInfo {
        //     name: string;
        //     number: string;
        //     bird_id: string;
        //     goods: GoodInfo[];
        // };
        
        // export interface GoodInfo {
        //     goods_id: string;
        //     pic: string;
        //     card_id: string;//代表礼品是装备卡 当type =card 才有这个字段 card_id = 1 倍率卡 card_id = 2 血量卡 card_id =3 独占卡
        //     card_num: number;
        //     bullet_id: string;//子弹的id 当 type = bullet 才有这个字段 1：金子弹 2：银子弹
        //     bullet_num: number;
        //     type: string; //card bullet  goods_id
        // };
    }

    refreshGiftSprite(sprite: cc.Sprite, goodInfo: GoodInfo) {
        if (goodInfo.type == "goods_id") {
            cc.loader.load({url: goodInfo.pic, type: 'png'}, (err, texture) => {
                if (err == null) {
                    const sp = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = sp;
                }
            });
        } else if (goodInfo.type == "card") {
            if (goodInfo.card_id == "1") {
                sprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("daoju_beika");
            } else if (goodInfo.card_id == "2") {
                sprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("daoju_xueka");
            } else if (goodInfo.card_id == "3") {
                sprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("daoju_zhanka");
            }
        } else if (goodInfo.type == "bullet") {
            if (goodInfo.bullet_id == "1") {
                sprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("sheji_jindan");
            } else if (goodInfo.bullet_id == "2") {
                sprite.spriteFrame = Game.instance.gameAtlas.getSpriteFrame("sheji_yindan");
            }
        }
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
