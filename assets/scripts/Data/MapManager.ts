import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapManager')
export class MapManager extends Component {
    static Instance: MapManager;

    onLoad() {
        if (!MapManager.Instance) {
            MapManager.Instance = this;
        } else {
            this.destroy();
        }
    }
    protected start(): void {
        const box = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        this._gridWidth = box.width;
        this._gridHeight = box.height;
    }
    private _column: number;
    private _row: number;
    private _cellWidth: number;
    private _cellHeight: number;
    private _gridWidth: number;
    private _gridHeight: number;

    public get column(): number {
        return this._column;
    }
    public get row() {
        return this._row;
    }
    public get cellWidth() {
        return this._gridWidth / this.column;
    }
    public get cellHeight() {
        return this._gridHeight / this.row;
    }
    public get gridWidth() {
        return this._gridWidth;
    }
    public get gridHeight() {
        return this._gridHeight;
    }

    init(column: number, row: number) {
        this._column = column;
        this._row = row;
    }

    public getCellIndex(x: number, y: number): Vec2 {
        return new Vec2(Math.floor(x / this._cellWidth), (Math.floor(y / this._cellHeight) * this._column));
    }

    getCellPosition(row: number, column: number): Vec2 {
        return new Vec2(column * this._cellWidth, row * this._cellHeight);
    }

}


