# SoPra FS21 - Pictionary Client

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
For the drawing-image we use a simple HTML 5 Canvas.

## High-level components (3 most important ones)

1. [MainScreen](src/components/mainScreen/MainScreen.js) This is the component
Players interact after logging in to decide what they want to do. They can see
all the Lobbies and join them (will redirect them to the WaitingScreen-component)
, they can also create an own Lobby (which redirects them to the
CreateLobby-component) or they can navigate to their own or a other Players
profile page (which redirects them to the ProfilePage component).
2. [ProfilePage](src/components/profilepage/ProfilePage.js) This is interface
handling user-profiles and includes a friends-system. People can send each
other friend-requests which have to be accepted by the other person.
3. [DrawScreen](src/components/drawScreen/DrawScreen.js) This is the most
important component, where the game happens. Both, the drawers and guessers use
this component to display the game-interface. Depending on the current state of
the game different tools are shown (eg. palette for drawers) or enabled (eg.
canvas for drawers, chat for guessers). Players are redirected to this component
from the component WaitingScreen when the owner of the Lobby starts the game.

## Launch & Deployment

**Prerequisites** install `npm` (`>= 8.10`) with you package manager or
download it [here](https://nodejs.org).

    # Install all necessary modules (first time running app)
    npm install
    # Start
    npm run dev

The open [http://localhost:3000](http://localhost:3000) in your browser.

**Building**

    # Build app to the `build` folder for production
    npm run build

**Deployment**

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Illustrations

Illustrated by the gif, after you created an account you are redirected to the
main screen in which you can create a lobby. As soon as someone else joins you
can start the game and everyone is redirected to the draw-screen.
The player in the gif is chosen as drawer and has to draw while the others see
the image and guess the word.

![gif](https://github.com/sopra-fs21-group-15/client/blob/README/pictionary.gif)


## Roadmap

* Make application securer by adding token authentication with every API call
to make it impossible to send unauthorised API-calls with a tampered client
* Add more modes (Different themes in which you have to draw words about a
certain topic, like our Pokemon mode)

## Authors and acknowledgement

This project is based on https://github.com/HASEL-UZH/sopra-fs21-template-client

**Authors of this project**

* Christen, Kilian (Github: Kilian-Christen)
* Giesch, Simon (Github: Wahlbar)
* Harambasic, Josip (Github: JosipHarambasic)
* Schmatloch, Niklas Alexander (Github: niklassc7)
* Wernli, Anthony (Github: pbofataf7)

## License

[AGPLv3](LICENSE)
