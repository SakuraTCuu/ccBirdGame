
export default class AudioMgr {
    bgmVolume: number = 0;
    sfxVolume: number = 0;
    bgmAudioID: number = 0;
    
    constructor() {
        const bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != null) {
            this.bgmVolume = parseFloat(bgm);    
        } 
        const sfx = cc.sys.localStorage.getItem("sfxVolume");
        if (sfx != null) {
            this.sfxVolume = parseFloat(sfx);    
        }
    }

    getUrl(url) {
        return cc.url.raw("resources/sounds/" + url);
    }
    
    playBGM(url) {
        const audioUrl = this.getUrl(url);
        cc.log(audioUrl);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true,this.bgmVolume);
    }
    
    playSFX(url){
        if (this.sfxVolume > 0) {
            const audioUrl = this.getUrl(url);
            cc.audioEngine.play(audioUrl, false, this.sfxVolume);    
        }
    }
    
    setSFXVolume(v){
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    }
    
    setBGMVolume(v){
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
        }
        if (this.bgmVolume != v) {
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    }
}
