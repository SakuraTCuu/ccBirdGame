

/**
 * 鱼受击变色的颜色矩阵变换
 */
export class ColorFilter {

    /**矩阵乘法运算 */
    public static mmltiple(a: number[][], b: number[][]): number[][] {
        let result = new Array(a.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = new Array(b[0].length);
            for (let j = 0; j < result[i].length; j++) {
                result[i][j] = 0;
            }
        }
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[0].length; j++) {
                for (let k = 0; k < a[0].length; k++) {
                    result[i][j] = result[i][j] + a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    // 矩阵乘积
    public static multiply(mData: number[][], nData: number[][]): number[][] {

        let findByLocation = function (data, xIndex, yIndex) {
            if (data && data[xIndex]) {
                return data[xIndex][yIndex];
            }
        }

        if (mData.length == 0 || nData.length == 0) {
            return;
        }
        if (mData[0].length != nData.length) {
            throw new Error("the two martrix data is not allowed to dot");
        }
        let result = [];
        for (let i = 0, len = mData.length; i < len; i++) {
            let mRow = mData[i];
            result[i] = [];
            for (let j = 0, jLen = mRow.length; j < jLen; j++) {
                let resultRowCol = 0;
                // 如果n矩阵没有足够的列数相乘，转入m矩阵下一行
                if (typeof findByLocation(nData, 0, j) === "undefined") {
                    break;
                }
                for (let k = 0, kLen = jLen; k < kLen; k++) {
                    resultRowCol += mRow[k] * findByLocation(nData, k, j);
                }
                result[i][j] = resultRowCol;
            }
        }
        return result;
    }

    /**获取节点的颜色矩阵 */
    public static getColorMatrix(node: cc.Node) {
        let result: number[][] = new Array(1);
        for (let i = 0; i < result.length; i++) {
            result[i] = new Array(4);
        }
        let color = node.color;
        result[0][0] = color.getR();
        result[0][1] = color.getG();
        result[0][2] = color.getB();
        result[0][3] = color.getA();
        return result;
    }

    /**颜色矩阵转为颜色对象 */
    public static ColorMatrixToColor(colorMatrix: number[][]) {
        return cc.color(
            colorMatrix[0][0],
            colorMatrix[0][1],
            colorMatrix[0][2],
            colorMatrix[0][3],
        );
    }

}