import { ShowGiftInfo } from "../../HallModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallMine_showGift_item extends cc.Component {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    contentLab: cc.Label = null;

    @property(cc.Sprite)
    showPic1: cc.Sprite = null;

    @property(cc.Sprite)
    showPic2: cc.Sprite = null;

    @property(cc.Sprite)
    showPic3: cc.Sprite = null;

    setData(data: ShowGiftInfo) {
        let self = this;
        this.titleLab.string = data.goodsName;
        this.timeLab.string = data.create_date;
        this.contentLab.string = data.content;
        //图片最多三张
        let picList = data.pic;
        if (picList[0]) {
            cc.loader.load(picList[0], function (err, texture) {
                // Use texture to create sprite frame
                self.showPic1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }

        if (picList[1]) {
            cc.loader.load(picList[0], function (err, texture) {
                // Use texture to create sprite frame
                self.showPic2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }

        if (picList[2]) {
            cc.loader.load(picList[0], function (err, texture) {
                // Use texture to create sprite frame
                self.showPic3.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    
    onDestroy(){

    }
}
