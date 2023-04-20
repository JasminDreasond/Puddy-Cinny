# Puddy Cinny
<p>
    <a href="https://github.com/JasminDreasond/Puddy-Cinny/releases">
        <img alt="GitHub release downloads" src="https://img.shields.io/github/downloads/JasminDreasond/Puddy-Cinny/total?logo=github&style=social"></a>
    <a href="https://twitter.com/intent/follow?screen_name=JasminDreasond">
        <img alt="Follow on Twitter" src="https://img.shields.io/twitter/follow/JasminDreasond?logo=twitter&style=social"></a>
</p>

A Matrix client focusing primarily on simple, elegant and secure interface. The main goal is to have an instant messaging application that is easy on people and has a modern touch.
- [Roadmap](https://github.com/JasminDreasond/Puddy-Cinny/projects/11)
- [Contributing](./CONTRIBUTING.md)

<img align="center" src="https://raw.githubusercontent.com/cinnyapp/cinny-site/main/assets/preview2-light.png" height="380">

## Getting started
Web app is available at https://app.cinny.in and gets updated on each new release. The `dev` branch is continuously deployed at https://dev.cinny.in but keep in mind that it could have things broken.

You can also download our desktop app from [cinny-desktop repository](https://github.com/JasminDreasond/Puddy-Cinny-Desktop).

To host Cinny on your own, download tarball of the app from [GitHub release](https://github.com/JasminDreasond/Puddy-Cinny/releases/latest).
You can serve the application with a webserver of your choice by simply copying `dist/` directory to the webroot. 
To set default Homeserver on login and register page, place a customized [`config.json`](config.json) in webroot of your choice.


## Local development
> We recommend using a version manager as versions change very quickly. You will likely need to switch 
between multiple Node.js versions based on the needs of different projects you're working on. [NVM on windows](https://github.com/coreybutler/nvm-windows#installation--upgrades) on Windows and [nvm](https://github.com/nvm-sh/nvm) on Linux/macOS are pretty good choices. Also recommended nodejs version Hydrogen LTS (v18).

Execute the following commands to start a development server:
```sh
npm ci # Installs all dependencies
npm start # Serve a development version
```

To build the app:
```sh
npm run build # Compiles the app into the dist/ directory
```
