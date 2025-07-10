import {
  _decorator,
  Component,
  Node,
  instantiate,
  Prefab,
  log,
  input,
  Input,
  EventTouch,
  UITransform
} from "cc"
import { CellModel } from "../Model/CellModel"
import { CellView } from "./CellView"
import { MapManager } from "../Data/MapManager"
import { GameScene } from "../Scene/GameScene"
import { GridModel } from "../Model/GridModel"
const { ccclass, property } = _decorator

@ccclass("Grid")
export class Grid extends Component {
  gridPrefabs: Prefab[]
  @property(Prefab)
  bearPrefab: Prefab = null
  @property(Prefab)
  catPrefab: Prefab = null
  @property(Prefab)
  horsePrefab: Prefab = null
  @property(Prefab)
  foxPrefab: Prefab = null
  @property(Prefab)
  frogPrefab: Prefab = null
  private isCanMove: boolean = false
  private touchEnable: boolean = true
  gridUITransform: UITransform
  gridModel: GridModel
  protected onLoad(): void {
    this.gridPrefabs = [
      this.bearPrefab,
      this.catPrefab,
      this.horsePrefab,
      this.foxPrefab,
      this.frogPrefab
    ]
    this.gridUITransform = this.getComponent(UITransform)
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.touchEnable = true
    let box = this.gridUITransform.getBoundingBoxToWorld();
    MapManager.Instance.initBox(box);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this)
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
  }

  onTouchStart(event: EventTouch) {
    if (!this.touchEnable) return
    let gridPos = this.gridUITransform.convertToNodeSpaceAR(
      event.getUILocation().toVec3()
    )
    let index = MapManager.Instance.getCellIndex(gridPos.x, gridPos.y)
    if (
      index.x < 0 ||
      index.x >= MapManager.Instance.column ||
      index.y < 0 ||
      index.y >= MapManager.Instance.row
    )
      return
    console.log("onTouchStart : ", gridPos, index)
    this.gridModel.selectCell(index)
  }
  onTouchMove(event: EventTouch) {
    if (!this.touchEnable) return
    let gridPos = this.gridUITransform.convertToNodeSpaceAR(
      event.getUILocation().toVec3()
    )
    let index = MapManager.Instance.getCellIndex(gridPos.x, gridPos.y)
    console.log("onTouchMove : ", gridPos, index)
    if (
      index.x < 0 ||
      index.x >= MapManager.Instance.column ||
      index.y < 0 ||
      index.y >= MapManager.Instance.row
    )
      return
    if (this.gridModel.selectCell(index) == false) {
      this.disableTouchEvent()
    }
  }
  disableTouchEvent() {
    console.log("disableTouchEvent : ")
    this.touchEnable = false
    this.scheduleOnce(() => {
      this.touchEnable = true
    }, 0.5)
  }
  initWithCellModels(models: CellModel[][]) {
    this.gridModel.init();
    for (let i = 0; i < models.length; i++) {
      let rowModels = models[i]
      for (let j = 0; j < rowModels.length; j++) {
        const cellNode = instantiate(this.gridPrefabs[rowModels[j].type])
        cellNode.parent = this.node
        let cellView = cellNode.getComponent(CellView)
        cellView.initByViewModel(rowModels[j])
      }
    }
  }
}
