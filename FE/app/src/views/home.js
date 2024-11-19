'use strict';

import { auth } from '../auth.js';

// home.js
export function render() {
    return `
    <div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary btn-lg" id="login">
            Login with 42
        </button>
    </div>
    `;
}

export function init(router) {
    let code = new URLSearchParams(window.location.search).get('code');
    if (code) {
        auth(code, () => {router.navigate('lobby');});
    }

    document.getElementById('login').addEventListener('click', () => {
        requestLoginwith42();

        function requestLoginwith42() {
            const url  = 'https://api.intra.42.fr/oauth/authorize'
            const UID = process.env.UID || 'UID';
            console.log("UID : " + UID);
            const data = {
                'client_id': UID,
                'response_type': 'code',
                'redirect_uri': 'http://localhost',
                'scope': 'public',
            }
            let params = new URLSearchParams(data).toString();
            window.location.href = `${url}?${params}`;
        }
    });
}
