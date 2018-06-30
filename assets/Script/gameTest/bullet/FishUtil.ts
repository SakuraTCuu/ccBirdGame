import { Tools } from "../Tools";

/**
 * 打鱼相关工具类
 */
export class FishUtil {
    /**分身个数 */
    static CLONE_NUM = 3;
    /**分身炮口初始角度 */
    static CLONE_GUN_ROTATION = [0, -45, 45];
    /**分身单个炮管的最大子弹数 */
    static CLONE_GUN_MAXBULLET = 20;
    /**鱼积分的最大值 */
    static FISH_SCORE_MAX = 99999999;
    /**闪电链的动画文件索引 */
    static ELE_FRAME_RESNAME = "eleFrame";
    /**鱼被电中的特效 */
    static FISH_ELE_FRAME_RESNAME = "fishEleFrame";
    /**金币的特效 */
    static GOLD_MOVIE_RESNAME = "fishEleFrame";
    /**闪电播放的帧率 */
    static FISH_ELE_MAXFRAME = 3;
    /**是否处于Debug模式 */
    static FISHING_DEBUG = true;


    /**
     * 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
     */
    public static getAngle(px, py, mx, my): number {
        if (mx < px + 1 && mx > px - 1 && my < py) {//鼠标在y轴负方向上
            return -179;
        }
        if (mx < px + 1 && mx > px - 1 && my > py) {//鼠标在y轴正方向上
            return 1;
        }
        if (mx > px && my == py) {//鼠标在x轴正方向上
            return 90;
        }
        if (mx < px && my == py) {//鼠标在x轴负方向
            return -90;
        }

        // let truePos = cc.p(mx - px, my - py);
        // let angle = cc.pAngleSigned(truePos, cc.p(0, 1));
        let angle = Tools.pAngleSigned(mx - px, my - py, 0, 1);
        angle = cc.radiansToDegrees(angle);
        angle = Math.floor(angle);

        if (mx < px) {
            angle = -angle;
        }

        // if (angle == 0) {
        //     angle = 1;
        // }
        return angle;
    }

    /**显示区域 */
    private static FISHING_RECT = cc.rect(0, 0, 1280, 720);
    /**获取显示区域 */
    static GET_FISHING_RECT(): cc.Rect {
        return FishUtil.FISHING_RECT;
    }

    //获取背景音乐
    public static getMusicByRoomType(rType: number): string {
        // switch (rType) {
        //     case RequesetRoomState.NewbieRoom:
        return "bgm_scene1";
        //     default:
        //         return "bgm_scene2";
        // }
    }
}

/**
 * 子弹类型
 */
export enum BULLET_TYPE {
    BASE = 1,
    REBOUND = 2
}
export enum BULLET_ANI_TYPE {
    RUN = 1,
    DEAD = 2
}
export enum FISH_ANIMATION_TYPE {
    RUN = 1,
    AROUND = 2,
    DEAD = 3
}