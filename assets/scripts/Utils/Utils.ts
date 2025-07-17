import { Vec2 } from "cc";
import { CellModel } from "../Model/CellModel";
import { MapManager } from "../Data/MapManager";
import { CellState } from "../Data/Consts";

export class Utils {
  static getCellAnimateTime(effectCells: CellModel[]): number {
    if (!effectCells) {
      return 0;
    }
    var maxTime = 0;
    effectCells.every((ele) => {
      ele.command.forEach((cmd) => {
        if (maxTime < cmd.playTime + cmd.delayTime) {
          maxTime = cmd.playTime + cmd.delayTime;
        }
      });
    });
    console.log("getPlayAniTime: ", maxTime);
    return maxTime;
  }

  static mergeCells(cells1: CellModel[], cells2: CellModel[]): CellModel[] {
    let exists = [];
    let result = [];
    cells2.forEach((cell) => {
      let cellKey = cell.row + "_" + cell.column;
      if (exists.push(cellKey) > -1) {
        result.push(cell);
      }
    });
    cells1.forEach((cell) => {
      let cellKey = cell.row + "_" + cell.column;
      if (exists.push(cellKey) > -1) {
        result.push(cell);
      }
    });
    console.log("mergeCells: ", cells1.length, exists, "=>", result);
    return result;
  }
  static unionPoints(cells: Vec2[]): Vec2[] {
    let exists = [];
    let result = [];
    cells.forEach((cell) => {
      let cellKey = cell.x + "_" + cell.y;
      if (exists.indexOf(cellKey) < 0) {
        exists.push(cellKey)
        console.log("unionPoints: ", cellKey, "=>", exists.length);
        result.push(cell);
      }
    });
    console.log("unionPoints: ", cells.length, exists, "=>", result);
    return result;
  }
  static unionCells(cells: CellModel[]): CellModel[] {
    let exists = [];
    let result = [];
    cells.forEach((cell) => {
      let cellKey = cell.row + "_" + cell.column;
      if (exists.push(cellKey) > -1) {
        result.push(cell);
      }
    });
    console.log("unionCells: ", exists, "=>", result);
    return result;
  }

  static checkWithDirection(
    cells: CellModel[][],
    point: Vec2,
    direction: Vec2[]
  ): Vec2[] {
    if (cells[point.y] == null || cells[point.y][point.x] == null) return [];
    let result: Vec2[] = [];
    let currType = cells[point.y][point.x].type;
    for (let i = 0; i < direction.length; i++) {
      let offset = direction[i];
      let newPoint = new Vec2(point.x + offset.x, point.y + offset.y);
      console.log("checkWithDirection:", currType, offset, "=>", newPoint);
      while (MapManager.Instance.validOffset(newPoint)) {
        if (
          cells[newPoint.y][newPoint.x] == null ||
          cells[newPoint.y][newPoint.x].type != currType
        )
          break;
        result.push(newPoint);
        newPoint = new Vec2(newPoint.x + offset.x, newPoint.y + offset.y);
      }
    }
    return result;
  }

  static checkPoint(cells: CellModel[][], point: Vec2): Vec2[] {
    let colPoints = Utils.checkWithDirection(cells, point, [
      new Vec2(1, 0),
      new Vec2(-1, 0),
    ]);
    let rowPoints = Utils.checkWithDirection(cells, point, [
      new Vec2(0, 1),
      new Vec2(0, -1),
    ]);
    // console.log(
    //   "checkPoint:",
    //   colPoints.length,
    //   rowPoints.length,
    //   colPoints,
    //   rowPoints
    // )
    if (colPoints.length < 2 && rowPoints.length < 2) return [];
    let points = [point.clone()];
    if (colPoints.length > 1) points = points.concat(colPoints);
    if (rowPoints.length > 1) points = points.concat(rowPoints);
    let newCellStatus = CellState.Column;
    // if (rowResult.length >= 5 || colResult.length >= 5) {
    // newCellStatus = CELL_STATUS.BIRD;
    // }
    // else if (rowResult.length >= 3 && colResult.length >= 3) {
    // newCellStatus = CELL_STATUS.WRAP;
    // }
    // else if (rowResult.length >= 4) {
    // newCellStatus = CELL_STATUS.LINE;
    // }
    // else if (colResult.length >= 4) {
    // newCellStatus = CELL_STATUS.COLUMN;
    // }
    // TODO 检查是否能产生更大级别的消除。
    console.log("point:", points.length, points);
    // 移除重复元素
    let result = [];
    // let samePoints = [];
    // for (let i = 0; i < points.length; i++) {
    //   if (samePoints.indexOf(points[i]) == -1) {
    //     samePoints.push(points[i]);
    //     result.push(points[i]);
    //   }
    // }
    return Utils.unionPoints(points);
  }
}
