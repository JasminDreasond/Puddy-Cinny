
export function selectButton() {

    if (document.body && document.body.classList) {

        if (document.body.classList.contains('dark-theme')) {
            return 'dark';
        }

        if (document.body.classList.contains('butter-theme')) {
            return 'secondary';
        }

    }

    return 'light'

}