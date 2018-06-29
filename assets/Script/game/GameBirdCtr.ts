import Game from "./Game";
import VVMgr from "../core/VVMgr";
import { BirdState, BirdInfo } from "./BirdConfig";
import BirdCtr from "./BirdCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameBirdCtr extends cc.Component {

    birdInfoArr: BirdInfo[] = null;
    birdAltas: cc.SpriteAtlas = null;

    private static _instance: GameBirdCtr = null;
    public static get instance(): GameBirdCtr {
        return GameBirdCtr._instance;
    }

    onLoad () {
        GameBirdCtr._instance = this;
        
        // 加载之后转类型
        this.birdInfoArr = VVMgr.birdInfoArr;
        this.birdInfoArr.forEach((element, index) => {
            element["id"] = index + "";
            element["useXuL"] = false;
            element["useDuZ"] = false;
            element["useAim"] = false;
            element["birdState"] = BirdState.Alive;
            element["flyOver"] = false;
            element["canBeHit"] = false;

            Game.instance.birdInfoMap[element.bird_id] = element;
        });

        this.loadResAndInitBird();

        cc.log("GameUICtr onLoad");
    }

    loadResAndInitBird() {
        cc.loader.loadRes("bird/bird", cc.SpriteAtlas, (err, atlas) => {
            if (err) {
                cc.error('loadRes err', err);
                return;
            }
            this.birdAltas = atlas;
            this.initBird();
            this.showBird();
        });
    }

    initBird() {
        let i = 0;
        let name: string = null;
        let spriteFrameS = new Array<cc.SpriteFrame> ();

        let birdInfo: BirdInfo = null;
        let bNode: cc.Node = null;

        let bNodeArray = new Array<cc.Node> ();
        let count = this.birdInfoArr.length;
        count = count > 30 ? 30 : count;
        for (i = 0; i < count; i++) {
            birdInfo = this.birdInfoArr[i];
            for (let k = 0; k < 5; k++) {
                name = i + "-" + k;
                spriteFrameS.push(this.birdAltas.getSpriteFrame(name));
            }
            bNode = this.buildBird(birdInfo, spriteFrameS);
            bNode.scaleX = birdInfo.direction == 1 ? -1 : 1; 
            if (birdInfo.size == 1) {
                bNode.scale = 1;
            } else if (birdInfo.size == 2) {
                bNode.scale = 1.4;
            } else if (birdInfo.size == 3) {
                bNode.scale = 1.8;
            }
            bNode.active = true;
            bNode.scaleX = birdInfo.direction == 1 ? -bNode.scaleX : bNode.scaleX; 

            //重新设置碰撞检测范围
            const contentSize = bNode.getChildByName('Content').getContentSize();
            // const birdSize = cc.size(contentSize.width*1.1, contentSize.height*1.1);
            // bNode.setContentSize(birdSize);
            bNode.getComponent(cc.BoxCollider).size = contentSize;

            bNode.getComponent(BirdCtr).birdInfo = birdInfo;
            Game.instance.birdNodeMap[birdInfo.bird_id] = bNode;

            spriteFrameS.splice(0, 5);

            bNodeArray.push(bNode);
        }

        bNodeArray.forEach(element => {
            Game.instance.birdPool.put(element);
        });

    }

    buildBird(birdInfo: BirdInfo, spriteFrameS: cc.SpriteFrame[]) {
        const bNode = cc.instantiate(Game.instance.birdPrefab);
        bNode[Game.instance.birdIDKey] = birdInfo.bird_id;

        bNode.getChildByName('Content').getComponent(cc.Sprite).spriteFrame = spriteFrameS[0];

        const clip = cc.AnimationClip.createWithSpriteFrames(spriteFrameS, 5);
        clip.name = birdInfo.bird_id;
        clip.wrapMode = cc.WrapMode.Loop;
        bNode.getChildByName('Content').getComponent(cc.Animation).addClip(clip);

        return bNode;
    }

    showBird() {
        // 池子里面多放几条鱼
        const initCount = 10;
        for (let i = 0; i < initCount; ++i){
            Game.instance.getACacheBird();
        }
    }

    getARandomBirdInfo() {
        const index = VVMgr.randomIndex(this.birdInfoArr.length);
        return this.birdInfoArr[index];
    }
}
