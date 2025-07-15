import { log, Vec2 } from "cc";
import { Action, AnimateTime, CellState, Command } from "../Data/Consts";

export class CellModel {
  private _state: CellState = CellState.None;
  private _row: number = 0;
  private _column: number = 0;
  public type: number = -1;
  public isSelected: boolean = false;
  isDeath: boolean = false;
  isAttach: boolean = false;
  command: Command[] = [];

  init(row: number, column: number) {
    this._row = row;
    this._column = column;
  }
  setType(type: number) {
    this.type = type;
  }

  setSelected(value: boolean) {
    this.isSelected = value;
  }
  setPoint(point: Vec2) {
    this._row = point.y;
    this._column = point.x;
  }
  get row() {
    return this._row;
  }

  get column() {
    return this._column;
  }

  moveTo(
    target: Vec2,
    playTime = AnimateTime.TOUCH_MOVE,
    delayTime: number = 0
  ) {
    log(
      "moveTo:",
      this.row,
      "X",
      this.column,
      "=>",
      target.y,
      "X",
      target.x,
      " delayTime:",
      delayTime
    );
    this.command.push({
      action: Action.Move,
      playTime: playTime,
      delayTime: delayTime,
      row: target.y,
      column: target.x,
    });
    // this._row = target.y;
    // this._column = target.x;
  }
  moveToAndBack(target: Vec2) {
    log("moveToAndBack:", this.column, this.row, target.x, target.y);
    this.command.push({
      action: Action.Move,
      playTime: AnimateTime.TOUCH_MOVE,
      row: this._row,
      column: this._column,
    });
    this.command.push({
      action: Action.Shake,
      playTime: AnimateTime.TOUCH_MOVE,
      delayTime: AnimateTime.TOUCH_MOVE,
      row: target.y,
      column: target.x,
    });
    this.command.push({
      action: Action.Move,
      playTime: AnimateTime.TOUCH_MOVE,
      delayTime: AnimateTime.TOUCH_MOVE * 2, //  + 0.2,
      row: target.y,
      column: target.x,
    });
    // this._row = target.y
    // this._column = target.x
  }
  crush() {
    this.isDeath = true;
    log("crush:", this.row, this.column, this.type);
    this.command.push({
      action: Action.Crush,
      playTime: AnimateTime.DIE,
      delayTime: AnimateTime.TOUCH_MOVE,
    });
  }
  toDie(playTime) {
    this.command.push({
      action: "toDie",
      playTime: playTime,
      delayTime: AnimateTime.DIE,
    });
    this.isDeath = true;
  }

  toShake(playTime) {
    this.command.push({
      action: Action.Shake,
      playTime: playTime,
      delayTime: AnimateTime.DIE_SHAKE,
    });
  }

  setVisible(playTime, isVisible) {
    this.command.push({
      action: "setVisible",
      playTime: playTime,
      delayTime: 0,
      isVisible: isVisible,
    });
  }

  toString() {
    return this.column + "X" + this.row + "(" + this.type + ")";
  }
}
