export interface Command {
  action: string | Action;
  /// 执行时间
  playTime: number;
  /// 延迟执行时间
  delayTime?: number;
  row?: number;
  column?: number;
  isVisible?: boolean;
}
export enum CellState {
  None = 0,
  Click = "click",
  Move = "move",
  Row = "row",
  Column = "column",
}
export enum Action {
  Move = "move",
  Click = "click",
  Crush = "crush",
  Shake = "shake",
}

// ********************   时间表  animation time **************************
export const AnimateTime = {
  TOUCH_MOVE: 0.3,
  DIE: 0.2,
  DOWN: 0.5,
  BOMB_DELAY: 0.3,
  BOMB_BIRD_DELAY: 0.7,
  DIE_SHAKE: 0.4, // 死前抖动
};
