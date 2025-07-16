import { log, Vec2 } from "cc";
import { MapManager } from "../Data/MapManager";
import { CellModel } from "./CellModel";
import { AnimateTime, CellState } from "../Data/Consts";
import { Utils } from "../Utils/Utils";

export class GridModel {
  private _cells: CellModel[][];

  private lastSelected: Vec2 = null;

  private cellTypes: number[] = [];
  private typeCount: number;

  getRandomCellType(exclude: number[] = []) {
    let retryTimce = 0;
    while (true) {
      let newType = Math.floor(Math.random() * this.typeCount);
      if (exclude.indexOf(this.cellTypes[newType]) < 0)
        return this.cellTypes[newType];
      retryTimce++;
      if (retryTimce > 8) {
        console.log("随机类型失败", exclude, this.cellTypes);
        for (let i = 0; i < this.typeCount; i++) {
          if (exclude.indexOf(i) < 0) return i;
        }
        return 0;
      }
    }
  }
  init(typeCount: number = 5) {
    this._cells = [];
    this.typeCount = typeCount;
    for (let i = 0; i < typeCount; i++) {
      // let exchangeIndex = Math.floor(Math.random() * i)
      // this.cellTypes[i] = this.cellTypes[exchangeIndex]
      // this.cellTypes[exchangeIndex] = i
      this.cellTypes[i] = i;
    }
    for (let i = 0; i < MapManager.Instance.row; i++) {
      this._cells[i] = [];
      for (let j = 0; j < MapManager.Instance.column; j++) {
        this._cells[i][j] = new CellModel();
        this._cells[i][j].init(i, j);
      }
    }
    for (let i = 0; i < MapManager.Instance.row; i++) {
      for (let j = 0; j < MapManager.Instance.column; j++) {
        let canCleanFlag = true;
        let sameTypes = [];
        let retryTimce = 0;
        while (canCleanFlag && retryTimce < 9) {
          retryTimce++;
          let newType = this.getRandomCellType(sameTypes);
          this._cells[i][j].setType(newType);
          let samePoints = Utils.checkPoint(this._cells, new Vec2(j, i));
          canCleanFlag = samePoints.length >= 3;
        }
      }
    }
  }
  get cells() {
    return this._cells;
  }

  selectCell(index: Vec2) {
    console.log("selectCell: ", index);
    let lastSelected = this.lastSelected;
    if (!this.cells[index.y][index.x]) return;
    if (lastSelected == null) {
      this.cells[index.y][index.x].setSelected(true);
      this.lastSelected = index;
      return [];
    }
    let selectedIndexOffset =
      Math.abs(lastSelected.x - index.x) + Math.abs(lastSelected.y - index.y);
    if (selectedIndexOffset == 0) return;
    /// 非相邻格子. 直接切换选中.
    if (selectedIndexOffset != 1) {
      this.lastSelected = index;
      this.cells[lastSelected.y][lastSelected.x].setSelected(false);
      this.cells[index.y][index.x].setSelected(true);
      return [];
    }
    this.exchangeCells(index, this.lastSelected);
    let currCell = this.cells[index.y][index.x];
    let lastCell = this.cells[lastSelected.y][lastSelected.x];
    let currSameTypePoints = Utils.checkPoint(this._cells, index);
    let lastSameTypePoints = Utils.checkPoint(this._cells, this.lastSelected);
    console.log("lastSameTypePoints", lastSameTypePoints);
    this.lastSelected = null;

    let crushPoints = [];
    if (currSameTypePoints.length < 2 && lastSameTypePoints.length < 2) {
      lastCell.moveToAndBack(index);
      currCell.moveToAndBack(lastSelected);
      this.exchangeCells(index, this.lastSelected);
      lastCell.setSelected(false);
      currCell.setSelected(false);
      return [];
    }
    lastCell.moveTo(lastSelected);
    currCell.moveTo(index);
    if (currSameTypePoints.length > 2) {
      crushPoints = crushPoints.concat(currSameTypePoints);
    }
    if (lastSameTypePoints.length > 2) {
      crushPoints = crushPoints.concat(lastSameTypePoints);
    }
    console.log("crushPoints", crushPoints);
    let timeDelay = AnimateTime.TOUCH_MOVE + AnimateTime.DIE;
    let effectCells = this.performCrush(crushPoints, timeDelay);
    return [crushPoints, effectCells];
  }

  // 处理消除逻辑
  performCrush(effectPoints: Vec2[], timeDelay: number): Array<CellModel> {
    console.log("performCrush: ", effectPoints);
    let effectCells = effectPoints.map((p) => this.cells[p.y][p.x]);
    effectPoints.forEach((p) => {
      if (this.cells[p.y][p.x]) {
        this.cells[p.y][p.x].crush(timeDelay);
        this.cells[p.y][p.x] = null;
      }
    });
    timeDelay += 1;
    let downEffectCells = this.performDown(timeDelay);
    let resultCells: CellModel[] = effectCells.concat(downEffectCells);
    timeDelay += AnimateTime.DOWN;
    let downPoints = downEffectCells.map((p) => p.toPoint()).concat(effectPoints);
    console.log("downPoints: ", downPoints);
    /// 下落后再次检测是否有可消除的元素
    // 如果有可消除的元素，则将其加入到effectPoints中
    let currEffectPoints: Vec2[] = [];
    downPoints.forEach((p) => {
      console.log("performCrush cycle: ", p);
      let samePoints = Utils.checkPoint(this._cells, p);
      if (samePoints.length > 2) {
        currEffectPoints = currEffectPoints.concat(samePoints);
      }
    });
    currEffectPoints = Utils.unionPoints(currEffectPoints);
    log("currEffectPoints: ", currEffectPoints.length);
    // 递归处理可消除的元素
    if (currEffectPoints.length > 0) {
      log("递归处理可消除的元素: ", currEffectPoints);
      let otherCells = this.performCrush(currEffectPoints, timeDelay + 1.5);
      resultCells = resultCells.concat(otherCells);
    }
    return Utils.unionCells(resultCells);
  }

  printInfo() {
    for (var i = 1; i <= 9; i++) {
      var printStr = "";
      for (var j = 1; j <= 9; j++) {
        printStr += this.cells[i][j].type + " ";
      }
      console.log(printStr);
    }
  }
  performDown(timeDelay: number) {
    let effectCells = [];
    // 处理每一列的下落逻辑
    for (let col = 0; col < MapManager.Instance.column; col++) {
      let emptyCount = 0;
      // 从底部向上遍历
      // [1, 2, ,4, ]
      //   row    ec   target   value
      // # 4      0
      // # 3      1    4        4
      // # 2      1
      // # 1      2    3        2
      // # 0      2    2        1
      for (let row = MapManager.Instance.row - 1; row >= 0; row--) {
        let cellModel = this._cells[row][col];

        // 如果当前位置是空的或已消除的，增加空位计数
        if (cellModel == null || cellModel.isDeath) {
          emptyCount++;
        }
        // 如果当前位置有有效的cell且有空位，则需要下落
        else if (emptyCount > 0) {
          // 将cell下移emptyCount个位置
          let targetRow = row + emptyCount;
          cellModel.setPoint(new Vec2(col, row));
          cellModel.moveTo(
            new Vec2(col, targetRow),
            AnimateTime.DOWN,
            timeDelay
          );
          this._cells[targetRow][col] = cellModel;
          this._cells[row][col] = null;
          effectCells.push(cellModel);
        }
      }
      if (emptyCount == 0) continue;
      console.log("create: ", col, "emptyCount:", emptyCount);
      // 在顶部添加新的cell
      // 补充新的cell, 并处理下落逻辑
      // # -2     2   0        x
      // # -1     2   1        x
      for (let i = 0; i < emptyCount; i++) {
        let row = i;
        let cellModel = new CellModel();
        cellModel.init(row, col);
        cellModel.setType(this.getRandomCellType());
        cellModel.setOffset(new Vec2(0, -emptyCount));
        cellModel.setVisible(false, 0, 0)
        cellModel.setVisible(true, 0, timeDelay - AnimateTime.DOWN)
        cellModel.moveTo(new Vec2(col, row), AnimateTime.DOWN, timeDelay);
        this._cells[row][col] = cellModel;
        effectCells.push(cellModel);
      }
    }
    return effectCells;
  }
  exchangeCells(pos1: Vec2, pos2: Vec2) {
    var tmpModel = this.cells[pos1.y][pos1.x];
    this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
    this.cells[pos1.y][pos1.x].setPoint(pos1);
    this.cells[pos2.y][pos2.x] = tmpModel;
    this.cells[pos2.y][pos2.x].setPoint(pos2);
  }
}
