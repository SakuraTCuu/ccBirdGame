import BirdBase from "./BirdBase";
import BirdNode from "./BirdNode";
import { Tools } from "./Tools";

/**
 * 鱼对象池
 */
export class BirdPool {
    private static _birdPool = new BirdPool();

    private _birdBasePool: Array<BirdBase> = null;

    private constructor() { }

    public static getFIshPool(): BirdPool {
        return BirdPool._birdPool;
    }

    /**
     * 鱼池初始化
     * @param fishTypeIdArr 鱼类型id数组
     */
    public init() {
        cc.log("初始化鱼对象池");
        if (!this._birdBasePool) {
            this._birdBasePool = new Array<BirdBase>();
        }
    }

    /**清空鱼对象池 */
    public clean() {
        let len = this._birdBasePool.length;
        for (let i = 0; i < len; i++) {
            this._birdBasePool[i].removeFromParent();
            this._birdBasePool[i].destroy();
            this._birdBasePool[i] = null;
        }
        this._birdBasePool.length = 0;
        cc.log("清空鱼对象池");
    }


    /**取鱼 */
    public getFish(id: number): BirdBase {
        if (!this._birdBasePool) {
            cc.error("鱼对象池尚未初始化");
            return;
        }

        let fish = null;
        let index = -1;

        let len = this._birdBasePool.length;
        for (let i = 0; i < len; i++) {
            let fishItem = this._birdBasePool[i];
            if (fishItem.getBirdId() == id) {
                fish = fishItem;
                index = i;
                break;
            }
        }

        if (index == -1) {
            fish = new BirdNode(id);
            fish.inSceneFlg = true;
            fish.inPoolFlg = false;
            return fish;
        } else {
            this._birdBasePool.splice(index, 1);

            fish.setActive(true);
            fish.inSceneFlg = true;
            fish.inPoolFlg = false;
            return fish;
        }
    }

    /**放回 */
    public pushFish(fish: BirdBase) {
        let fishData = (fish as BirdNode);
        if (!this._birdBasePool) {
            cc.error("鱼对象池尚未初始化");
            return;
        }
        let id = fishData.getBirdId();
        //缓存池数量
        let maxNum = 10;
        // let maxNum = T_Fish_Table.getVoByKey(id).cacheNum;
        let num = 0;
        let len = this._birdBasePool.length;
        for (let i = 0; i < len; i++) {
            if (id == this._birdBasePool[i].getBirdId()) {
                num++;
                if (num >= maxNum + 1) {
                    fishData.inPoolFlg = false;
                    fishData.inSceneFlg = false;
                    fishData.removeFromParent();
                    fishData.destroy();
                    fishData = null;
                    // cc.log("销毁鱼");
                    return;
                }
            }
        }
        fish.stopAllActions();
        // Tools.removeAllAction(fishData);
        fishData.removeFromParent();
        fishData.resetData();
        fishData.inPoolFlg = true;
        fishData.inSceneFlg = false;
        // cc.log("鱼回收时剩余执行动作数", fishData.getNumberOfRunningActions());
        this._birdBasePool.push(fishData);
    }
}