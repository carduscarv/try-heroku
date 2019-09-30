import LoaderController from "../../module/loader/loader_controller";

export default class LoadingSceneController extends Phaser.Scene
{    
    constructor(){
        super(
        {
            key: 'LoadingScene'
        });
    }

    preload = () => {
        this.load.image('logo', CONFIG.BASE_ASSET_URL + 'img/logo.png');
        this.load.image('particle', CONFIG.BASE_ASSET_URL + 'img/particle.png');
        // load the assets, background & runes
        this.load.image('background', CONFIG.BASE_ASSET_URL + 'img/background.jpg');
        this.load.spritesheet('runes', CONFIG.BASE_ASSET_URL + 'img/runes.png', {
            frameWidth: 100,
            frameHeight: 100
        });
    }

    create = () => {
        Promise.all([
            LoaderController.getInstance().init(),
        ]).then(() =>
        {
            console.log('Loading scene..');
            this.scene.start('GameplayScene');
        }).catch((err) =>
        {
            //error
        })
    }
}