
/**
 * 鸟的基类 ,提供基础方法
 */
export default class BirdBase extends cc.Node {

    /** 鸟的id */
    protected _birdId: number;

    // 对象的唯一id 
    private _uniqId: number;

    // 对象类型
    private _actorType: number = 1;

    /** 是否发生过翻转 */
    public _bFlipY: boolean;

    /**鸟是否存活 
	 * 存活为true 死亡为false
	*/
    private _fishAlive: boolean = true;

    /**是否参与碰撞检测和逻辑更新 */
    private _fishIsUpdate: boolean = true;

    //鸟的显示分层
    public BIRD_LAYER: cc.Node;   //鸟的层
    public EFFECT_LAYER: cc.Node;  //鸟的特效层

    public FISH_POP_LAYER: cc.Node;



    constructor(id) {
        super();
        this._birdId = id;
    }

    public getBirdId(): number {
        return this._birdId;
    }

    //设置唯一标识
    public setUniqId(uid: number): void {
        this._uniqId = uid;
    }

    //获取唯一标识
    public getUniqId(): number {
        return this._uniqId;
    }

    //设置对象类型
    public setType(type: number): void {
        this._actorType = type;
    }

    //获取对象类型
    public getType(): number {
        return this._actorType;
    }

    public flipX(f: boolean): void {
        this.BIRD_LAYER.scaleX = (f == true ? -1 : 1);
    }

    public flipY(f: boolean): void {
        let childFishs = this.BIRD_LAYER.childrenCount;
        for (let i = 0; i < childFishs; i++) {
            let fish = this.BIRD_LAYER.children[i];
            fish.scaleY = (f == true ? -1.5 : 1.5);
        }
    }

    public isFlipY(): boolean {
        return this._bFlipY;
    }

    public fishflipY(): void {

    }

    public playHitEffect(): void {

    }

    public setFishPosition(posX: number, posY: number): void {
		cc.error(" set FishPosition need reload ");
	}

    //获取鸟层
    public getBIRD_LAYER(): cc.Node {
        return this.BIRD_LAYER;
    }
    //获取特效层
    public getEFFECT_LAYER(): cc.Node {
        return this.EFFECT_LAYER;
    }

    /**
     * 获取活跃标记
     * 如果不活跃。不参与碰撞和更新
     */
    public getActive(): boolean {
        return this._fishAlive;
    }
	/**
	 * 设置活跃标记
	 * @param bValue 
	 */
    public setActive(bValue): void {
        this._fishAlive = bValue;
        if (!this._fishAlive) {
            this.opacity = 0;
            // Tools.removeAllAction(this);
        }
    }

    /**设置参与更新标记 */
    public setIsUpdate(isUpdate: boolean) {
        this._fishIsUpdate = isUpdate;
    }

    /**返回更新标记 */
    public getIsUpdate() {
        return this._fishIsUpdate;
    }
}
