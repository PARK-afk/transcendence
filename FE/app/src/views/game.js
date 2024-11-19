'use strict';

import { auth } from '../auth.js';

// game.js
export function render() {
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let currentRound = 0;
    let totalRound = 1;

    return `
    <section  id="info" class="container justify-content-center">
        <div class="container text-center my-0">
            <div class="row justify-content-center">
                <h5>Info</h5>
                <h6>Player 1: W(up), S(down) | Player 2: ↑(up), ↓(down)</h6>
            </div>
            
            <div class="row justify-content-center align-items-center">
                <div id="round" class="justify-content-center align-items-center">
                    Round ${currentRound} of ${totalRound}
                </div>
                <div id="score" class="justify-content-center align-items-center">
                    Player 1 (${player1Name}): 0 | Player 2(${player2Name}): 0
                </div>
                <div id="game-info" class="justify-content-center align-items-center">
                </div>
            </div>
        </div>

        <!-- 여기에 canvas 추가 -->
        <div id="game-container" class="flex justify-content-center" style="position: relative; width: 100%; height: 600px;">
    </section>
`;
}

export function init() {
    auth(null, () => {});
    
    let scene, camera, renderer;
    let paddle1, paddle2, ball;
    let paddle1Speed = 0, paddle2Speed = 0;
    let ballSpeedX = 0.05, ballSpeedY = 0.05;
    let player1Score = 0, player2Score = 0;
    let player1Name = 'Player 1'; // Default value
    let player2Name = 'Player 2'; // Default value
    let currentRound = 0;
    let totalRound = 1; // Default value

    const scoreElement = document.getElementById('score');
    const roundElement = document.getElementById('round');
    const gameInfoElement = document.getElementById('game-info');
    const gameContainer = document.getElementById('game-container');
    
    initTHREE();
    updatePlayerNames();
    updateRound();
    animate();

    function updatePlayerNames() {
        const nickname1 = localStorage.getItem('nickname1');
        const nickname2 = localStorage.getItem('nickname2');
        const nickname3 = localStorage.getItem('nickname3');
        const nickname4 = localStorage.getItem('nickname4');
        const nickname5 = localStorage.getItem('nickname5');
        const nickname6 = localStorage.getItem('nickname6');

        if (nickname1 && nickname2) {
            // Single mode
            totalRound = 1;
            player1Name = nickname1;
            player2Name = nickname2;
        } else if (nickname3 && nickname4 && nickname5 && nickname6) {
            // Tournament mode
            totalRound = 3;
            if (currentRound === 0) {
                player1Name = nickname3;
                player2Name = nickname4;
            } else if (currentRound === 1) {
                player1Name = nickname5;
                player2Name = nickname6;
            } else if (currentRound === 2) {
                const winner1 = localStorage.getItem('round1_winner') ;
                const winner2 = localStorage.getItem('round2_winner') ;
                player1Name = winner1;
                player2Name = winner2;
            }
        }
    }

    function initTHREE() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // Set scene background to white

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        // Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight); // Set renderer size to game-container size
        gameContainer.appendChild(renderer.domElement); // Append to game-container

        // window.addEventListener('resize', onwindowResize, false);
        
        // Paddle1
        paddle1 = createPaddle(-3); scene.add(paddle1);
        // Paddle2
        paddle2 = createPaddle(3); scene.add(paddle2);
        // Ball
        ball = createBall(); scene.add(ball);

        // Walls
        createWalls();

        // Labels
        createLabels();

        // Event Listeners
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);
    }

    function createPaddle(position) {
        const geometry = new THREE.BoxGeometry(0.2, 1, 0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0x0 });
        const paddle = new THREE.Mesh(geometry, material);
        paddle.position.x = position;
        return paddle;
    }

    function createBall() {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0 });
        return new THREE.Mesh(geometry, material);
    }

    function createWalls() {
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xBBBBBB });

        // Top wall
        const topWall = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 0.2), wallMaterial);
        topWall.position.y = 3;
        scene.add(topWall);

        // Bottom wall
        const bottomWall = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 0.2), wallMaterial);
        bottomWall.position.y = -3;
        scene.add(bottomWall);

        // Left wall
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 0.2), wallMaterial);
        leftWall.position.x = -4;
        scene.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 0.2), wallMaterial);
        rightWall.position.x = 4;
        scene.add(rightWall);
    }

    function createLabels() {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0 });

            // Player 1 label
            const player1TextGeometry = new THREE.TextGeometry('1P', {
                font: font,
                size: 0.2,
                height: 0.05
            });
            const player1Text = new THREE.Mesh(player1TextGeometry, textMaterial);
            player1Text.position.set(-6, -3.2, 0);
            scene.add(player1Text);

            // Player 2 label
            const player2TextGeometry = new THREE.TextGeometry('2P', {
                font: font,
                size: 0.2,
                height: 0.05
            });
            const player2Text = new THREE.Mesh(player2TextGeometry, textMaterial);
            player2Text.position.set(5, -3.2, 0);
            scene.add(player2Text);
        });
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 87: /* W */ paddle1Speed = 0.1; break;
            case 83: /* S */ paddle1Speed = -0.1; break;
            case 38: /* Up Arrow */ paddle2Speed = 0.1; break;
            case 40: /* Down Arrow */ paddle2Speed = -0.1; break;
        }
    }

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
            case 87: /* W */ case 83: /* S */ paddle1Speed = 0; break;
            case 38: /* Up Arrow */ case 40: /* Down Arrow */ paddle2Speed = 0; break;
        }
    }

    function updateScore() {
        scoreElement.textContent = `Player 1(${player1Name}): ${player1Score} | Player 2(${player2Name}): ${player2Score}`;
    }

    function updateRound() {
        currentRound++;
        roundElement.textContent = `Round ${currentRound} of ${totalRound}`;
    }

    function resetBall() {
        ball.position.set(0, 0, 0);
        ballSpeedX = 0.05 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 0.05 * (Math.random() > 0.5 ? 1 : -1);
    }

    function checkForWinner() {
        if (player1Score >= 5 || player2Score >= 5) {
            if (player1Score >= 5) {
                gameInfoElement.textContent = `${player1Name} wins!`;
                localStorage.setItem(`round${currentRound}_winner`, player1Name);
            } else if (player2Score >= 5) {
                gameInfoElement.textContent = `${player1Name} wins!`;
                localStorage.setItem(`round${currentRound}_winner`, player2Name);
            }

            if (currentRound >= totalRound) {
                endGame();
            } else {
                player1Score = 0;
                player2Score = 0;
                updateScore();
                updatePlayerNames();
                gameInfoElement.textContent = '';
                updateRound();
            }
        }
    }

    function endGame() {
        // Stop the ball
        ballSpeedX = 0;
        ballSpeedY = 0;
        
        gameInfoElement.textContent = 'Game Over!';
        
        // button
        const button = document.createElement('button');
        button.textContent = 'Go to lobby';
        button.className = 'btn btn-primary';
        button.style.marginLeft = '20px';
        button.onclick = () => {
            window.location.href = '/lobby';
        };
        gameInfoElement.appendChild(button);
    }

    function animate(callback) {
        requestAnimationFrame(animate);

        function movementPaddle() {
            // Move paddles
            paddle1.position.y += paddle1Speed;
            paddle2.position.y += paddle2Speed;

            // Prevent paddles from leaving the field
            paddle1.position.y = Math.max(Math.min(paddle1.position.y, 2.5), -2.5);
            paddle2.position.y = Math.max(Math.min(paddle2.position.y, 2.5), -2.5);
        }
        
        function movementBall() {
            // Move ball
            ball.position.x += ballSpeedX;
            ball.position.y += ballSpeedY;

            // Ball collision with top and bottom walls
            if (ball.position.y > 2.9 || ball.position.y < -2.9) {
                ballSpeedY = -ballSpeedY;
            }
        }
        movementPaddle();
        movementBall();
        

        // Ball collision with left and right walls
        if (ball.position.x > 3.9 || ball.position.x < -3.9) {
            if (ball.position.x > 3.9) {
                player1Score++;
            } else if (ball.position.x < -3.9) {
                player2Score++;
            }
            updateScore();
            resetBall();
            checkForWinner();
        }

        // Ball collision with paddles
        if ((ball.position.x < paddle1.position.x + 0.2 && ball.position.x > paddle1.position.x - 0.2 && 
            ball.position.y < paddle1.position.y + 0.5 && ball.position.y > paddle1.position.y - 0.5) || 
            (ball.position.x > paddle2.position.x - 0.2 && ball.position.x < paddle2.position.x + 0.2 && 
            ball.position.y < paddle2.position.y + 0.5 && ball.position.y > paddle2.position.y - 0.5)) {
            ballSpeedX = -ballSpeedX;
        }

        // Render scene
        renderer.render(scene, camera);
    }
}
