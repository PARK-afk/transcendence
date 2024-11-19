'use strict';

import { auth } from '../auth.js';

// lobby.js
export function render() {
    return `
    <section class="container d-flex justify-content-center align-items-center gap-5 " style="height: 80vh;">
        <div class="col border border-primary rounded" style="height: 90%; overflow-y: auto;">
            <div class="row">
                <div class="d-flex justify-content-center " style="height: 100%;">
                    <h6 class="text-primary" style="font-weight: bold; margin-top: 10px;">single mode</h6>
                </div>
                <div class="form-container d-flex justify-content-center" style="padding: 15px;">
                    <div class="row w-100">
                        <label for="nickname1">First User</label>
                        <span id="nickname1-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname1" placeholder="Enter your nickname">
                        
                        <label for="nickname2">Second User</label>
                        <span id="nickname2-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname2" placeholder="Enter your nickname">
                        
                        <div class="d-flex justify-content-center">
                            <button type="button" class="btn btn-primary" id="startSingleMode" style="margin-top: 30px;">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col border border-primary rounded" style="height: 90%; overflow-y: auto;">
            <div class="row">
                <div class="d-flex justify-content-center " style="height: 100%;">
                    <h6 class="text-primary" style="font-weight: bold; margin-top: 10px;">tournament mode</h6>
                </div>
                <div class="form-container d-flex justify-content-center" style="padding: 15px;">
                    <div class="row w-100">
                        <div class="d-flex justify-content-center">
                            <h6 class="text-primary" style="font-weight: bold; margin-top: 10px;">First round</h6>
                        </div>
                        <label for="nickname3">First User</label>
                        <span id="nickname3-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname3" placeholder="Enter your nickname">
                        
                        <label for="nickname4">Second User</label>
                        <span id="nickname4-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname4" placeholder="Enter your nickname">
                        
                        <hr style="margin-top: 20px"></hr>

                        <div class="d-flex justify-content-center">
                            <h6 class="text-primary" style="font-weight: bold; margin-top: 10px;">Second round</h6>
                        </div>

                        <label for="nickname5">First User</label>
                        <span id="nickname5-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname5" placeholder="Enter your nickname">
                        
                        <label for="nickname6">Second User</label>
                        <span id="nickname6-error" class="text-danger"></span> <!-- 에러 메시지 출력 -->
                        <input type="text" class="form-control" id="nickname6" placeholder="Enter your nickname">
                        
                        <div class="d-flex justify-content-center">
                            <button type="button" class="btn btn-primary" id="startTournamentMode" style="margin-top: 30px;">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
}

export function init(router) {
    auth(null, () => {});

    document.getElementById('startSingleMode').addEventListener('click', () => {
        if (validateSingleMode()) {
            startGame(router);
        }
    });

    document.getElementById('startTournamentMode').addEventListener('click', () => {
        if (validateTournamentMode()) {
            startGame(router);
        }
    });

    function validateSingleMode() {
        const nickname1 = document.getElementById('nickname1').value;
        const nickname2 = document.getElementById('nickname2').value;

        let isValid = true;
        // Error message elements
        const nickname1Error = document.getElementById('nickname1-error');
        const nickname2Error = document.getElementById('nickname2-error');

        // Reset error messages
        nickname1Error.textContent = '';
        nickname2Error.textContent = '';

        if (!nickname1) {
            nickname1Error.textContent = 'Please enter a nickname for the first user.';
            isValid = false;
        }

        if (!nickname2) {
            nickname2Error.textContent = 'Please enter a nickname for the second user.';
            isValid = false;
        }

        if (!isValid) {
            return false;
        }

        // Save nicknames to localStorage
        localStorage.setItem('nickname1', nickname1);
        localStorage.setItem('nickname2', nickname2);
        localStorage.removeItem('nickname3');
        localStorage.removeItem('nickname4');
        localStorage.removeItem('nickname5');
        localStorage.removeItem('nickname6');
        return true;
    }

    function validateTournamentMode() {
        const nickname3 = document.getElementById('nickname3').value;
        const nickname4 = document.getElementById('nickname4').value;
        const nickname5 = document.getElementById('nickname5').value;
        const nickname6 = document.getElementById('nickname6').value;

        let isValid = true;
        // Error message elements
        const nickname3Error = document.getElementById('nickname3-error');
        const nickname4Error = document.getElementById('nickname4-error');
        const nickname5Error = document.getElementById('nickname5-error');
        const nickname6Error = document.getElementById('nickname6-error');

        // Reset error messages
        nickname3Error.textContent = '';
        nickname4Error.textContent = '';
        nickname5Error.textContent = '';
        nickname6Error.textContent = '';

        if (!nickname3) {
            nickname3Error.textContent = 'Please enter a nickname for the first user.';
            isValid = false;
        }

        if (!nickname4) {
            nickname4Error.textContent = 'Please enter a nickname for the second user.';
            isValid = false;
        }

        if (!nickname5) {
            nickname5Error.textContent = 'Please enter a nickname for the first user.';
            isValid = false;
        }

        if (!nickname6) {
            nickname6Error.textContent = 'Please enter a nickname for the second user.';
            isValid = false;
        }


        if (!isValid) {
            return false;
        }

        // Save nicknames to localStorage
        localStorage.removeItem('nickname1');
        localStorage.removeItem('nickname2');
        localStorage.setItem('nickname3', nickname3);
        localStorage.setItem('nickname4', nickname4);
        localStorage.setItem('nickname5', nickname5);
        localStorage.setItem('nickname6', nickname6);
        return true;
    }

    function startGame(router) {
        router.navigate('game');
    }
}
