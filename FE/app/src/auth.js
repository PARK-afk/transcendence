export async function auth(code, callback) {
    if (!code) {
        code = localStorage.getItem('code');
    }

    const url = '/api/credentials/';  // Nginx가 프록시하는 경로
    await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referrer-Policy': 'no-referrer',
        },
        body: JSON.stringify({ code: code })
    }).then(response => {
        if (200 <= response.status && response.status < 300) {
            if (code) {
                localStorage.setItem('code', code);
            }
            callback();
        } else {
            alert('Failed to login with 42');
            window.location.href = '/';
        }
    });
}