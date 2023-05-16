import appDispatcher from '../dispatcher';
import cons from '../state/cons';

export function startVoiceChat() {
    appDispatcher.dispatch({
        type: cons.actions.settings.TOGGLE_PEOPLE_DRAWER,
    });
}
