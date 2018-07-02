
/**
 * 鱼动画资源的处理工具
 */
export class FishResLoadUtil {

    private static fishResLoadUtil = new FishResLoadUtil();

    //动画资源缓存
    private fishAnimationClipPool: Array<cc.AnimationClip> = new Array();


    private constructor() { }

    public static getFishResLoadUtil() {
        return FishResLoadUtil.fishResLoadUtil;
    }

    /**
     * 获取鱼资源
     * @param name 鱼资源名字
     */
    public static getFishRes(name: string) {

        let atlas: cc.SpriteAtlas = cc.loader.getRes("bird/bird", cc.SpriteAtlas);
        if (!atlas) {
            cc.error("鱼纹理资源不存在" + name);
            return;
        }
        return atlas.getSpriteFrames();

    }

    //从图集中取出其中一条小鱼的资源
    private static getXiaoyu(name: string) {
        let fishRes = [];
        let atlas: cc.SpriteAtlas = cc.loader.getRes(`fish/xiaoyuqun`, cc.SpriteAtlas);
        let spriteFrames = atlas.getSpriteFrames();
        for (let spriteFrame of spriteFrames) {
            let spriteFrameName = spriteFrame.name;
            spriteFrameName = spriteFrameName.substring(0, spriteFrameName.lastIndexOf('_'));
            if (spriteFrameName === name) {
                fishRes.push(spriteFrame);
            }
        }
        if (fishRes.length <= 0) {
            cc.error("鱼纹理资源不存在" + name);
        }
        return fishRes;
    }


    /**
     *  获取鱼的动画资源并返回鱼的动画片段实例
     * @param name 鱼资源名
     * @param sample 帧率
     * @param res 鱼的资源spriteFrame数组,若传入此参数则使用传入的资源进行cc.AnimationClip
     */
    public getFishAnimationClip(name: string, sample: number = 5, res?: any): cc.AnimationClip {
        for (let c of this.fishAnimationClipPool) {
            if (c.name == name) {
                return c;
            }
        }
        let fishRes;
        if (res) {
            fishRes = res;
        } else {
            fishRes = FishResLoadUtil.getFishRes(name);
        }
        let clip = cc.AnimationClip.createWithSpriteFrames(fishRes, sample);
        clip.name = name;
        clip.wrapMode = cc.WrapMode.Loop;
        this.fishAnimationClipPool.push(clip);
        return clip;
    }
}