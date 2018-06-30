import NodeRemoveUtil from "./NodeRemoveUtil";
import { Map } from "../utils/Map";

export class EffectPool {

    private static effectPool = new EffectPool();

    /**飞金币用到的金币 */
    private goldIcon = new Array<cc.Node>();

    /**爆金币特效 */
    private bormGold = new Array<cc.Node>();

    /**道具或金币飞入炮台时的光圈效果 */
    private addcoinEf = new Array<cc.Node>();

    // /**
    //  * 打死鱼旁边的数字特效
    //  */
    // private numberEfNode = new Array<cc.Node>();

    // /**
    //  * 玩家金币旁边的数据特效
    //  */
    // private numberEf2Node = new Array<cc.Node>();

    /**竞技赛飞积分 */
    private scores = new Array<cc.Node>();

    /** 字体缓存 */
    private fontPool: Map = new Map();

    private constructor() { }

    /**取得特效缓存池 */
    public static getEffectPool() {
        return EffectPool.effectPool;
    }

    /**
     * 取出金币特效
     */
    public getGoldIcon() {
        let gold = this.goldIcon.pop();
        if (!gold) {
            return this.newGoldIcon();
        }
        return gold;
    }

    /**
     * 放回金币特效
     */
    public pushGoldIcon(gold: cc.Node) {
        gold.removeFromParent();
        gold.stopAllActions();
        this.goldIcon.push(gold);
    }

    /**创建金币特效 */
    private newGoldIcon(): cc.Node {
        let data: cc.SpriteAtlas = cc.loader.getRes("effect/icon/iconEffect", cc.SpriteAtlas);
        let spriteFrames = data.getSpriteFrames();
        let goldIcon = new cc.Node("goldIcon");
        goldIcon.addComponent<cc.Sprite>(cc.Sprite);
        let animation = goldIcon.addComponent<cc.Animation>(cc.Animation);
        let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 15);
        clip.name = "goldIconClip";
        clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(clip);
        return goldIcon;
    }

    /**取得爆金币特效 */
    public getBormGold() {
        let bormGold = this.bormGold.pop();
        if (!bormGold) {
            return this.newBormGold();
        }
        // bormGold.active = true;
        return bormGold;
    }

    /**将爆金币特效放入缓存 */
    public pushBormGold(bormGold: cc.Node) {
        bormGold.removeFromParent();
        bormGold.stopAllActions();
        bormGold.opacity = 255;
        bormGold.scale = 1;
        bormGold.rotation = 0;
        this.bormGold.push(bormGold);
    }

    /**新建爆金币特效 */
    private newBormGold() {
        let atlas = cc.loader.getRes(`effect/ef_baojinbi/ef_baojinbi`, cc.SpriteAtlas);
        let goldIcon = new cc.Node("goldIcon");
        goldIcon.addComponent<cc.Sprite>(cc.Sprite);
        let animation = goldIcon.addComponent<cc.Animation>(cc.Animation);
        let spriteFrames = atlas.getSpriteFrames();
        let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 14);
        clip.name = "goldAnimation";
        animation.addClip(clip);
        animation.defaultClip = clip;

        let baojinbiBg = new cc.Node("baojinbiBg");
        baojinbiBg.scale = 0;
        let sprite = baojinbiBg.addComponent<cc.Sprite>(cc.Sprite);
        let bg = cc.loader.getRes(`effect/ef_baojinbi/baojinbiBg`, cc.SpriteFrame);
        sprite.spriteFrame = bg;

        baojinbiBg.addChild(goldIcon);
        return baojinbiBg;

    }

    /**取出道具或金币飞入炮台的光圈效果 */
    public getAddcoinEf(): cc.Node {
        let addcoinEf = this.addcoinEf.pop();
        if (!addcoinEf) {
            return this.newAddcoinEf();
        }
        // addcoinEf.active = true;
        return addcoinEf;
    }

    /**放回道具或金币飞入炮台的光圈效果*/
    public pushAddcoinEf(addcoinEf: cc.Node) {
        // addcoinEf.active = false;
        addcoinEf.removeFromParent();
        addcoinEf.stopAllActions();
        addcoinEf.opacity = 255;
        addcoinEf.scale = 0.2;
        addcoinEf.rotation = 0;
        this.addcoinEf.push(addcoinEf);
    }

    /**新建道具或金币飞入炮台的光圈效果 */
    private newAddcoinEf() {
        let txtr = cc.loader.getRes(`effect/ef_addcoin/ef_addcoin`, cc.SpriteFrame);
        let effct = new cc.Node("effct");
        effct.addComponent<cc.Sprite>(cc.Sprite).spriteFrame = txtr;
        effct.scale = 0.2;
        return effct;
    }



    // /**鱼旁边的数据特效 */
    // public getAddNumberEf(): cc.Node {
    //     return this.numberEfNode.pop();
    // }

    // /**鱼旁边的数据特*/
    // public pushAddNumberEf(efNode: cc.Node) {
    //     if (this.numberEfNode.length > 6) {
    //         NodeRemoveUtil.addNode(efNode);
    //         return;
    //     }
    //     efNode.active = false;
    //     efNode.stopAllActions();
    //     this.numberEfNode.push(efNode);
    // }

    // /**金币旁边的数据特效 */
    // public getAddNumberEf2(): cc.Node {
    //     return this.numberEf2Node.pop();
    // }

    // /**金币旁边的数据特*/
    // public pushAddNumberEf2(efNode: cc.Node) {
    //     if (this.numberEf2Node.length > 2) {
    //         NodeRemoveUtil.addNode(efNode);
    //         return;
    //     }
    //     efNode.active = false;
    //     efNode.stopAllActions();
    //     this.numberEf2Node.push(efNode);
    // }


    /**取得积分特效 */
    public getScores() {
        let score = this.scores.pop();
        if (!score) {
            return this.newScore();
        }
        score.active = true;
        return score;
    }

    /**放回积分特效 */
    public pushScores(score: cc.Node) {
        // score.active = false;
        score.removeFromParent();
        score.stopAllActions();
        this.goldIcon.push(score);
    }

    /**创建一个积分 */
    private newScore() {
        let data: cc.SpriteAtlas = cc.loader.getRes("effect/ef_score/ef_score", cc.SpriteAtlas);
        let spriteFrames = data.getSpriteFrames();
        let goldIcon = new cc.Node("score");
        goldIcon.addComponent<cc.Sprite>(cc.Sprite);
        let animation = goldIcon.addComponent<cc.Animation>(cc.Animation);
        let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 15);
        clip.name = "scoreClip";
        clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(clip);
        return goldIcon;
    }

    /**
     * 获取字体节点
     * @param fontName 字体名称
     */
    public getFontNode(fontName: string, txt:string): cc.Node {
        let fontNode = new cc.Node(fontName);
        fontNode.width = 800;
        fontNode.height = 100;
        let numL = fontNode.addComponent(cc.Label) as cc.Label;
        numL.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        numL.verticalAlign = cc.Label.VerticalAlign.CENTER;
        numL.overflow = cc.Label.Overflow.CLAMP;
        numL.fontSize = 32;
        numL.enableWrapText = false;
        let font = cc.loader.getRes("font/" + fontName, cc.Font);
        numL.font = font;
        numL.string = txt;
        return fontNode;
        // let fontNodeArr = this.fontPool.get(fontName) as Array<cc.Node>;
        // if (!fontNodeArr) {
        //     let fontNode = new cc.Node(fontName);
        //     fontNode.width = 800;
        //     fontNode.height = 100;
        //     let numL = fontNode.addComponent(cc.Label) as cc.Label;
        //     numL.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        //     numL.verticalAlign = cc.Label.VerticalAlign.CENTER;
        //     numL.overflow = cc.Label.Overflow.CLAMP;
        //     numL.fontSize = 32;
        //     numL.enableWrapText = false;
        //     let font = cc.loader.getRes("font/" + fontName, cc.Font);
        //     numL.font = font;
        //     numL.string = txt;
        //     return fontNode;
        // } else {
        //     let fontNode = fontNodeArr.pop();
        //     let numL = fontNode.getComponent(cc.Label) as cc.Label;
        //     numL.string = txt;
        //     return fontNode;
        // }
    }

    /**
     * 节点加入缓存
     * @param fontNode  节点名称就是字体名称
     * 
     */
    public returnFontNode(fontNode: cc.Node): void {
        fontNode.removeFromParent(true);
        fontNode.stopAllActions();
        fontNode.destroy();
        // let fontName = fontNode.name;
        // let fontNodeArr = this.fontPool.get(fontName) as Array<cc.Node>;
        // if (!fontNodeArr || fontNodeArr.length >= 5) {
        // }else {
        //     fontNode.removeFromParent();
        //     fontNode.opacity = 255;
        //     fontNode.x = 0;
        //     fontNode.y = 0;
        //     fontNode.anchorX = fontNode.anchorY = 0.5;
        //     fontNode.scale = 1;
        //     fontNodeArr.push(fontNode);
        // }
    }

    /**清空特效对象池 */
    public clean() {
        NodeRemoveUtil.removeNodeArray(this.addcoinEf);
        NodeRemoveUtil.removeNodeArray(this.bormGold);
        NodeRemoveUtil.removeNodeArray(this.goldIcon);
        // NodeRemoveUtil.removeNodeArray(this.numberEfNode);
        // NodeRemoveUtil.removeNodeArray(this.numberEf2Node);
        NodeRemoveUtil.removeNodeArray(this.scores);

        this.addcoinEf.length = 0;
        this.bormGold.length = 0;
        this.goldIcon.length = 0;
        // this.numberEfNode.length = 0;
        // this.numberEf2Node.length = 0;
        this.scores.length = 0;
        this.fontPool.clear();
        // this.addcoinEf = new Array();
        // this.bormGold = new Array();
        // this.goldIcon = new Array();
        // this.numberEfNode = new Array();
        // this.numberEf2Node = new Array();
        // this.scores = new Array();
        cc.log("清空特效缓存");
    }
}