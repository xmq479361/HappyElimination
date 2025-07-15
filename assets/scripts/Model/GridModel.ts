import { log, Vec2 } from "cc";
import { MapManager } from "../Data/MapManager";
import { CellModel } from "./CellModel";
import { AnimateTime, CellState } from "../Data/Consts";

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
          let newType = this.getRandomCellType(sameTypes);
          retryTimce++;
          this._cells[i][j].setType(newType);
          let samePoints = this.checkPoint(new Vec2(j, i));
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
    console.log(
      "selectCell: 相邻格子. ",
      selectedIndexOffset,
      index,
      this.lastSelected
    );

    this.exchangeCells(index, this.lastSelected);
    let currCell = this.cells[index.y][index.x];
    let lastCell = this.cells[lastSelected.y][lastSelected.x];
    let currSameTypePoints = this.checkPoint(index);
    let lastSameTypePoints = this.checkPoint(this.lastSelected);
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
    let effectCells = this.performCrush(crushPoints);
    return [crushPoints, effectCells];
  }

  checkPoint(point: Vec2) {
    let colPoints = this.checkWithDirection(point, [
      new Vec2(1, 0),
      new Vec2(-1, 0),
    ]);
    let rowPoints = this.checkWithDirection(point, [
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
    colPoints.push(point.clone());
    let points = colPoints.concat(rowPoints);
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
    let samePoints = [];
    for (let i = 0; i < points.length; i++) {
      if (samePoints.indexOf(points[i]) == -1) {
        samePoints.push(points[i]);
        result.push(points[i]);
      }
    }
    return result;
  }

  checkWithDirection(point: Vec2, direction: Vec2[]) {
    let result = [];
    let currType = this.cells[point.y][point.x].type;
    console.log("checkWithDirection:", currType, point);
    // result.push(point.clone())
    for (let i = 0; i < direction.length; i++) {
      let offset = direction[i];
      let newPoint = point.clone().add(offset);
      while (MapManager.Instance.validOffset(newPoint)) {
        // console.log(
        //   "\t==check:",
        //   offset,
        //   newPoint,
        //   this.cells[newPoint.y][newPoint.x].type
        // )
        if (this.cells[newPoint.y][newPoint.x].type != currType) break;

        result.push(newPoint);
        newPoint = newPoint.clone().add(offset);
      }
    }
    return result;
  }

  performCrush(crushItems: Vec2[]): Array<CellModel> {
    console.log("performCrush: ", crushItems);
    crushItems.forEach((p) => {
      if (this.cells[p.y][p.x]) {
        this.cells[p.y][p.x].crush();
        this.cells[p.y][p.x] = null;
      }
    });
    let effectCells = [];
    let downTimeDelay = AnimateTime.TOUCH_MOVE + AnimateTime.DIE;
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

      // # -2      2   0        x
      // # -1      2   1        x
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
            downTimeDelay
          );
          this._cells[targetRow][col] = cellModel;
          this._cells[row][col] = null;
          effectCells.push(cellModel);
        }
      }

      // 在顶部添加新的cell
      for (let i = 0; i < emptyCount; i++) {
        let row = i;
        let cellModel = new CellModel();
        cellModel.init(row - emptyCount, col);
        cellModel.setType(this.getRandomCellType());
        cellModel.setPoint(new Vec2(col, row - emptyCount));
        cellModel.moveTo(new Vec2(col, row), AnimateTime.DOWN, downTimeDelay);
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
