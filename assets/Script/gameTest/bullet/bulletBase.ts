import { FishUtil } from "./FishUtil";


/**
 * 子弹类型
 */
export enum BULLET_TYPE {
    BASE = 1,    //正常
    REBOUND = 2  //撞墙 反弹
}


/**
 * 子弹
 * 包含子弹的显示和子弹的逻辑更新方法
 */
export class BulletBase extends cc.Node {
    //子弹资源id
    public resBulletId: number = -1;
    //子弹id
    private _bulletId: number = -1;
    //子弹归属的炮台
    public belongGun: number;
    public bePos: number;
    // //子弹归属炮台的索引，用于分身
    // public nGunIndex: number;

    // private _bShowDead: boolean;

    /*子弹死亡状态  死亡为true  存活为false*/
    protected _bDead: boolean;
    /***是否继续逻辑更新 */
    protected _bUpdate: boolean = true;

    /**子弹的运动逻辑 */
    // protected _logicMove: cc.Action;

    // /**子弹的类型参数 */
    private _enumType: BULLET_TYPE;
    /** */
    // private _nAniType: BULLET_ANI_TYPE = -1;
    // /**反弹子弹次数 */
    private _nReboundTimes: number = 0;

    public _lockedFish: number = -1;


    ////////////分身功能相关////////////////////
    // private _nCloneTag: number = -1;

    public constructor(nId: number, lockedFish: number = -1) {
        super();
        // if (lockedFish != null) {
        //     this._lockedFish = lockedFish;
        // } else {
        //     this._lockedFish = null;
        // }
        this._lockedFish = lockedFish;
        this.create(nId);
    }

    /**
     * 创建一个子弹节点
     * @param nId  子弹ID
     */
    private create(nId: number): void {
        //不同的子弹id 设置不同的贴图
        this.resBulletId = nId;
        // this.bePos = Number(T_Config_Table.getVoByKey(51).value);
        // let dataVo = T_Bullet_Table.getVoByKey(nId);
        // if (dataVo == null) {
        //     GameLog.log("Warnning!!!the fish data is null,id--->", nId);
        //     return;
        // }
        // this._enumType = dataVo.type;
        // let resUrl = dataVo.resUrl;
        // resUrl = resUrl.substring(0, resUrl.lastIndexOf("_"));

        //TODO
        let resUrl;
        let sprite = this.addComponent<cc.Sprite>(cc.Sprite);
        let bulletAtlas: cc.SpriteAtlas = cc.loader.getRes('image/bullet/bulletAtlas', cc.SpriteAtlas);
        let spriteImage = bulletAtlas.getSpriteFrame(resUrl);
        if (!spriteImage) {
            let image = bulletAtlas.getSpriteFrame('bullet');
            sprite.spriteFrame = image;
        } else {
            sprite.spriteFrame = spriteImage;
        }
        // let box = this.addComponent<cc.BoxCollider>(cc.BoxCollider);
        // box.size = cc.size(10, 50);
        // this.group = "bullet";
        this.scaleY = -1;

        this._bDead = false;
    }

    /**
     * 设置子弹的初始位置和角度
     * @param xPos  x
     * @param yPos   y
     * @param rotation 角度 
     */
    public setBulletPos(xPos: number, yPos: number, rotation: number): void {
        this.rotation = rotation;
        let degree = Math.PI / 180 * (this.rotation);
        let xChange = xPos + Math.sin(degree) * 120;
        let yChange = yPos + Math.cos(degree) * 120;
        this.x = xChange;
        this.y = yChange;
    }

    /**
     * 开始移动动作
     * @param pos 目标点
     * @param duration  移动的时间
     */
    public bindMoveAction(posX: number, posY: number, duration: number) {
        //this.stopAllActions();
        let _logicMove = cc.moveTo(duration, posX, posY);
        this.runAction(_logicMove);
    }

    //逻辑更新
    // public logicUpdate(): void {
    //     if (!this._bUpdate) {
    //         return;
    //     }
    //     let isRebound = false;
    //     let rectObj = FishUtil.GET_FISHING_RECT();
    //     if (this.x < rectObj.x) {
    //         this.x = rectObj.x;
    //         isRebound = true;
    //     }
    //     if (this.x > rectObj.width) {
    //         this.x = rectObj.width;
    //         isRebound = true;
    //     }
    //     if (this.y < rectObj.y) {
    //         this.y = rectObj.y;
    //         isRebound = true;
    //     }
    //     if (this.y > rectObj.height) {
    //         this.y = rectObj.height;
    //         isRebound = true;
    //     }
    //     // if (isRebound) {
    //     //     this.stopAllActions();
    //     //     // this.reboundBullet();
    //     // }
    // }
    public getBDead(): boolean {
        return this._bDead;
    }
    public setBDead(bDead: boolean): void {
        if (bDead) {
            this.stopAllActions();
            this._bUpdate = false;
            this._bDead = true;
            // this.removeFromParent();
        } else {
            this._bDead = false;
        }
    }
    getBUpdate(): boolean {
        return this._bUpdate;
    }

    /**将反弹更新打开 */
    // setBUpdate() {
    //     this._bUpdate = true;
    // }

    //小鸟项目里没有反弹逻辑
    /**反弹轨迹 */
    // reboundBullet(): void {
    //     if (this._nReboundTimes >= 10) {
    //         this.setBDead(true);
    //         // this.destroy();
    //         if (this._bulletId > 0) {
    //             let msg = ProtobufUtil.getInstance().getBulletDisappear();
    //             msg.setBulletId(this._bulletId);
    //             NetManager.send(msg);
    //         }
    //         return;
    //     }
    //     // GameLog.log("子弹角度" + this.rotation);
    //     if (this.rotation >= 360 || this.rotation <= -360) {
    //         let n = Math.floor(this.rotation / 360);
    //         this.rotation = this.rotation - 360 * n;
    //     }

    //     if (this.rotation > 180) {
    //         this.rotation -= 360;
    //     } else if (this.rotation < -180) {
    //         this.rotation += 360;
    //     }

    //     // GameLog.log("修正后角度" + this.rotation);
    //     this._lockedFish = -1;
    //     this._nReboundTimes++;
    //     let degree: number;
    //     let destX: number;
    //     let destY: number;
    //     let rectObj = FishUtil.GET_FISHING_RECT();
    //     if (this.rotation < 180 && this.rotation > 90)//右下
    //     {
    //         //x超出界限
    //         if (this.x >= rectObj.width) {
    //             this.rotation = -this.rotation;
    //             degree = Math.PI / 180 * (-this.rotation - 90);
    //             destX = this.x - Math.cos(degree) * 2000;
    //             destY = this.y - Math.sin(degree) * 2000;
    //         }
    //         //y超出界限
    //         if (this.y <= rectObj.y) {
    //             this.rotation = 180 - this.rotation;
    //             degree = Math.PI / 180 * this.rotation;
    //             destX = this.x + Math.sin(degree) * 2000;
    //             destY = this.y + Math.cos(degree) * 2000;
    //         }

    //     } else if (this.rotation < 90 && this.rotation > 0) //右上
    //     {
    //         //x 超出边界
    //         if (this.x >= rectObj.width) {
    //             this.rotation = -this.rotation;
    //             degree = Math.PI / 180 * (-this.rotation);
    //             destX = this.x - Math.sin(degree) * 2000;
    //             destY = this.y + Math.cos(degree) * 2000;
    //         }
    //         //y 超出边界
    //         if (this.y >= rectObj.height) {
    //             this.rotation = 180 - this.rotation;
    //             degree = Math.PI / 180 * (this.rotation - 90);
    //             destX = this.x + Math.cos(degree) * 2000;
    //             destY = this.y - Math.sin(degree) * 2000;
    //         }
    //     } else if (this.rotation < -90 && this.rotation > -180) //左下
    //     {
    //         //y超出界限
    //         if (this.y <= rectObj.y) {
    //             this.rotation = -180 - this.rotation;
    //             degree = Math.PI / 180 * (-this.rotation);
    //             destX = this.x - Math.sin(degree) * 2000;
    //             destY = this.y + Math.cos(degree) * 2000;
    //         }
    //         //x 小于 0
    //         if (this.x <= rectObj.x) {
    //             this.rotation = -this.rotation;
    //             degree = Math.PI / 180 * (this.rotation - 90);
    //             destX = this.x + Math.cos(degree) * 2000;
    //             destY = this.y - Math.sin(degree) * 2000;
    //         }
    //     } else if (this.rotation < 0 && this.rotation > -90) //左上
    //     {
    //         //x 小于 0
    //         if (this.x <= rectObj.x) {
    //             this.rotation = -this.rotation;
    //             degree = Math.PI / 180 * this.rotation;
    //             destX = this.x + Math.sin(degree) * 2000;
    //             destY = this.y + Math.cos(degree) * 2000;
    //         }
    //         //y 超出边界
    //         if (this.y >= rectObj.height) {
    //             this.rotation = -180 - this.rotation;
    //             degree = Math.PI / 180 * (-this.rotation - 90);
    //             destX = this.x - Math.cos(degree) * 2000;
    //             destY = this.y - Math.sin(degree) * 2000;
    //         }
    //     }
    //     else if (this.rotation == 0 || this.rotation == 90 || this.rotation == -90 || this.rotation == 180 || this.rotation == -180) {
    //         if (this.rotation == 0) {
    //             destX = this.x;
    //             destY = this.y + 2000;
    //         } else if (this.rotation == 180 || this.rotation == -180) {
    //             destX = this.x;
    //             destY = this.y - 2000;
    //         } else if (this.rotation == 90) {
    //             destX = this.x + 2000;
    //             destY = this.y;
    //         } else if (this.rotation == -90) {
    //             destX = this.x - 2000;
    //             destY = this.y;
    //         }
    //         this.rotation += 180;
    //     }
    //     if (this.rotation >= 360 || this.rotation <= -360) {
    //         let n = Math.floor(this.rotation / 360);
    //         this.rotation = this.rotation - 360 * n;
    //     }

    //     if (this.rotation > 180) {
    //         this.rotation -= 360;
    //     } else if (this.rotation < -180) {
    //         this.rotation += 360;
    //     }

    //     let costTime = Tools.pDistance(this.x, this.y, destX, destY) / 1.2 / 1000;  //1.2为子弹速度
    //     /**给子弹绑定移动逻辑**/
    //     this.bindMoveAction(destX, destY, costTime);
    // }


    public getBulletId(): number {
        return this._bulletId;
    }

    public setBulletId(bId: number): void {
        this._bulletId = bId;
    }

    public getBulletType(): number {
        return this._enumType;
    }
    // /**获取分身子弹自己的tag */
    // public getBulletTag(): number {
    //     return this._nCloneTag;
    // }
    // public setBulletTag(nTag: number): void {
    //     this._nCloneTag = nTag;
    // }

    public getReboundTimes(): number {
        return this._nReboundTimes;
    }

    /**将反弹次数归零 */
    public setReboundTimes() {
        this._nReboundTimes = 0;
    }
    /**
     * 重置子弹属性
     */
    public resetBulletData() {
        this.stopAllActions();
        // this.setReboundTimes();
        this._lockedFish = -1;
        // this.setBUpdate();
        this.setBDead(false);
        this.setBulletId(-1);
        // this.setBulletTag(-1);
    }
    public destroy(): boolean {
        this.resBulletId = null;
        //子弹id
        this._bulletId = null;
        //子弹归属的炮台
        this.belongGun = null;
        this.bePos = null;
        //子弹归属炮台的索引，用于分身
        // this.nGunIndex = null;
        this._bDead = null;
        /***是否继续逻辑更新 */
        this._bUpdate = null;
        /**子弹的类型参数 */
        this._enumType = null;
        /** */
        // this._nAniType = null;
        /**反弹子弹次数 */
        this._nReboundTimes = null;
        this._lockedFish = null;
        this.stopAllActions();
        //this.addComponent<cc.Sprite>(cc.Sprite);
        //子弹只有单张的图片
        this.removeAllChildren();
        return super.destroy();
    }
}
