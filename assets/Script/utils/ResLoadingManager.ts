import ResUtil from "./ResUtil";

/**
 * 
 * 资源加载相关逻辑
 */
export default class ResLoadingManager {



    public static loadCommonRes(): void {

        ResUtil.loadRes("image/common_loading", cc.SpriteFrame, () => {

        })
    }

    public static loadMainRes(): void {
        //飞道具 金币 
        ResUtil.loadResDir('effect/fish_click', (err) => {
            if (err) {
                cc.warn("加载资源失败" + 'effect/fish_click');
                return;
            }
            cc.log("资源加载完成---fish click ");
            // mainView.addLoadingProcess(0.01);  //22
        });
        ResUtil.loadResDir('effect/ef_addcoin', (err) => {
            if (err) {
                cc.warn("加载资源失败" + 'effect/ef_addcoin');
            }

            cc.log("资源加载完成---effect ef_addcoin ");
            // mainView.addLoadingProcess(0.01); //23
        });
        ResUtil.loadResDir('effect/icon', (err) => {
            if (err) {
                cc.warn("加载资源失败" + 'effect/icon');
            }

            cc.log("资源加载完成---effect icon ");
            // mainView.addLoadingProcess(0.01); //24
        });


        //加载音效资源
        ResUtil.loadUISoundRes(() => {
            cc.log("资源加载完成---UI资源 ");
            // mainView.addLoadingProcess(0.02); //28
        });
    }


    /**
     * 加载进入房间需要的资源信息
     * @param callBack 
     */
    public static loadRoomRes(callBack: Function): void {
        cc.log("loadRoomRes==========>>>");
        //加载资源，更新进度  //加载资源总进度为 30%

        // let RES_NUM_ROOM: number = 34;
        // let CUR_NUM: number = 0;
        // let updateRoomLoadingProcess = function (addNum: number) {
        //     CUR_NUM += addNum;
        //     if (callBack) {
        //         if (CUR_NUM == RES_NUM_ROOM) {
        //             callBack(1, 1);
        //         } else if (CUR_NUM % 5 == 0) {
        //             callBack(1, CUR_NUM / RES_NUM_ROOM);
        //         }
        //     }
        // }

        ResUtil.loadResDir("bird/bird", () => {
            // updateRoomLoadingProcess(1);
            callBack();
        });

        // ResUtil.loadResDir('effect/fish_click', () => {
        //     updateRoomLoadingProcess(1);
        // });
        // ResUtil.loadResDir('effect/ef_addcoin', () => {
        //     updateRoomLoadingProcess(1);
        // });
        // ResUtil.loadResDir('effect/icon', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //鱼资源5
        // ResUtil.loadResDir('fish', () => {
        //     updateRoomLoadingProcess(5);
        // });

        // //字体资源2
        // ResUtil.loadResDir('font', () => {
        //     updateRoomLoadingProcess(2);
        // });


        // //鱼底盘11
        // ResUtil.loadResDir('image/chassis', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //boss 来袭
        // ResUtil.loadResDir('image/boss_coming', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //鱼潮来临动画资源
        // ResUtil.loadResDir('effect/wave_comming', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // ResUtil.loadResDir('effect/wave', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //爆金币效果资源
        // ResUtil.loadResDir('effect/ef_baojinbi', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //锁定
        // ResUtil.loadResDir('image/lock', () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //彩盘特效
        // ResUtil.loadResDir('effect/ef_caipanBg', () => {
        //     updateRoomLoadingProcess(1);
        // });
        // ResUtil.loadResDir(`icon/caipan`, () => {
        //     updateRoomLoadingProcess(1);
        // });

        // ResUtil.loadResDir(`effect/ef_fazhen`, () => {
        //     updateRoomLoadingProcess(1);
        // });
        // ResUtil.loadResDir(`effect/ef_gunPos`, () => {
        //     updateRoomLoadingProcess(1);
        // });
        // ResUtil.loadRes(`effect/fish_click/fish_click`, cc.SpriteFrame, () => {
        //     updateRoomLoadingProcess(1);
        // });

        // //加载子弹鱼网相关2
        // ResUtil.loadResDir('image/bullet', () => {
        //     updateRoomLoadingProcess(1);
        // });
        // //加载彩盘预制体1
        // ResUtil.loadRes('prefab/caipan', cc.Prefab, function () {
        //     updateRoomLoadingProcess(1);
        // });

        // ResUtil.loadRes('image/bullet/bulletAtlas',cc.SpriteAtlas);

        //加载音效资源-10
        // ResUtil.loadEffectSoundRes(() => {
        //     updateRoomLoadingProcess(5);
        // });
        // ResUtil.loadFishSoundRes(() => {
        //     updateRoomLoadingProcess(5);
        // });

        // cc.log("总进度" + RES_NUM_ROOM);
    }
}
