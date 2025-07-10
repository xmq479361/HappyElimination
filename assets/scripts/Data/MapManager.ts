import {
  _decorator,
  Component,
  log,
  math,
  Node,
  Rect,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
export class MapManager {
  static _Instance: MapManager;

  static get Instance() {
    if (!MapManager._Instance) {
      console.log("MapManager init: ");
      MapManager._Instance = new MapManager();
    }
    return MapManager._Instance;
  }
  initBox(box: Rect) {
    console.log("MapManager: ", box);
    this._gridWidth = box.width;
    this._gridHeight = box.height;
  }
  init(column: number, row: number) {
    this._column = column;
    this._row = row;
    let showSize = Math.min(this._gridWidth, this._gridHeight);
    let showItemSize = Math.max(column, row);
    this._cellHeight = this._cellWidth = showSize / showItemSize;
    this._offsetX = this._offsetY = 0;
    this._offsetX = (-column / 2.0) * this._cellWidth;
    this._offsetY = (row / 2.0 - 1) * this._cellHeight;
    /// 列数大于行数时，X轴偏移
    // if (column > row) {
    //     this._offsetX += this._cellWidth * (column - row) / 2;
    // } else if (row > column) {
    //     /// 行数大于列数时，Y轴偏移
    //     this._offsetY += this._cellHeight * (row - column) / 2;
    // }
    /// row: 0 => 160,  row: 1 => 0, row: 2 => -160, row: 3 => -320
    /// col: 0 => -320, col: 1 => -160, col: 2 => 0, col: 3 => 160
    /// cellWidth: 160, cellHeight: 160,
    /// col: 0~3,  -320 ~ -160,  => cellHeight * (col - this.column/2) => 160 *(col - 2)
    /// row: 0~3,  160 ~ -320,  => cellHeight * (this.row/2 - 1 - row ) => 160 *(1 - row)
    console.log(
      "Map init:: ",
      this._offsetX,
      this._offsetY,
      showSize,
      showItemSize,
      this.row,
      "x",
      this.column,
      this._cellWidth,
      "x",
      this._cellHeight,
      this.row / 2.0 + 1,
      this.column / 2.0
    );
  }
  getCellPosition(row: number, column: number): Vec3 {
    return new Vec3(
      column * this._cellWidth + this._offsetX,
      this._offsetY - row * this._cellHeight,
      0
    );
  }
  public getCellIndex(x: number, y: number): Vec2 {
    return new Vec2(
      Math.floor((x - this._offsetX) / this._cellWidth),
      Math.floor((this._offsetY - y) / this._cellHeight) + 1
    );
  }
  /// 列数
  private _column: number;
  /// 行数
  private _row: number;
  private _gridWidth: number;
  private _gridHeight: number;
  private _cellWidth: number;
  private _cellHeight: number;
  private _offsetX: number;
  private _offsetY: number;

  public get column(): number {
    return this._column;
  }
  public get row() {
    return this._row;
  }
  public get cellWidth() {
    return this._cellWidth;
  }
  public get cellHeight() {
    return this._cellHeight;
  }
  public get gridWidth() {
    return this._gridWidth;
  }
  public get gridHeight() {
    return this._gridHeight;
  }
}
