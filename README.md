# Agate Template Phaser

<img src='https://img.shields.io/badge/Status-Maintained-brightgreen' />
<img src='https://img.shields.io/badge/Contribution-Open-brightgreen' />
<img src='https://img.shields.io/badge/phaser-3.18.1-blue' />
    
*Phaser Starting Project* is a template to improve browser games development. It consists of [phaserjs](https://phaser.io/phaser3) as a game framework and [webpack](https://webpack.js.org/) module to enhance development process. This template use npm as package manager so you need to have [nodejs](https://nodejs.org/en/) installed. You can fork / copy this template to your working directory, dont forget to change your **project name** and **version** under `package.json` file.

* **Table of Context :**
    * [Quick Start](#quickstart)
    * [Command Line Interface](#cli)
    * [Config File](#using-config-file)
    * [Load Asset](#load-asset)
    * [Code Writing Guidelines](#code-writing-guidelines)
    * [Modules](#modules)
        * [Loader Controller](#loader-controller)
        * [Create your own Custom Controller](#create-your-own-custom-controller)
    * [Common Problems](#common-problems)

* **Contribution**
    * [Guidelines](#contribution)

## Quickstart
1. Download this repo
2. Install all your dependencies by run `npm install`
3. Create your scene script that extends Phaser.Scene
```javascript
// gameplay_controller.js
export default GameplayController : Phaser.Scene {
    preload = () => {
        ...
    }
    create = () => {
        ...
    }
}
```
4. Reference your scene class to `index.js` under `config.scene` array
```javascript
import GameplayController from './js/scene/gameplay/gameplay_controller.js';

var config = {
	...
	scene: [GameplayController],
	...
};

const game = new Phaser.Game(config);
```
5. Run your dev server by `npm run dev`

## CLI

In `package.json` file and section `scripts` listed handy commands to help your development process. You can add more if needed.

| script | details |
| ------ | ------- |
| `npm run dev` | Start your development server in port 8080, also notice that folder `src/assets` is served as public static folder
| `npm run build` | Build your project into `dist/` folder
| `npm run dist` | Run static server from your `dist/` folder

## Using Config File

You can create your config file to be implemented in your environments (development, staging, production, etc). Put your config file inside config folder, it also must be named `<your-config>.config.json`. This config feature is managed by webpack module. Config file that used in your current environment is basically a base config combined with your config. So if you have a global config that runs in every environment, you can put that inside `base.config.json`. If a same key is found inside your base and your config, then key value pairs in your config will be use instead.

#### Creating your own config file

Let's create our own config by creating a json file named *agate-dev.config.json*, *agate-prod.config.json*, and modify *base.config.json* inside config folder.

```javascript
// base.config.json
{
    "ENABLE_LOG": true
}
```
```javascript
// agate-dev.config.json
{
    "SERVER_HOST": "http://172.4.16.219:4000"
}
```
```javascript
// agate-prod.config.json
{
    "SERVER_HOST": "https://my-awesome-server.com",
    "ENABLE_LOG": false
}
```
From those config above, if you use agate-dev config, then your ENABLE_LOG value will be `true`, and your SERVER_HOST will be `http://172.4.16.219:4000`, on the other hand if you use agate-prod config, then your ENABLE_LOG value will be `false` and your SERVER_HOST will be `https://my-awesome-server.com`

#### Run config in an environtment

To use a specific config, use flag `--env.build=<yourconfig>` when executing webpack or webpack dev server.

| script | details |
| ------ | ------- |
| webpack-dev-server --config webpack/webpack.dev.js --env.build=agate-dev --open | This command will run your dev server and use agate-dev config (--env.build=agate-dev)
| webpack-dev-server --config webpack/webpack.dev.js --env.build=agate-prod --open | This command will run your dev server and use agate-prod config (--env.build=agate-prod)
| webpack --config webpack/webpack.prod.js --env.build=agate-prod | This command will build your project using agate-prod config (--env.build=agate-prod)

> You can use *npm run scripts* to help you run those long lines. Read more about npm run [here](https://docs.npmjs.com/cli/run-script)

#### Recieve config value

From anywhere inside your project, you can get config value by simply calling their keys.
```javascript
// index.js or anywhere in your project

console.log(CONFIG.ENABLE_LOG)
// will print true in agate-dev and false in agate-prod


console.log(CONFIG.SERVER_HOST)
// will print http://172.4.16.219:4000 in agate-dev
// will print https://my-awesome-server.com in agate-prod

// automatically added
console.log(DEVELOPMENT, PRODUCTION)
// will print (true false) if you use development webpack config (webpack.dev.js)
// will print (false true) if you use production webpack config (webpack.prod.js)
```

## Load Asset

Load assets such as images, fonts, and sounds is a bit tricky. Sometimes we (~~or the project-client~~) need to place all the assets under different path than the index.html file. It means that we need to be able to load asset from a dynamic path. Fortunately this issue can be handled by config file and dev server public path.

Now, instead of directly load an image, you have to load them by URL and put all your assets under *src/assets* folder.

```javascript
// DONT DO THIS
import logo from './img/logo.png'
this.game.load.image('logo', logo)

// DO THIS
this.game.load.image('logo', CONFIG.BASE_ASSET_URL + '/img/logo.png')
```
```javascript
// dev.config.json
{
    "BASE_ASSET_URL": ""
}

// prod.config.json
{
    "BASE_ASSET_URL": "https://my-awesome-server.com/path/to/asset"
}
// or keep BASE_ASSET_URL as an empty string if the asset path is in the same root as index.html
```

Always use empty string ("") for *BASE_ASSET_URL* in your development because the game will be able to find your asset under the *src/assets* folder.

If you build your project, your assets won't be included in build. If you build with *BASE_ASSET_URL* as an empty string that means you need to copy all your assets to your dist/ folder (or same root as your index.html)

<p>
<details>
<summary><em>Further explanation about this</em></summary>

<h4>During the Development</h4>
<dd>

Webpack provides ability to create a server static folder. If you read webpack config insidle *webpack.dev.js*, you will find an option *devServer* like code below. Specify *'src/assets'* in contentBase means that any file inside *src/assets* folder will be serve as static files in the dev server. If you have an image inside *src/assets/img/logo.png*, it can be accessed through *localhost:8080/img/logo.png*

```javascript
devServer: {
    contentBase: 'src/assets'
}
```

If you set your *BASE_ASSET_URL* as empty string, final URL from `CONFIG.BASE_ASSET_URL + '/img/logo.png'` would be `/img/logo.png` and fallback to `localhost:8080/img/logo.png`

</dd>

<h4>During the Production</h4>
<dd>

If you build your project, you will find that your assets aren't included in your build. If you try to run your index.html in a web server, it will throw error because all the assets is not found. You can copy all your assets from *src/assets* to your *dist/* folder (or same root as your index.html).

Otherwise, you can specify *BASE_ASSET_URL* as an static base URL where you store all the assets, ex : `https://my-awesome-server.com/path/to/asset`. This way, final URL from `CONFIG.BASE_ASSET_URL + '/img/logo.png'` would be `https://my-awesome-server.com/path/to/asset/img/logo.png`.

</dd>

</details>
</p>

## Code Writing Guidelines

This part will guide programmer about some rules and how to code javascript across the game.

#### Javascript common and powerful feature

This language comes with some powerful built-in feature, such as Promise for async process and higher order function to array manipulation
* **Use** `Promise` **for async method.**
```javascript
getDataFromServer = () => {
    return Promise((resolve, reject) => {
        fetch('https://my-awesome-server.com')
            .then((data) => data.json())
            .then((data) => {
                if (data.isSuccess) resolve(data);
                else reject(data.error);
            })
            .catch((err) => reject(err))
    });
}

getDataFromServer()
    .then((data) => console.log('Data Received', data))
    .catch((err) => console.log('Error get data from Server', err))
```

Alternative for async process other thann `Promise` is you can use `callback` function or `async await`

* **Use higher order function for array manipulation.**
```javascript
// This function will create new array of players name
players.map((player) => player.name)

// This function will create new array of old people only
players.filter((player) => player.isOld)

// This function will return number of comulative age
players.reduce((sum, player) => sum += player.age)
```
There are a lot of other array function to improve and clean you code.

* **Use other ES6 Syntax**
Improve your code using other useful ES6 Syntax

#### Foldering and name convention
* Always use `snake_case` to naming your folder and javascript file
    * src/js/helper/image.js
    * src/js/module/something_controller.js
    * src/js/scene/gameplay/gameplay_controller.js
* Always use `PascalCase` to naming a class
```javascript
export default GameplayController extends Phaser.Scene {
    ...
}
```
* Put your javascript file under `src/js` folder, then separate it based on their function
    * folder **helper** for all helper / custom gameobject class
    * folder **module** for all module class
    * folder **scene** for all game scripts
    Example :
        * folder **gameplay** contains all gameplay scripts
        * folder **mainmenu** contains all mainmenu scripts
* Put your css file under `src/css` folder
* Put your asset file under `src/assets` folder, then separate it based on their type
    * folder **img** for all images
    * folder **font** for all fonts
    * folder **sound** for all sounds
* If any, put your external library or minified js in `src/lib` folder.
> But only do this if you didn't found any npm package for library that you want. This is because webpack module will treat bundle build differently for game script and node_modules.


#### Logic Separation / Responsibility Principle
Main focus to rapid and efficient development is that you need to write clean and modular code.

* **Controller and View**
* **Module**
* **Split Mountain Class to Smaller Chunks**

#### Script Type
A Script is always has to be either helper, constant, controller, or view class

* **Helper Class**
* **Constant Class**
* **Controller Class**
* **View Class**

## Modules

Modules from this template is a generic module that can be used in any project. If you use module, you have to initialize all modules using their *init* function.
```javascript
// single module
SomemoduleController.getInstance().init()
    .then(() => {
        console.log('module initialized, ready to be use')
    })

// multiple module
Promise.all([
    Somemodule1Controller.getInstance().init(),
    Somemodule2Controller.getInstance().init(),
    Somemodule3Controller.getInstance().init(),
    Somemodule4Controller.getInstance().init(),
])
    .then(() => {
        console.log('module initialized, ready to be use')
    })
```

#### Loader Controller

This module has a function to load a font. If you have a font asset under *src/assets/font/myfont.ttf* you can load your font with code below
```javascript
LoaderController.getInstance().loadFonts([
    {
        key:'myfont',
        path: CONFIG.BASE_ASSET_URL + '/font/myfont.ttf'
    }
])
    .then(() => {
        console.log('font initialized and ready to be used')
        this.game.add.text(0, 0, 'This is my text',
        {
            fontFamily: 'myfont',
            fontSize: 30,
            color: '#ffffff'
        })
    })
```

#### Create your own Custom Controller

If you need to create your own module, you need to follow rules and create new module using this template code below.
1. **Use jsdocs to document your code**
```javascript
/**
 * @class
 * This class is a module to do custom thing
 */
```
2. **Use arrow function for each method to fix common** `this` **problem**
```javascript
getSomething = () => { return 'something' };
```
3. **Use** `Promise` **for async method.**
```javascript
return Promise((resolve, reject) => {
    fetch('https://my-awesome-server.com')
        .then((data) => data.json())
        .then((data) => {
            if (data.isSuccess) resolve(data);
            else reject(data.error);
        })
        .catch((err) => reject(err))
});
```
4. **Use this template**
```javascript
/**
 * @class
 * This class is a module to do custom thing
 */
export default class CustomController {

	/**
	 * Get instance
	 * @returns {CustomController}
	 */
	static getInstance = () => {
		if (!CustomController.instance) {
			CustomController.instance = new CustomController();
		}
		return CustomController.instance;
	};

	 /**
	 * Initialize Function
	 */
	init = () => {
		return new Promise((resolve, reject) => {
			// put your initialize code here
			resolve();
		});
	};
}
```

## Common Problems

This section will provide common problems and their solutions during phaser development.

Table of Context :
- [Make Responsive Game](#Make-Responsive-Game)
- [Bypass CORS Blocking](#Bypass-CORS-Blocking)
- [Allowing Audio to Autoplay](#Allowing-Audio-to-Autoplay)

#### Make Responsive Game
TO DO

#### Bypass CORS Blocking
Sometimes you need to access other resources directly from their site or even just simple API call and then your browser block you with CORS. This problem happened because you didn't have same domain as theirs. To bypass CORS blocking you can start your Google Chrome from command line below
```
start chrome --disable-web-security --disable-gpu --user-data-dir=temp/chromeTemp
```
You can put those command to your npm scripts for easier call

#### Allowing Audio to Autoplay
This issue is come from browser policy. Work around from this issue is that you can start your audio from off position, or you can set you chrome flag audio to autoplay by access this `chrome://flags/` then search your autoplay setting and set it to `no user gesture is required`.

## Contribution
1. Clone project
2. Select issue you want to contribute into at Issue Board labeled with ~Sanitized
3. Move the issue to group ~Doing
4. Create branch from the issue
5. If you finish working with the issue, create merge request to master
6. Move issue to ~Done
