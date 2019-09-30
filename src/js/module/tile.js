import { gameRules } from '../../index';
import { gameArray } from '../scene/gameplay/gameplay_scene_controller';


class RuneTile extends Phaser.GameObjects.Sprite{
	
	
	constructor(config){
		super(config.scene, config.x, config.y, config.key);
        config.scene.add.existing(this);
	}

	// get only the rune column position
    getRuneCol(rune){
      return Math.floor(rune.runeSprite.x/1.2 / gameRules.runeSize);
    }

    // get only the rune row position
    getRuneRow(rune){
      return Math.floor(rune.runeSprite.y / gameRules.runeSize);
    }

    // bool function to check is the current selected is the same object with before selected
    areSame(runeA, runeB)
    {
      return this.getRuneRow(runeA) == this.getRuneRow(runeB) && this.getRuneCol(runeA) == this.getRuneCol(runeB);
    }

    // bool function to check is the current selected is the next with before selected rune
    areNext(runeA, runeB)
    {
      return Math.abs(this.getRuneRow(runeA) - this.getRuneRow(runeB)) + Math.abs(this.getRuneCol(runeA) - this.getRuneCol(runeB)) == 1;
    }

    // find the rune position X & Y coordinates
    runeAt(row, col)
    {
      // console.log(row);
      // console.log(col);
      // if (row or col lower than 0) or (row or col higher than the game field size)
      if(row < 0 || row >= gameRules.fieldSize || col < 0 || col >= gameRules.fieldSize){
        // error flags, position is not exist
        return -1;
      }
      
      // send the rune coordinates
      return gameArray[row][col];
    }	
}
export default RuneTile;