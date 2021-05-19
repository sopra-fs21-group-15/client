# SoPra FS21 - Client Template

## Introduction
This is the front-end of our UZH-pictionairy-game.
It is a multiplayer draw and guessing game for up to 10 Players per game.

As a painter you choose from a set of random words and then try your best to
draw it with a variety of painting tools. Your friends will see the drawing in
real time and have to guess the word. The faster, the more points you will get.

You can choose between a classic mode which will provide you with just any random
words, and a Pokemon mode in which you will have to draw different Pokemon.

## Technologies

The front-end uses the ReactJS-framework to create an interface compatible with
modern web standards.

## High-level components (3 most important ones)

1. [MainScreen](src/components/mainScreen/MainScreen.js) This is the component
Players interact after logging in to decide what they want to do. They can see
all the Lobbies and join them (will redirect them to the WaitingScreen-component)
, they can also create an own Lobby (which redirects them to the
CreateLobby-component) or they can navigate to their own or a other Players
profile page (which redirects them to the ProfilePage component).
2. 
3. [DrawScreen](src/components/drawScreen/DrawScreen.js) This is the most
important component, where the game happens. Both, the drawers and guessers use
this component to display the game-interface. Depending on the current state of
the game different tools are shown (eg. palette for drawers) or enabled (eg.
canvas for drawers, chat for guessers). Players are redirected to this component
from the component WaitingScreen when the owner of the Lobby starts the game.

## Launch & Deployment

**Prerequisites** install `npm` with you package manager.

    # Install all necessary modules
    npm install
    # Start
    npm run dev

TODO deployment

## Illustrations

TODO make screenshots from finished project

## Roadmap

* Make application securer by adding token authentication with every API call
to make it impossible to send unauthorised API-calls with a tampered client.
* Add more modes
* Add handicaps for players with too many points # TODO remove if we implement this

## Authors and acknowledgement

This project is based on https://github.com/HASEL-UZH/sopra-fs21-template-client

**Authors of this project**

* Christen, Kilian (Github: Kilian-Christen)
* Giesch, Simon (Github: Wahlbar)
* Harambasic, Josip (Github: JosipHarambasic)
* Schmatloch, Niklas Alexander (Github: niklassc7)
* Wernli, Anthony (Github: pbofataf7)

## License

TODO ask everyone


# Old readme parts

## Prerequisites and Installation

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

### `npm install`

This has to be done before starting the application for the first time (only once).

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into an 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
