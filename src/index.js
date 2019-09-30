import Phaser from 'phaser';
import BootScene from './js/scene/boot/boot_scene_controller';
import LoadingScene from './js/scene/loading/loading_scene_controller';
import GameplayScene from './js/scene/gameplay/gameplay_scene_controller';

var config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('game'),
	parent: 'content',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: '100%',
		height: '100%'
	},
	scene: [BootScene,LoadingScene, GameplayScene],
	dom: {
		createContainer: true
	},
	render: {
		antiAlias: false,
		pixelArt: false,
		roundPixels: false
	},
	autoRound: false
};

export const gameRules = {
	fieldSize: 10,
	runeTypes: 11,
	runeSize: 90,
	swapSpeed: 250,
	fallSpeed: 200,
	destroySpeed: 200
}

const game = new Phaser.Game(config);

console.log(CONFIG.ENABLE_LOG)
// will print true in agate-dev and false in agate-prod

console.log(CONFIG.SERVER_HOST)
// will print http://172.4.16.219:4000 in agate-dev
// will print https://my-awesome-server.com in agate-prod

// automatically added
console.log(DEVELOPMENT, PRODUCTION)

