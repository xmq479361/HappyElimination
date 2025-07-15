import { Vec2 } from "cc";
import { CellModel } from "../Model/CellModel";

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
    return result;
  }
  static unionPoints(cells: Vec2[]): Vec2[] {
    let exists = [];
    let result = [];
    cells.forEach((cell) => {
      let cellKey = cell.x + "_" + cell.y;
      if (exists.push(cellKey) > -1) {
        result.push(cell);
      }
    });
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
    return result;
  }
}
