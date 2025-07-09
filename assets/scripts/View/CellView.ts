import { _decorator, Component,instantiate, Node, Prefab, Sprite } from 'cc';
import { CellModel } from '../Model/CellModel';
const { ccclass, property } = _decorator;

@ccclass('CellView')
export class CellView extends Component {
    model: CellModel;
    
    private _sprite: Sprite;

    protected onLoad(): void {
        this._sprite = this.node.getComponent(Sprite);
    }
    initByViewModel(model: CellModel) {
        this.model = model
    }
}


