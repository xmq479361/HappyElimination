import { _decorator, Component, Node, Prefab } from 'cc';
import { Action, Command } from '../Data/Consts';
const { ccclass, property } = _decorator;

@ccclass('EffectLayer')
export class EffectLayer extends Component {

    @property(Prefab)
    crushEffectPrefab: Prefab = null;

    play(effectQueue: Command[]) {
        for (let command of effectQueue) {
            switch (command.action) {
                case Action.Crush:
                    break;
                default:
                    break;
            }
        }
    }



}


