import { BulletBase } from "./bulletBase";

/**
 * 子弹对象池
 */
export class BulletPool {
    private static _bulletPool = new BulletPool();

    private _bulletList: Array<BulletBase>;

    private maxNum: number = 80;

    private constructor() { }

    public static getBulletPool(): BulletPool {
        return BulletPool._bulletPool;
    }

    /**
     * 初始化子弹对象池
     * @param bulletIdArr 子弹id数组
     */
    public init(bulletIdArr: Array<number>) {
        cc.log("初始化 子弹对象池 ");
        if (!this._bulletList || this._bulletList == null) {
            this._bulletList = new Array<BulletBase>();
            // this.pond(1);
            let len = bulletIdArr.length;
            for (let i = 0; i < len; i++) {
                if (bulletIdArr[i]) {
                    this.pond(bulletIdArr[i]);
                }
            }
        } else {
            return;
        }
    }

    /**将子弹放回对象池 */
    public push(bullet: BulletBase) {
        if (!this._bulletList) {
            // this.init([1]);
            return;
        }
        bullet.removeFromParent();
        if (this._bulletList.length > this.maxNum) {
            bullet.destroy();
            bullet = null;
            return;
        }
        //重置属性
        bullet.resetBulletData();
        this._bulletList.push(bullet);
    }

    public get(resBulletId: number, lockedFish: number = -1): BulletBase {
        if (!this._bulletList) {
            // this.init([1]);
            return;
        }
        let index: number = -1;
        let bullet: BulletBase = null;
        let len = this._bulletList.length;
        for (let i = 0; i < len; i++) {
            if (resBulletId == this._bulletList[i].resBulletId) {
                index = i;
                bullet = this._bulletList[i];
                break;
            }
        }
        if (bullet == null || index < 0) {
            bullet = new BulletBase(resBulletId);
            // return null;
        } else {
            this._bulletList.splice(index, 1);
        }
        bullet._lockedFish = lockedFish;
        return bullet;
    }

    /**添加5个指定id的子弹对象 */
    private pond(bulletId: number) {
        if (!this._bulletList) {
            this.init([1]);
        }
        for (let i = 0; i < 5; i++) {
            this.push(new BulletBase(bulletId));
        }
    }

    /**清空子弹对象池 */
    public clean() {
        //NodeRemoveUtil.removeNodeArray(this._bulletList);
        let len = this._bulletList.length;
        for (let i = 0; i < len; i++) {
            let bullet = this._bulletList[i];
            if (bullet) {
                bullet.removeFromParent(true);
                bullet.destroy();
            }
            this._bulletList[i] = null;
        }
        this._bulletList = null;
        cc.log("清空子弹对象池");
    }
}