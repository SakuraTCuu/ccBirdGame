
export default class SoundManager {


    /**
     * 背景音量<=0关闭
     */
    private static bgmVolume: number = 0.5;
    /**
     * 特效音量<=0关闭
     */
    private static sfxVolume: number = 0.5;
    /**
     * 当前播放的ID
     */
    private static bgmAudioID: number;

    //鱼类音效是否加载完成
    public static fishSoundLoadEnd: boolean;
    //特效音效是否加载完成
    public static effectSoundLoadEnd: boolean;
    //UI音效是否加载完成
    public static uiSoundLoadEnd: boolean;

    //背景音乐播放的时间
    private static bgmCurrentTime = 0
    private static currentBGMUrl = "";

    private static MAX_AUDIO_NUM = 5;

    // use this for initialization
    public static init() {
        let t = cc.sys.localStorage.getItem("bgmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        }

        t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            // console.log("cc.audioEngine.pauseAll");
            SoundManager.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            // console.log("cc.audioEngine.resumeAll");
            // cc.audioEngine.resumeAll();
            SoundManager.resumeAll();
        });

        cc.audioEngine.setMaxAudioInstance(SoundManager.MAX_AUDIO_NUM);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    public static getUrl(url: string): string {
        return cc.url.raw("resources/" + url);
    }

    /**
     * 播放背景音乐
     * @param url 
     */
    public static playBGM(url: string) {
        if (this.bgmVolume > 0) {
            let audioUrl = this.getUrl(url);
            console.log(audioUrl);
            if (this.bgmAudioID >= 0) {
                cc.audioEngine.stop(this.bgmAudioID);
            }
            this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
            this.currentBGMUrl = audioUrl;
        }
    }

    /**
     * 播放特效
     * @param url 
     */
    public static playSFX(url: string): void {
        if (this.sfxVolume > 0) {
            let audioUrl = this.getUrl(url);
            let audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
            cc.audioEngine.setLoop(audioId, false);
            cc.audioEngine.setFinishCallback(audioId, function () {
                cc.audioEngine.stop(audioId);
            });
        }
    }

    public static setSFXVolume(v: number): void {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    }

    public static setBGMVolume(v: number, force: boolean): void {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
                cc.audioEngine.setVolume(this.bgmAudioID, v);
            }
            else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if (this.bgmVolume != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            if (this.bgmAudioID > 0) {
                cc.audioEngine.setVolume(this.bgmAudioID, v);
            }
        }
    }

    public static isBGMOpen(): boolean {
        return this.bgmVolume > 0;
    }

    public static isSFXOpen(): boolean {
        return this.sfxVolume > 0;
    }

    public static stopAll(): void {
        cc.audioEngine.stopAll();
        this.clearAll();
    }

    public static pauseAll(): void {
        if (this.bgmAudioID > 0) {
            this.bgmCurrentTime = cc.audioEngine.getCurrentTime(this.bgmAudioID);
        }
        cc.audioEngine.pauseAll();
        // this.clearAll();
    }

    public static resumeAll(): void {
        cc.audioEngine.resumeAll();
        if (this.bgmVolume > 0 && this.bgmAudioID > 0) {
            // cc.audioEngine.resume(this.bgmAudioID);
            // cc.audioEngine.resumeAll();
            // this.bgmAudioID = cc.audioEngine.play(this.currentBGMUrl, true, this.bgmVolume);
            cc.audioEngine.setCurrentTime(this.bgmAudioID, this.bgmCurrentTime);
        }
    }

    public static clearAll(): void {
        cc.audioEngine.uncacheAll();
    }

    //播放鱼死亡音效
    public static playFishDeathSound(fishId: number): void {
        // let fishVo = T_Fish_Table.getVoByKey(fishId);
        // if (fishVo.sound != "null" && SoundManager.fishSoundLoadEnd) {
        //     let sound = "sound/fish/" + fishVo.sound;
        //     SoundManager.playSFX(sound + ".mp3");
        // }
    }
    //播放特效音效
    public static playEffectSound(sound: string): void {
        if (sound != "null" && SoundManager.effectSoundLoadEnd) {
            sound = "sound/effect/" + sound;
            SoundManager.playSFX(sound + ".mp3");
        }
    }
    //播放UI音效
    public static playUISound(sound: string): void {
        if (sound != "null" && SoundManager.uiSoundLoadEnd) {
            sound = "sound/ui/" + sound;
            SoundManager.playSFX(sound + ".mp3");
        }
    }
}
