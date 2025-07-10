import { log, Vec2 } from "cc";
import { MapManager } from "../Data/MapManager";
import { CellModel } from "./CellModel";

export class GridModel  {
    private _cells: CellModel[][]

    private lastSelected: Vec2 = null;

    init() {
        this._cells = []
        for (let i = 0; i < MapManager.Instance.column; i++) {
            this._cells[i] = []
            for (let j = 0; j < MapManager.Instance.row; j++) {
                this._cells[i][j] = new CellModel()
                this._cells[i][j].init(i, j)
                this._cells[i][j].setType(Math.floor(Math.random() * 4))
            }
        }
    }
    get cells() {
        return this._cells
    }

    selectCell(index: Vec2): boolean {
        console.log("selectCell: ", index);
        let lastSelected = this.lastSelected;
        if (lastSelected == null) {
            this.cells[index.y][index.x].setSelected(true);
            this.lastSelected = index;
            return true;
        }
        let selectedIndexOffset =Math.abs(lastSelected.x - index.x) + Math.abs(lastSelected.y - index.y);
        if (selectedIndexOffset == 0) return;
        let currCell = this.cells[index.y][index.x];
        let lastCell = this.cells[lastSelected.y][lastSelected.x];
        /// 非相邻格子. 直接切换选中.
        if (selectedIndexOffset > 1) {
            this.lastSelected = index;
            lastCell.setSelected(false);
            currCell.setSelected(true);
            return true;
        }
        console.log("selectCell: 相邻格子. 直接切换.", currCell, lastCell);
        lastCell.moveTo(index);
        currCell.moveTo(lastSelected);
        this.cells[index.y][index.x] = lastCell;
        this.cells[lastSelected.y][lastSelected.x] = currCell;
        this.lastSelected = null;
        lastCell.setSelected(false);
        currCell.setSelected(false);
        return false;
    }
}


