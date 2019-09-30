import Phaser from 'phaser';
import { gameRules } from '../../../index';
import RuneTile from "../../module/tile";
import RuneMatcher from "../../module/matcher";

// declare the game array (rune data)
export let gameArray = [];
export let removeMap = [];
export let rune;
export let gameManager;

// static flag for horizontal & vertical
const HORZ = 1;
const VERT = 2;

// gameplay_controller.js
export default class GameplaySceneController extends Phaser.Scene {
	constructor(){
        super(
        {
            key: 'GameplayScene'
        });

        this.timer = 60;
        this.score = 0;
    }

    preload = () => {
       
    }
    
    create = () => {
      // create the background
      let bg = this.add.sprite(0, 0, 'background');
      bg.setOrigin(0,0);
      bg.setScale(1.5);

      // call the orientation checker, set the game field.
      this.checkOriention(this.scale.orientation);
      this.scale.on('orientationchange', this.checkOriention, this);

      // // create score & timer text
      // this.timerText = this.add.text(30,920, this.timer, {fontSize: '100px', fill:'#FFFFFF'});
      // this.scoreText = this.add.text(30,1020, 'Score: '+ this.score, {fontSize: '50px', fill:'#FFFFFF'});
      
      // draw field of runes
      this.drawFields();

      // declare flags: is can select?, is dragging?, and the first selected rune
      this.canSelect = true;
      this.dragging = false;
      this.firstSelected = null;

      
      // create input handler for pointer
      // click control
      this.input.on("pointerdown", this.runeSelect, this);
      
      // swipe control
      this.input.on("pointermove", this.startSwipe, this);
      this.input.on("pointerup", this.stopSwipe, this);
    }

    // Check for orientation mode (potrait or landscape?)
    checkOriention = (orientation) =>{
        if (orientation === Phaser.Scale.PORTRAIT)
        {
          // create score & timer text
          this.timerText = this.add.text(30,920, this.timer, {fontSize: '100px', fill:'#FFFFFF'});
          this.scoreText = this.add.text(30,1020, 'Score: '+ this.score, {fontSize: '50px', fill:'#FFFFFF'});
        }
        else if (orientation === Phaser.Scale.LANDSCAPE)
        {
            // create score & timer text
          this.timerText = this.add.text(1100,30, this.timer, {fontSize: '100px', fill:'#FFFFFF'});
          this.scoreText = this.add.text(1100,120, 'Score: '+ this.score, {fontSize: '50px', fill:'#FFFFFF'});
        }
    }

    // update function for timer
    update = () => {
      if(this.timer > 0){
        this.timer -= 1/60;
        this.timerText.setText(parseInt(this.timer));
      }else{
        this.gameOver();
      }
    }

    gameOver = () => {
      // shake the camera
      this.cameras.main.shake(500);


      //fade camera
      this.time.delayedCall(250, function(){
        this.cameras.main.fade(250);
      }, [], this);

      // restart the game
      this.time.delayedCall(500, function(){
        this.scene.restart();
      }, [], this);

      this.timer = 60;
      this.score = 0;
    }

    // adding score while  match three
    addScore = (streak) => {
      let getScore = 10;
      // console.log('Str' + streak);
      this.score += streak*getScore;
      this.scoreText.setText('Score: '+ this.score);
    }

    // render the field of games
    drawFields = () => {
      let depth = 0;
      
      // gameArray = [];
      // declare the pool of game array
      this.poolArray = [];

      this.matcher = new RuneMatcher();

      // create a group of runes
      // runeGroup = this.add.group();
      // row loop
      for(let i = 0; i < gameRules.fieldSize; i++){
        // inisialize the row game array
        gameArray[i] = [];
        // col loop
        
        for(let j = 0; j < gameRules.fieldSize; j++){
          // add rune to the group
          rune = new RuneTile({
            scene: this,
            x: (gameRules.runeSize * j + gameRules.runeSize / 2)*1.2,
            y: (gameRules.runeSize * i + gameRules.runeSize / 2),
            key: 'runes'
          });
        // this.add.sprite(runeRules.runeSize * j + runeRules.runeSize / 2, runeRules.runeSize * i + runeRules.runeSize / 2, "runes"); 

          // runeGroup.add(rune);
          // do this!
          do{
            // create a random rune condition
            let randomRune = Phaser.Math.Between(0, gameRules.runeTypes - 1);
            // set the rune frame with the random result data
            rune.setFrame(randomRune);
            // fill the rune data to game array
            gameArray[i][j] = {
              runeType: randomRune,
              runeSprite: rune,
              isEmpty: false
            }
          }
          // while there is a match 3, random again
          while(this.matcher.isMatch(i, j));

          gameArray[i][j].runeSprite.setDepth(depth)
        }
        depth++;
      }
    }

    // function to select the rune on the fields
    runeSelect = (pointer) => {
      // only if can select
      if(this.canSelect){
        // can dragging the selected rune
        this.dragging = true;
        
        // declare the rune row & col position, based on normalize coordinate
        let col = Math.floor((pointer.x / gameRules.runeSize)/1.2);
        let row = Math.floor((pointer.y / gameRules.runeSize));
        
        // set the selected rune coordinate
        let selectedRune = rune.runeAt(row, col);
        // console.log(selectedRune.runeSprite.x);

        // if the selected rune position is exist
        if(selectedRune != -1){
          // if select nothing
          if(this.firstSelected == null){
            // select!
            selectedRune.runeSprite.setScale(1.1);
            selectedRune.runeSprite.setDepth(100);
            this.firstSelected = selectedRune;
          // if the rune selected
          }else{
            // if select the same rune, back to select nothing
            if(rune.areSame(selectedRune, this.firstSelected)){
              this.firstSelected.runeSprite.setScale(1);
              this.firstSelected = null;
            // if the two selected is not same
            }else{
              // if the another selected is next to the before selected
              if(rune.areNext(selectedRune, this.firstSelected)){
                // swap!
                this.firstSelected.runeSprite.setScale(1);
                this.swapRunes(this.firstSelected, selectedRune, true);
              // if not, select the another rune
              }else{
                this.firstSelected.runeSprite.setScale(1);
                selectedRune.runeSprite.setScale(1.1);
                this.firstSelected = selectedRune;
              }
            }
          }
        }
      }
    }

    // function to start-swipe the rune horizontal or vertically
    startSwipe = (pointer) => {
      // if player dragging & first rune is selected
      if(this.dragging && this.firstSelected != null){
        // declare the delta (x or y first down - x or y current position)
        let deltaX = pointer.downX - pointer.x;
        let deltaY = pointer.downY - pointer.y;

        // also declare delta row and column (flags)
        let deltaRow = 0;
        let deltaCol = 0;

        // if the pointer dragged left
        if(deltaX > gameRules.runeSize/2 && Math.abs(deltaY) < gameRules.runeSize/2){
          deltaCol = -1;
        }

        // if pointer dragged right
        if(deltaX < -gameRules.runeSize/2 && Math.abs(deltaY) < gameRules.runeSize/2){
          deltaCol = 1;
        }

        // if pointer dragged up
        if(deltaY > gameRules.runeSize/2 && Math.abs(deltaX) < gameRules.runeSize/2){
          deltaRow = -1;
        }

        // if pointer dragged down
        if(deltaY < -gameRules.runeSize/2 && Math.abs(deltaX) < gameRules.runeSize/2){
          deltaRow = 1;
        }

        // if pointer dragged
        if(deltaRow+deltaCol != 0){
          // add the current coordinate with delta row and column
          let selectedRune = rune.runeAt(rune.getRuneRow(this.firstSelected) + deltaRow, rune.getRuneCol(this.firstSelected) + deltaCol);
          
          // if not null, swap
          if(selectedRune != -1){
            this.firstSelected.runeSprite.setScale(1);
            this.swapRunes(this.firstSelected, selectedRune, true);
          }
        }
      }
    }

    // function to stop the started-swipe rune
    stopSwipe = () => {
      this.dragging = false;
    }

    // swap runes function
    swapRunes = (runeA, runeB, swapBack) => {
      // state flag for tween rune
      this.swappingRunes = 2;
      // cannot select when the rune is swap
      this.canSelect = false;

      this.dragging = false;
      
      // from rune (types & sprite)
      let fromTypes = runeA.runeType;
      let fromSprite = runeA.runeSprite;
      // to rune (types & sprite)
      let toTypes = runeB.runeType;
      let toSprite = runeB.runeSprite;

      // get the coordinate of from rune & to rune
      let runeARow = rune.getRuneRow(runeA);
      let runeACol = rune.getRuneCol(runeA);
      let runeBRow = rune.getRuneRow(runeB);
      let runeBCol = rune.getRuneCol(runeB);

      // Swap the rune from-to, to-from based on the coordinate
      gameArray[runeARow][runeACol].runeType = toTypes;
      gameArray[runeARow][runeACol].runeSprite = toSprite;
      gameArray[runeBRow][runeBCol].runeType = fromTypes;
      gameArray[runeBRow][runeBCol].runeSprite = fromSprite;

      // set the swapping rune tween
      this.tweenRune(runeA, runeB, swapBack);
      this.tweenRune(runeB, runeA, swapBack);
    }

    // tween of swapping rune function
    tweenRune = (runeFrom, runeTo, swapBack) => {
      // set the row & col for rune from
      let row = rune.getRuneRow(runeFrom);
      let col = rune.getRuneCol(runeFrom);
      
      // add the tween functions
      this.tweens.add({
        targets: gameArray[row][col].runeSprite,
        x: (col * gameRules.runeSize + gameRules.runeSize / 2) * 1.2,
        y: (row * gameRules.runeSize + gameRules.runeSize / 2),
        duration: gameRules.swapSpeed,
        callbackScope: this,
        onComplete: function(){
          // let the function do the tween twice (for swap)
          this.swappingRunes--;
          // console.log(this.swappingRunes);
          
          // if swap tween clear, check the new condition of the field
          if(this.swappingRunes == 0){
            if(!this.matcher.isMatches() && swapBack){
              this.swapRunes(runeFrom, runeTo, false);
            }else{
              if(this.matcher.isMatches()){
                // console.log('yo');
                this.matchInBoard();
              }else{
                this.canSelect = true;
                this.firstSelected = null;
              }
            }
          }
        }
      })
    }

    // check and destroy all match three in board
    matchInBoard = () => {
      // declare row array to remove match runes in fields
      // loop row
      for(let i = 0; i < gameRules.fieldSize; i++){
        // declare col array
        removeMap[i] = [];
        // set all map flags to 0
        for(let j = 0; j < gameRules.fieldSize; j++){
          removeMap[i].push(0);
        }
      }

      // check if there is horizontal match
      this.markMatches(HORZ);
      // check if there is vertical match
      this.markMatches(VERT);
      // destroy if there is non-zero map flag
      this.destroyRunes();
    }

    // confirm / mark the matches rune, match on horizontal or vertical?
    markMatches = (direction) => {
    
      // row loop
      for(let i = 0; i < gameRules.fieldSize; i++){
        // declare match data, especially the rune type, and streak of matches rune
        let typeStreak = 1;
        let currentType = -1;
        let startStreak = 0;
        let typeToWatch = 0;

        // col loop
        for(let j = 0; j < gameRules.fieldSize; j++){
          // if horizontal matches
          if(direction == HORZ){
            typeToWatch = rune.runeAt(i, j).runeType;
          // if vertical matches
          }else{
            typeToWatch = rune.runeAt(j, i).runeType;
          }

          // check how many streak on matches
          if(typeToWatch == currentType){
            typeStreak++;
          }

          // if no same type after.
          if(typeToWatch != currentType || j == gameRules.fieldSize-1){
            // if type streak more or same as three (match condition passed)
            if(typeStreak >= 3){
              if(direction == HORZ){
                console.log("HORIZONTAL : Length = " + typeStreak + " : Start = (" + i + "," + startStreak + ") : Type = " + currentType);
              }else{
                console.log("VERTICAL : Length = " + typeStreak + " : Start = (" + startStreak + "," + i + ") : Type = " + currentType);
              }

              // mark the rune position to remove
              for(let k = 0; k < typeStreak; k++){
                // if horizontal matches
                if(direction == HORZ){
                  removeMap[i][startStreak+k]++;
                // if vertical matches
                }else{
                  removeMap[startStreak+k][i]++;
                }
              }

              this.addScore(typeStreak);
            }

            // change the start streak to current col
            startStreak = j;
            // reset the typeStreak
            typeStreak = 1;
            // set the current type to type to watch
            currentType = typeToWatch;
          }
        }
      }
    }

    // destroy runes while match three
    destroyRunes = () => {
      let destroyed = 0;
      for(let i = 0; i < gameRules.fieldSize; i++){
        for(let j = 0; j < gameRules.fieldSize; j++){
          // if there is non-zero flag on map
          if(removeMap[i][j] > 0){
            // count the destroyed rune
            destroyed++;
            // console.log('des+' + destroyed);
            // add tween to fade the rune before destroyed
            this.tweens.add({
              targets: gameArray[i][j].runeSprite,
              alpha: 0.3,
              duration: gameRules.destroySpeed,
              callbackScope: this,
              onComplete: function(){
                // countdown
                destroyed--;
                // console.log('des-' + destroyed);
                // set the sprite visibility to false
                gameArray[i][j].runeSprite.visible = false;
                // push the new display to the pool
                this.poolArray.push(gameArray[i][j].runeSprite);
                // if destroy complete
                if(destroyed == 0){
                  // fill the blank with the top rune
                  this.runeFall();
                  // renew the topper blank field
                  this.renewFields();
                }
              }
            });
            // flag the position as empty fields
            gameArray[i][j].isEmpty = true;
          }
        }
      }
    }

    // Fall the rune while there is blank fields
    runeFall = () => {
      for(let i = gameRules.fieldSize - 2; i >= 0; i--){
        for(let j = 0; j < gameRules.fieldSize; j++){
          if(!gameArray[i][j].isEmpty){
            // check if there is holes below
            let fallTiles = this.holesBelow(i, j);
            // if there is
            if(fallTiles > 0){
              // add tween to fall the top rune (move the y coordinate)
              this.tweens.add({
                targets: gameArray[i][j].runeSprite,
                y: (gameArray[i][j].runeSprite.y + fallTiles * gameRules.runeSize),
                duration: gameRules.fallSpeed*fallTiles
              });
              // update the current game array
              gameArray[i+fallTiles][j] = {
                runeSprite: gameArray[i][j].runeSprite,
                runeType: gameArray[i][j].runeType,
                isEmpty: false
              }
              // just fall the rune? the topper field must be empty!
              gameArray[i][j].isEmpty = true;
            }
          }
        }
      }
    }

    // check if there is holes below function
    holesBelow = (row, col) => {
      let result = 0;
      for(let i = row+1; i < gameRules.fieldSize; i++){
        // check if there is empty fields
        if(gameArray[i][col].isEmpty){
          result++;
        }
      }
      // console.log('result:'+result);
      return result;
    }

    // renew fields function, after destroy & fall the rune
    renewFields = () => {
      let renewed = 0;
      for(let j = 0; j < gameRules.fieldSize; j++){
        // check holes only in the column
        let emptyCol = this.holesInCol(j);
        // if there is
        if(emptyCol > 0){
          // on all empty
          for(let i = 0; i < emptyCol; i++){
            // count the renewed fields
            renewed++;
            // random type to fill the empty fields
            let randomType = Phaser.Math.Between(0, gameRules.runeTypes-1);
            // add to game array
            gameArray[i][j].runeType = randomType;
            // pop the before pushed pool array
            gameArray[i][j].runeSprite = this.poolArray.pop();
            // set the display for the new rune
            gameArray[i][j].runeSprite.setFrame(randomType);
            gameArray[i][j].runeSprite.visible = true;
            gameArray[i][j].runeSprite.x = (gameRules.runeSize*j + gameRules.runeSize/2)*1.2;
            gameArray[i][j].runeSprite.y = (gameRules.runeSize/2 - (emptyCol-i) * gameRules.runeSize);
            gameArray[i][j].runeSprite.alpha=1;
            
            // there is no empty
            gameArray[i][j].isEmpty = false;
            
            // add tween just like the rune fall function
            this.tweens.add({
              targets: gameArray[i][j].runeSprite,
              y: (gameRules.runeSize * i + gameRules.runeSize/2),
              duration: gameRules.fallSpeed * emptyCol,
              callbackScope: this,
              onComplete: function(){
                renewed--;
                //check after renewed field, is there still match three in board?
                if(renewed == 0){
                  if(this.matcher.isMatches()){
                    // add event callback to match in board function
                    this.time.addEvent({
                      delay: 250,
                      callback: this.matchInBoard()
                    });
                  }else{
                    // if there is no, continue the game.
                    this.canSelect = true;
                    this.selectedRune = null;
                  }
                }
              }
            });


          }
        }
      }
    }

    // check holes only in the column
    holesInCol = (col) => {
      let result = 0;
      for(let i = 0; i < gameRules.fieldSize; i++){
        
        // find the empty column
        if(gameArray[i][col].isEmpty){
          result++;
        }
      }
      return result;
    }
}