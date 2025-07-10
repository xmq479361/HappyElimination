import { log, Vec2 } from "cc"
import { Action, AnimateTime, CellState, Command } from "../Data/Consts"

export class CellModel {
  private _state: CellState = CellState.None
  private _row: number = 0
  private _column: number = 0
  public type: number = 0
  public isSelected: boolean = false
  command: Command[] = [];

  init(row: number, column: number) {
    this._row = row
    this._column = column
  }
  setType(type: number) {
    this.type = type
  }

  setSelected(value: boolean) {
    this.isSelected = value
  }
  get row() {
    return this._row
  }

  get column() {
    return this._column
  }

  moveTo(target: Vec2) {
    log("moveTo:", this.row, this.column, target.x, target.y)
    this.command.push({
      action: Action.Move,
      playTime: AnimateTime.TOUCH_MOVE,
      row: target.y,
      column: target.x
    })
    this._row = target.y
    this._column = target.x
  }
  moveToAndBack(target: Vec2) {
    this.command.push({
      action: Action.Move,
      playTime: AnimateTime.TOUCH_MOVE,
      row: target.y,
      column: target.x
    })
    this.command.push({
      action: Action.Move,
      playTime: AnimateTime.TOUCH_MOVE,
      delayTime: AnimateTime.TOUCH_MOVE,
      row: this._row,
      column: this._column
    })
    // this._row = target.y
    // this._column = target.x
  }
}
