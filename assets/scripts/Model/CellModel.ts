import { CellState } from "../Data/Consts"

export class CellModel {
  private _state: CellState = CellState.None
  private _row: number = 0
  private _column: number = 0
  public type: number = 0
  private isDeath: boolean = false

  init(row: number, column: number) {
    this._row = row
    this._column = column
  }
  setType(type: number) {
    this.type = type
  }

  get row() {
    return this._row
  }

  get column() {
    return this._column
  }
}
