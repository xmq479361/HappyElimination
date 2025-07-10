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
    gridUITransform: UITransform = null;
    onLoad() {
        this. grid = this.gridView.getComponent(Grid);
        this.gridUITransform = this.gridView.getComponent(UITransform);
        let box = this.gridUITransform.getBoundingBoxToWorld();
        MapManager.Instance.initBox(box);
        this.loadGameData();
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
      }
      protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
      }  
      
      onTouchStart(event: EventTouch) {
        let gridPos = this.gridUITransform.convertToNodeSpaceAR(event.getUILocation().toVec3());
        let index = MapManager.Instance.getCellIndex(gridPos.x, gridPos.y);
        console.log("onTouchStart : ", gridPos, index);
        this.gridModel.selectCell(index);
      }
      onTouchMove(event: EventTouch) { 
      }
    
    loadGameData() {
        this.gridView.removeAllChildren();
        MapManager.Instance.init(3, 3);
        this.gridModel.init();
        this.grid.initWithCellModels(this.gridModel.cells);
    }
}


