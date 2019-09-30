import CssController from "../../module/css_controller";

export default class BootSceneController extends Phaser.Scene
{    
    constructor(){
        super(
        {
            key: 'BootScene'
        });
    }

    preload = () => {

    }

    create = () => {    
        Promise.all([
            CssController.getInstance().init(),
        ]).then(() =>
        {
            console.log('Boot scene..');
            this.scene.start('LoadingScene');
        }).catch((err) =>
        {
            //error
        })
    }
}