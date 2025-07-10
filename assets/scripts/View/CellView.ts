import {
  _decorator,
  Component,
  instantiate,
  log,
  Node,
  Prefab,
  Sprite,
  tween,
  UITransform,
} from "cc";
import { CellModel } from "../Model/CellModel";
import { MapManager } from "../Data/MapManager";
import { Action, CellState } from "../Data/Consts";
const { ccclass, property } = _decorator;

@ccclass("CellView")
export class CellView extends Component {
  model: CellModel;

  @property({ type: Number, displayName: "行" })
  row: number = 0;
  @property({ type: Number, displayName: "列" })
  col: number = 0;
  uiTransform: UITransform;

  private _sprite: Sprite;

  protected onLoad(): void {
    this._sprite = this.node.getComponent(Sprite);
  }
  protected onDestroy(): void {
    this.unscheduleAllCallbacks();
  }
  initByViewModel(model: CellModel) {
    this.model = model;
    this.row = model.row;
    this.col = model.column;
    this.uiTransform = this.node.getComponent(UITransform);
    this.uiTransform.setContentSize(
      MapManager.Instance.cellWidth,
      MapManager.Instance.cellHeight
    );
    this.uiTransform.setAnchorPoint(0, 0);
    let position = MapManager.Instance.getCellPosition(model.row, model.column);
    console.log(
      "CellView: ",
      position,
      model.row,
      model.column,
      MapManager.Instance.cellWidth
    );
    this.node.setPosition(position);
  }

  protected update(dt: number): void {
    if (this.model.command.length == 0) return;
    let command = this.model.command.shift();
    log("CellView: ", command);
    this.scheduleOnce(() => {
      switch (command.action) {
        case Action.Move:
          tween(this.node)
            .to(command.playTime, {
              position: MapManager.Instance.getCellPosition(
                command.row,
                command.column
              ),
            })
            .start();
          break;
        // case CellState.Click.toString():
        //     // this.click();
        //     break;
        default:
          break;
      }
    }, command.delayTime);
  }
}
