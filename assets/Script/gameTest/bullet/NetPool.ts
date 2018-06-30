import { NetObj } from "./NetObj";

/**
 * 渔网对象池
 */
export class NetPool {

    private static _netPool: NetPool = new NetPool();

    private _netList: Array<NetObj> = null;

    private constructor() { }

    /**
     * 获得渔网对象池
     */
    public static getNetPool(): NetPool {
        return NetPool._netPool;
    }

    /**
     * 初始化渔网对象池
     * @param netIdArr 渔网id数组
     */
    public init(netIdArr: Array<number>) {
        cc.log("初始化 渔网对象池");
        // if (!this._netList) {
        this._netList = new Array<NetObj>();
        // this.pond(1);
        for (let netId of netIdArr) {
            if (netId) {
                this.pond(netId);
            }
        }
        // } else {
        //     return;
        // }
    }

    /**
     * 将渔网放回对象池
     * @param net 渔网
     */
    public push(net: NetObj) {
        if (!this._netList) {
            // this.init([1]);
            return;
        }
        // net.removeFromParent();
        net.opacity = 0;

        //恢复属性
        net.scale = 1;
        net.stopAllActions();
        this._netList.push(net);
    }

    /**
     * 从对象池中取得渔网
     * @param netId 渔网ID
     */
    public get(netId: number) {
        let index: number = 0;
        let net: NetObj = null;

        if (!this._netList) {
            // this.init([1]);
            return;
        }

        let len = this._netList.length;
        for (let i = 0; i < len; i++) {
            if (this._netList[i].nId == netId) {
                net = this._netList[i];
                index = i;
                break;
            }
        }

        if (net == null || index < 0) {  // 没有找到需要的渔网 创建一个新
            // this.push(new NetObj(netId));
            // this.pond(netId);
            net = new NetObj(netId);
            // return new NetObj(netId);
        } else {
            this._netList.splice(index, 1);
            // return net;
        }

        net.opacity = 255;
        return net;
    }

    /**加入5个 netId的渔网对象 */
    private pond(netId: number) {
        if (!this._netList) {
            this.init([1]);
        }
        for (let i = 0; i < 5; i++) {
            this.push(new NetObj(netId));
        }
    }

    /**
     * 清空对象池
     */
    public clean() {
        // NodeRemoveUtil.removeNodeArray(this._netList);
        let len = this._netList.length;
        for (let i = 0; i < len; i++) {
            let fishNet = this._netList[i];
            if (fishNet) {
                fishNet.removeFromParent(true);
                fishNet.destroy();
            }
            this._netList[i] = null;
        }
        this._netList.length = 0;
        this._netList = null;
        cc.log("清空渔网对象池");
    }
}
