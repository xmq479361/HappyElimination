import { _decorator, Component, Node } from 'cc';
import { MapManager } from '../Data/MapManager';
import { GridModel } from '../Model/GridModel';
import { Grid } from '../View/Grid';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    @property
    gridView: Node = null;

    gridModel: GridModel = new GridModel();
    onLoad() {
        MapManager.Instance.init(9, 9);
        this.gridModel.init();
        let grid = this.gridView.getComponent(Grid);
        grid.initWithCellModels(this.gridModel.cells);
    }

}


