export default class BirdPath {

    //随机获取一个位置
    public static getRandomPathAction(direction: number) {
        let size = cc.director.getVisibleSize();
        let width = size.width;
        let height = size.height;

        if (direction == 1) {
            width = -width;
        }

        let path1 = [{ x: -width / 2, y: -height / 2 }, { x: 0, y: 0 }, { x: width / 2, y: -height / 2 }];
        let path2 = [{ x: -width / 2, y: height / 2 }, { x: 0, y: 0 }, { x: width / 2, y: height / 2 }];
        let path3 = [{ x: -width / 2, y: 0 }, { x: 0, y: 0 }, { x: width / 2, y: 0 }];
        let path4 = [{ x: -width / 2, y: -height / 2 }, { x: 0, y: 0 }, { x: width / 2, y: height / 2 }];
        let path5 = [{ x: -width / 2, y: height / 2 }, { x: 0, y: 0 }, { x: width / 2, y: -height / 2 }];


        let random = cc.random0To1() * 10;

        if (random <= 2) {
            return path1;
        } else if (random <= 4 && random > 2) {
            return path2;
        } else if (random <= 6 && random > 4) {
            return path3;
        } else if (random <= 8 && random > 6) {
            return path4;
        } else {
            return path5;
        }
    }
}
