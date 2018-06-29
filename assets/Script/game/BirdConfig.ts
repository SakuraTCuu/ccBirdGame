// x小鸟信息接口 
export interface BirdInfo {
    id: string;
    bird_id: string;
    name: number;
    speed: number;
    direction: number;//1表示向左到右 2表示右向左
    size: number;//1 小 2 大
    total_blood: number;
    fix_blood: number;

    useXuL: boolean; //使用血量 依然飞行
    useDuZ: boolean; //使用独占 停止飞行
    useAim: boolean; //使用瞄准 依然飞行
    birdState: BirdState; //小鸟状态
}

// 鸟的生命状态
export enum BirdState {
    Alive,
    WillDie,
    Die,
}


