import { _decorator, Component, Node, instantiate, Prefab, log, input, Input, EventTouch } from "cc"
import { CellModel } from "../Model/CellModel"
import { CellView } from "./CellView"
const { ccclass, property } = _decorator

@ccclass("Grid")
export class Grid extends Component {
  @property({type: [Prefab], visible: true, displayName: "格子预制体"})
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

  protected onLoad(): void {
    this.gridPrefabs = [this.bearPrefab, this.catPrefab, this.horsePrefab, this.foxPrefab, this.frogPrefab]
  }

  initWithCellModels(models: CellModel[][]) {
    log("initWithCellModels: ", models);
    for (let i = 0; i < models.length; i++) {
      let rowModels = models[i]
      for (let j = 0; j < rowModels.length; j++) {
        // log("cellNode: ", i, j, rowModels[j].type);
        const cellNode = instantiate(this.gridPrefabs[rowModels[j].type])
        cellNode.parent = this.node;
        let cellView = cellNode.getComponent(CellView)
        cellView.initByViewModel(rowModels[j])
      }
    }
  }
}
