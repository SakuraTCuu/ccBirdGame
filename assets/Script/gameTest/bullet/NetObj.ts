import { NetPool } from './NetPool';

/**
 * 渔网对象
 * 注意：龙骨动画中的动画实例名称不能含有中文，否则会无法播放
 */
export class NetObj extends cc.Node {
    public nId: number;
    // private netMovie: dragonBones.ArmatureDisplay;

    /**渔网播放动作缓存 */
    private bormAction: cc.ActionInterval;
    // private static count = 0;

    public constructor(id: number) {
        super();
        this.nId = id;
        this.scaleX = 0.75;
        this.scaleY = 0.75;
        let sprite = this.addComponent<cc.Sprite>(cc.Sprite);

        let net = cc.loader.getRes(`image/bullet/bullet_bomb_${id}`, cc.SpriteFrame);
        if (!net) {
            net = cc.loader.getRes(`image/bullet/bullet_bomb_1`, cc.SpriteFrame);
        }
        sprite.spriteFrame = net;

        // let data = cc.loader.getRes(`image/bullet/bullet_bomb_${id}_ske`, dragonBones.DragonBonesAsset);
        // let atlas = cc.loader.getRes(`image/bullet/bullet_bomb_${id}_tex`, dragonBones.DragonBonesAtlasAsset);
        // this.netMovie = this.addComponent<dragonBones.ArmatureDisplay>(dragonBones.ArmatureDisplay);
        // this.netMovie.dragonAsset = data;
        // this.netMovie.dragonAtlasAsset = atlas;
        // this.netMovie.armatureName = this.netMovie.getArmatureNames()[0];
        // this.netMovie.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);

    }

    // private onComplete(): void {
    //     NetPool.getNetPool().push(this);
    // }

    /**
   * 打中鱼  播放渔网效果
   */
    public borm(x: number, y: number, node: cc.Node) {

        // if (!this.netMovie) {
        //     return;
        // }
        if (!this.parent) {
            node.addChild(this);
        }
        this.x = x;
        this.y = y;
        // this.netMovie.playAnimation(this.netMovie.getAnimationNames(this.netMovie.armatureName)[0], 1);
        if (!this.bormAction) {
            this.bormAction = cc.sequence(
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.15, 1),
                cc.fadeTo(0.15, 0),
                cc.callFunc(() => {
                    NetPool.getNetPool().push(this);
                }, this)
            );
        }
        this.stopAllActions();
        this.runAction(this.bormAction);

    }

    destroy(): boolean {
        this.nId = null;
        // this.netMovie.removeEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
        // this.netMovie = null;
        return super.destroy();
    }
}