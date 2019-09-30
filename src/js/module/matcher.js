import { gameRules } from '../../index';
import { gameArray, rune, removeMap, gameManager } from '../scene/gameplay/gameplay_scene_controller';

// static flag for horizontal & vertical
const HORZ = 1;
const VERT = 2;

export default class RuneMatcher extends Phaser.Scene {
	constructor(){
		super('matcher');
	}
	
	create(){
	}

	// bool function is the rune Match?
    isMatch(row, col)
    {
      return this.horzMatch(row, col) || this.vertMatch(row, col);
    }

    // separate function of 'isMatch' : is horizontal match?
    horzMatch(row, col)
    {
      return rune.runeAt(row, col).runeType == rune.runeAt(row, col-1).runeType && rune.runeAt(row, col).runeType == rune.runeAt(row, col-2).runeType;
    }

    // separate function of 'isMatch' : is vertical match?
    vertMatch(row, col)
    {
      return rune.runeAt(row, col).runeType == rune.runeAt(row-1, col).runeType && rune.runeAt(row, col).runeType == rune.runeAt(row-2, col).runeType;
    }

    // bool function to check is there Match-3 in the board?
    isMatches()
    {
      for(let i = 0; i < gameRules.fieldSize; i++){
        for(let j = 0; j < gameRules.fieldSize; j++){
          // check if there is match three around board
          if(this.isMatch(i, j)){
            return true;
          }
        }
      }
      return false;
    }
}