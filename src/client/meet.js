const domain = 'meet.jit.si';
const options = {

    roomName: 'JitsiMeetAPIExample',
    parentNode: document.querySelector('#meet'),
    lang: 'en',

    devices: {
        //audioInput: '<deviceLabel>',
        //audioOutput: '<deviceLabel>',
        //videoInput: '<deviceLabel>'
    },

    configOverwrite: {
        startWithAudioMuted: false,
        startAudioOnly: true,
        transcribingEnabled: false,
        disableSimulcast: true,
    },

    interfaceConfigOverwrite: {

        APP_NAME: 'Puddy Cinny',
        AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
        AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',

        GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
        DISABLE_TRANSCRIPTION_SUBTITLES: true,

        DEFAULT_BACKGROUND: '#040404',
        DEFAULT_WELCOME_PAGE_LOGO_URL: 'images/watermark.svg',

        DISPLAY_WELCOME_FOOTER: false,
        DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,

        HIDE_INVITE_MORE_HEADER: true,
        MOBILE_APP_PROMO: false,

        VIDEO_QUALITY_LABEL_DISABLED: false,

        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'sounds', 'more'],
        SHARING_FEATURES: [],

        SHOW_CHROME_EXTENSION_BANNER: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,

        TOOLBAR_BUTTONS: [
            'camera',
            'chat',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'microphone',
            'noisesuppression',
            'participants-pane',
            'raisehand',
            'recording',
            'select-background',
            'settings',
            'shareaudio',
            'sharedvideo',
            'shortcuts',
            'stats',
            'tileview',
            'toggle-camera',
            'videoquality',
            'etherpad',
        ],

    },

    //jwt: '<jwt_token>',

    userInfo: {
        email: 'email@jitsiexamplemail.com',
        displayName: 'John Doe'
    }

};