import { MapManager } from "../Data/MapManager";
import { CellModel } from "./CellModel";

export class GridModel  {
    private _cells: CellModel[][] = []

    init() {
        this._cells = []
        for (let i = 0; i < MapManager.Instance.row; i++) {
            this._cells[i] = []
            for (let j = 0; j < MapManager.Instance.column; j++) {
                this._cells[i][j] = new CellModel()
            }
        }
        for (let i = 0; i < MapManager.Instance.row; i++) {
            for (let j = 0; j < MapManager.Instance.column; j++) {
                this._cells[i][j].init(i, j)
                this._cells[i][j].setType(Math.floor(Math.random() * 4))
            }
        }
    }
    get cells() {
        return this._cells
    }
}


