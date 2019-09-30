export class ImageHelper {
	/**
     * 
     * @param {Phaser.GameObjects.Image} image 
     * @param {number} width 
     */
	static setImageDisplayInWidth(image, width) {
		image.setDisplaySize(width, width / (image.displayWidth / image.displayHeight));
	}

	/**
     * 
     * @param {Phaser.GameObjects.Image} image 
     * @param {number} height
     */
	static setImageDisplayInHeight(image, height) {
		image.setDisplaySize(image.displayWidth / image.displayHeight * height, height);
	}

	/**
     * 
     * @param {Phaser.GameObjects.Image} image 
     * @param {Phaser.Scene} scene 
     */
	static setImageFillTheScene(image, scene) {
		let screenRatio = scene.scale.width / scene.scale.height;
		let imageRatio = image.displayWidth / image.displayHeight;
		if (screenRatio < imageRatio) this.setImageDisplayInHeight(image, scene.scale.height);
		else this.setImageDisplayInWidth(image, scene.scale.width);
	}
}
