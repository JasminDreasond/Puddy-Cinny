Made by aisa

    1 - Don't mark messages as read if the window isn't focused.
    2- Don't switch to a room when joined via invite on another session.

noctabrat

    Being able to see pfp fullscreen when we click them the same way we can see images

Made by Me

    Insert into manifest

    "screenshots": [
        {
        "src": "/images/screenshot1.png",
        "type": "image/png",
        "sizes": "540x720",
        "form_factor": "narrow"
        },
        {
        "src": "/images/screenshot2.jpg",
        "type": "image/jpg",
        "sizes": "720x540",
        "form_factor": "wide"
        }

    ]




    const user = mx.getUser(mx.getUserId());

    user.on('user.status', (data) => {
      console.log('user.status', data);
    });

    user.emit('user.status', { presence: 'online' });

    mx.getUrlPreview(url, ts)

    O upload de imagens está desregulado
