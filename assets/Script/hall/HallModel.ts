export interface UserInfo {
    user_id: string;
    show_user_id: string;
    nickname: string;
    gold: number;
    silver: number;
    guest: number;
    pic: string;
    encrypt_uid: string;
    r: number;
    ptLevel: number;
};

export interface BatteryInfo {
    bid: string;//系统的编号
    number: number;//炮台的编号 根据这个显示不同的炮台样式
    base_bullet: number;//炮台的基础蛋数
    level: number;//炮台的等级从1开始
};

export interface SignGift {
    type: number;
    num: number;
    name: number;
};

export interface UserRank {
    pic: string;
    nickname: string;
    count: number;
};

export interface MsgInfo {
    id: string;
    create_date: string;
    is_read: number; //1：已经读 2：未读
    title: string;
};

export interface GiftGoodInfo {
    g_type: string;//有3个 bullet赠送礼品为子弹类型 card 礼品是装备卡 goods_id 这个是实体的产品
    goodsInfo: any;//g_type =goods_id 的时候才会有这个节点
    goods_id: string;
    goods_name: string;
    goods_num: number;
    user_id: string;
};

export interface GiftMsgInfo {
    goods_name: string;
    message: string;
    message_type: string;
    nickname: string;
};


export interface addressInfo {
    name: string;
    mobile: string;
    province_id: number;
    city_id: number;
    address: string;
    is_default: number;
    id: number;
};

export interface UserGoodsInfo {
    gid: number;
    g_type: string;
    use_gold: number;
    use_silver: number;
    create_date: string;
    goods_id: number;
    goods_num: number;
    status: number;
    isSubmit: number;
    goodsInfo: GoodsInfo;
};

export interface GoodsInfo {
    pic: string;
    p_price: string;
}

export interface Traces {
    AcceptStation: string;
    AcceptTime: string;
}

export interface RechargeInfo {
    amount: string;
    create_date: string;
    r_type: number;
    bullet_type: number;
    card_id: number;
    num: number;
}

export interface ShowGiftInfo {
    goodsName: string;
    create_date: string;
    content: string;
    pic: Array<string>;
}

export interface CardInfo {
    card_id: number;
    total: number;
    price: string;
    desc: string;
}

export interface callServerInfo {
    name: string;
    Contact: string;
    type: number;
}
