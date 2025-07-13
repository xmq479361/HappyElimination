import { _decorator, Component, Node, UITransform, input, Input, EventTouch } from 'cc';
import { MapManager } from '../Data/MapManager';
import { GridModel } from '../Model/GridModel';
import { Grid } from '../View/Grid';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    @property(Node)
    gridView: Node = null;

    grid: Grid = null;
    gridModel =new GridModel();

    private static instance :GameScene;
    public static get Instance() {
        return this.instance;
    }
    onLoad() {
        if (GameScene.instance != null) {
            this.node.destroy();
            return;
        }
        GameScene.instance = this;
        this. grid = this.gridView.getComponent(Grid);
        this.grid.gridModel = this.gridModel;
      }
      protected start(): void {
        this.loadGameData();
      }
    
    loadGameData() {
        this.gridView.removeAllChildren();
        MapManager.Instance.init(4, 4);
        this.grid.initWithCellModels();
    }
}


