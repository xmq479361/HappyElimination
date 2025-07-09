import { _decorator, Component, Node, instantiate, Prefab } from "cc"
import { CellModel } from "../Model/CellModel"
import { CellView } from "./CellView"
const { ccclass, property } = _decorator

@ccclass("Grid")
export class Grid extends Component {
  @property(Prefab)
  prefabs: Prefab[]

  initWithCellModels(models: CellModel[][]) {
    for (let i = 0; i < models.length; i++) {
      let rowModels = models[i]
      for (let j = 0; j < rowModels.length; j++) {
        const cellNode = instantiate(this.prefabs[rowModels[j].type])
        cellNode.addChild(cellNode)
        let cellView = cellNode.getComponent(CellView)
        cellView.initByViewModel(rowModels[j])
      }
    }
  }
}
