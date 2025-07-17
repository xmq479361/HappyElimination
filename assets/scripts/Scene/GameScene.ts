import {
  _decorator,
  Component,
  Node,
  UITransform,
  input,
  Input,
  EventTouch,
  Label,
} from "cc";
import { MapManager } from "../Data/MapManager";
import { GridModel } from "../Model/GridModel";
import { Grid } from "../View/Grid";
const { ccclass, property } = _decorator;

@ccclass("GameScene")
export class GameScene extends Component {
  @property(Node)
  gridView: Node = null;
  @property(Label)
  scoreLabel: Label = null;

  grid: Grid = null;
  gridModel = new GridModel();
  _score : number = 0;

  private static instance: GameScene;
  public static get Instance() {
    return this.instance;
  }
  onLoad() {
    if (GameScene.instance != null) {
      this.node.destroy();
      return;
    }
    this.updateScore(this._score);
    GameScene.instance = this;
    this.grid = this.gridView.getComponent(Grid);
    this.grid.gridModel = this.gridModel;
  }
  protected start(): void {
    this.loadGameData();
  }

  loadGameData() {
    this.gridView.removeAllChildren();
    MapManager.Instance.init(5, 5);
    this.grid.initWithCellModels();
  }

  updateScore(score: number, delayTime: number) {
    this.scheduleOnce((_) => {
      this._score += score;
      this.scoreLabel.string = this._score.toString();
    }, delayTime)
  }
}
