export enum WebCmd {
    CMD_USER_INTOGAME_REQ   = "intoField",
    CMD_USER_INTOGAME_RSP   = "intoField",

    CMD_USER_EXITGAME_REQ   = "exitField",
    CMD_USER_EXITGAME_RSP   = "exitField",

    CMD_USER_HIRBIRD_REQ    = "playBird",
    CMD_USER_HIRBIRD_RSP    = "playBird",

    CMD_ROBOT_HIRBIRD_REQ   ="robotPlayBird",
    CMD_ROBOT_HIRBIRD_RSP   ="robotPlayBird",

    CMD_USER_USERCARD_REQ   = "useCard", //预使用卡类装备
    CMD_USER_USERCARD_RSP   = "useCard",

    CMD_USER_USERCARD_XUL_REQ   = "useCard", //使用血量卡
    CMD_USER_USERCARD_XUL_RSP   = "showBold",

    CMD_USER_USERCARD_DUZ_REQ   = "useCard", //使用独占卡
    CMD_USER_USERCARD_DUZ_RSP   = "monopolyBird",

    CMD_GAME_USERIN             = "input_game", //用户进入
    CMD_GAME_USEREXIT           = "exitField",  //用户离开
    
    CMD_GAME_USERBINGO          = "successGoods", //礼品消息
    
    CMD_GAME_MESSAGE            = "commonMessage", //公告消息


    CMD_GAME_BIRDFILL           = "fillBird", //填充小鸟信息
}

export enum HTTPPath {
    REGISTERSMS             ="/sms/registerSend",
    LOGINSMS                ="/sms/registerAndLoginSend",
    REGISTER                ="/user/register",

    GETSYSTEMVERSION        ="/static/getSystem",

    LOGIN                   ="/user/registerAndLogin",
    USERINFO                ="/user/userInfo",

    USERCARD                ="/UserCard/cardList",

    SIGNITEM                ="/sign/signItem",
    SIGN                    ="/sign/sign",

    USERONLINE              ="/online/user",
    USERONLINERANK          ="/online/playBirdRand",
    USERMESSAGE             ="/game/userMessage",
    USERVIEWMESSAGE         ="/game/viewMessage",
    USERREADMESSAGE         ="/game/readMessage",

    USERHELP                ="/game/help",

    BIRDGOODS               ="/goods/getBirdGoods",

    USERGETADDRESS          ="/Address/getAddress",
    USERSETDAFAULTADDRESS   ="/address/setDefault",
    USERDELETEADDRESS       = "/Address/delAddress",
    USERADDADDRESS          ="/Address/addAddress",
    USEREDITADDRESS         ="/Address/editAddress",
    USERGETONEADDRESS       ="/address/addressInfo",

    USERBOXLIST             ="/Usergoods/list",
    USERGOODSAPPLY          ="/Usergoods/apply",

    USERGOODSSHIPPER        ="/Usergoods/shipper",

    USERRECHARGELIST        ="/Recharge/record",

    USERSHOWGIFT            ="/Usergoods/mySubmitGoods",

    USERCARDMYCARD          ="/UserCard/myCard",

    USERCALLSERVER          ="/Customer/list",
    
}

export enum GameType {
    Low = 1,
    High
};

export enum GameState {
    Idle = 1,
    Pause
};

export enum LoginType {
    Mobile = 1,
    QQ,
    WX
};

export enum PropType {
    BeiLKa = 1,
    XueLKa,
    DuZKa,
};

export enum NotifyPath {
    NameUpdate = "NotifyNameUpdate",
    AvatarUpdate = "NotifyAvatarUpdate",
    SocketDisconnect = "NotifySocketDisconnect",
    ThirdLogin = "NotifyThirdLogin",
    ShareResult = "NotifyShareResult",
    ChargeResult = "NotifyChargeResult",
};

export enum ChargeType {
    Bullet = 1,
    Prop,
};