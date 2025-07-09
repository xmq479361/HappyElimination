export interface Command {
  action: string
  playTime: number
  row?: number
  column?: number
}
export enum CellState {
  None = 0,
  Click = "click",
  Row = "row",
  Column = "column"
}
