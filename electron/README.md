# Electron-React-TypeScript-Webpack-Boilerplate
Pre-configured Electron.js + React.js + TypeScript boilerplate with 
Webpack v4 & linters config predefined.

This boilerplate currently works on macOS and Windows. If something doesn't 
work, please [file and issue](https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/issues/new).

## Getting started
```sh
// execute
git clone https://github.com/iamWing/electron-react-typescript-base-proj.git
```

```json
// edit the following fields in package.json for your own project
{
  "name": your-project-name,
  "version": whatever-you-like,
  "description": your-own-description,
  "build": {
    "appId": your-app-id,
    "productName": your-product-name,
    "buildVersion": whatever-you-like
  },
  "author": who's-the-author?,
  "license": if-you-don't-want-to-use-MIT,
  "repository": type-and-link-of-your-repo,
  "keywords": keywords-of-your-project,
  "bugs": issue-page-of-your-repo,
  "homepage": homepage-of-your-repo
}
```

Then install all the `node_modules` needed by executing the following command:
```sh
cd folder-containing-the-cloned-boilerplate
npm install
```

Finally execute the following command to start Webpack in development mode and 
watch the changes on source files for live rebuild on code changes.
```sh
npm run dev
```

The `npm run dev` command won't start your app and get your app shows on the 
screen. To start your app, execute the following command:
```sh
npm start
```

## Building the installer for your Electron app
The boilerplate is currently configured to package & build the installer of 
your app for macOS & Windows using `electron-builder`. 

For macOS, execute:
```sh
npm run build:mac
```

For Windows, execute:
```sh
npm run build:win
```
_** `asar` archiving is disabled by default in Windows build as it can cause 
errors while running the installed Electron app based on pervious experiences, 
whereas the macOS build with `asar` enabled works just fine. You can turn it 
back on by removing line 23 (`"asar": false`) in `package.json`. **_

### Extra options
The build scripts are pre-configured to build 64 bit installers since 64 bit 
should be the standard for a modern applications. 32 bit builds are still 
possible by changing the build scripts in `package.json` as below:
```json
// from
"scripts": {
    ...
    "build:win": "electron-builder build --win --x64",
    "build:mac": "electron-builder build --mac --x64"
},

// to
"scripts": {
    ...
    "build:win": "electron-builder build --win --ia32",
    // Works only on macOS version < 10.15
    "build:mac": "electron-builder build --mac --ia32"
},
```

Builds for Linux, armv71, and arm64 can also be configured by modifying the 
build scripts in `package.json`, but those aren't tested yet. For details, 
please refer to [documents of `electron-builder`](https://www.electron.build/cli).

## Known issues

- `dmg` build action on `macOS Catalina (10.15)` fails due to Apple ditches 
  support for 32-bit apps from `10.15` onwards (Don't worry, you are still 
  building 64-bit apps, just some dependencies of the builder are still 32-bit).
  Further details retailed to this issue can be found 
  [here](https://github.com/electron-userland/electron-builder/issues/3990).  
  Application installer built on `macOS` is now set to build `pkg` file 
  instead of `dmg` as a workaround in the current version. The issue can be 
  fixed by applying a major version upgrade of `electron-builder` to `21.2.0+` 
  but it hasn't been tested on this boilerplate yet. This issue is planned to 
  be addressed alongside with major version upgrades on other dependencies.

## Folder structure
```
electron-react-typescript-base-proj/
| - dist/               //- Generated by Webpack automatically
| - node_modules/
| - out/                //- Generated by build script automatically
| - public/             //- Global static assets
| | - index.html
| | - style.css
| - src/
| | - main/             //- Backend modules for the Electron app
| | | - main.ts         //- Entry point of 'electron-main'
| | - models/
| | - renderer/         //- Frontend React components for the Electron app
| | | - renderer.tsx    //- Entry point of 'electron-renderer'
| | - utils/            //- Common utilities
| - test/               //- Unit tests
| - .eslintrc           //- ESLint config
| - .gitignore
| - package-lock.json
| - package.json
| - tsconfig.json       //- TypeScript config
| - tslint.json         //- TSLint config
| - webpack.config.js   //- Webpack config
```

## Author

[Wing Chau](https://github.com/iamWing) [@Devtography](https://github.com/Devtography)

## License
Electron React TypeScript Webpack Boilerplate is open source software 
[licensed as MIT](LICENSE).