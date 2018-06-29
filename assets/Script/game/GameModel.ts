export interface BirdGoodInfo {
    name: string;
    number: string;
    bird_id: string;
    goods: GoodInfo[];
};

export interface GoodInfo {
    goods_id: string;
    pic: string;
    card_id: string;//代表礼品是装备卡 当type =card 才有这个字段 card_id = 1 倍率卡 card_id = 2 血量卡 card_id =3 独占卡
    card_num: number;
    bullet_id: string;//子弹的id 当 type = bullet 才有这个字段 1：金子弹 2：银子弹
    bullet_num: number;
    type: string; //card bullet  goods_id
};

export interface BirdAttackInfo {
    bird_id: string;
    bird_bold: number;
    user_id: string;
    extra: any;
    bold: number; //对应的用户的金子弹多少个
    silver: number; //对应的用户的银子弹多少个
};

export interface RobotAttackInfo {
    bird_id: string;
    user_id: string;
    encrypt_uid: string;
    extra: any;
};

export interface PropCardInfo {
    card_id: string;
    total: number;
    price: string;
    desc: string;
};