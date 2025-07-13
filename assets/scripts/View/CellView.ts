import {
  _decorator,
  Animation,
  AnimationState,
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
  animation: Animation;

  private _sprite: Sprite;

  protected onLoad(): void {
    this._sprite = this.node.getComponent(Sprite);
    this.uiTransform = this.node.getComponent(UITransform);
    this.animation = this.node.getComponent(Animation);
  }
  protected onDestroy(): void {
    this.unscheduleAllCallbacks();
  }
  initByViewModel(model: CellModel) {
    this.model = model;
    this.row = model.row;
    this.col = model.column;
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
  cancelSelectedAnimation() {
  }

  isPlayingClick : boolean = false;

  protected update(dt: number): void {
    if (this.animation != null) {
        if (!this.isPlayingClick) {// this.animation.getState("cat_click").isPlaying) {
            if (this.model.isSelected) {
                this.isPlayingClick = true;
                this.animation.play();
            }
        } else  if (!this.model.isSelected) {
            this.isPlayingClick = false;
            this.animation.stop();
        }
    }
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
        case Action.Shake:
            
            let originalAngle = this.node.angle;
            let shakeDuration = command.playTime / 4;
            let shakeAngle = 5;
            tween(this.node)
            .to(shakeDuration, { angle: originalAngle + shakeAngle })
            .to(shakeDuration, { angle: originalAngle - shakeAngle })
            .to(shakeDuration, { angle: originalAngle + shakeAngle })
            .to(shakeDuration, { angle: originalAngle })
            .start();
                                     // 缓动的时长
        // tween(this.node.rotation).to( command.playTime, 1,    // 这里以node的位置信息坐标缓动的目标 
        //     {                                                               // ITweenOption 的接口实现：
        //     onUpdate : (target:Vec3, ratio:number)=>{                       // onUpdate 接受当前缓动的进度
        //         this.node.position = target;                                // 将缓动系统计算出的结果赋予 node 的位置
        //     }
        // }).start();            
        //   tween(this.node)
        //   .by()
        //     .to(command.playTime, {
        //       position: MapManager.Instance.getCellPosition(
        //         command.row,
        //         command.column
        //       ),
        //     })
        //     .start();
          break;
        case Action.Crush:
          this.animation.play("crush");
          this.scheduleOnce(() => {
            this.node.destroy();
          }, command.playTime);
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
