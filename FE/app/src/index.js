'use strict';

import { Router } from './router.js';


document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('main');
    const router = new Router(app);

    router.addRoute('home', () => import('./views/home.js'));
    router.addRoute('lobby', () => import('./views/lobby.js'));
    router.addRoute('game', () => import('./views/game.js'));

    router.init();

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('code');
            router.navigate('home');
        });
    }
});
