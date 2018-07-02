import SoundManager from "../gameTest/SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResUtil {



    public static loadResDir(dir: string, callback: Function = null): void {
        cc.log("loadresDir");
        let time = new Date().getTime();
        cc.loader.loadResDir(dir, function (err) {
            if (err) {
                cc.log("加载目录资源失败 ：目录：" + dir);
                return;
            }
            let pass = new Date().getTime() - time;
            cc.log("加载目录资源成功 ：目录：" + dir + " 时间 =" + pass);
            callback && callback();
        });
    }


    public static loadRes(path: string, type: any, callback: Function = null): void {
        let time = new Date().getTime();
        cc.loader.loadRes(path, type, (err, result) => {
            if (err) {
                cc.log("加载资源失败 ：资源名称：" + path);
                return;
            }
            let pass = new Date().getTime() - time;
            cc.log("加载资源成功 ：资源名称：" + path + " 时间 =" + pass);
            callback && callback(result);
        })
    }

    /**
     * 加载UI相关音效资源
     */
    public static loadUISoundRes(callback: Function = null): void {
        this.loadResDir("sound/ui/", () => {
            SoundManager.uiSoundLoadEnd = true;
            callback && callback();
        });
    }

    /**
     * 加载Fish相关音效资源
     */
    public static loadFishSoundRes(callback: Function = null): void {
        this.loadResDir("sound/fish/", () => {
            SoundManager.fishSoundLoadEnd = true;
            callback && callback();
        });
    }

    /**
     * 加载特效相关音效资源
     */
    public static loadEffectSoundRes(callback: Function = null): void {
        this.loadResDir("sound/effect/", () => {
            SoundManager.effectSoundLoadEnd = true;
            callback && callback();
        });
    }




}
