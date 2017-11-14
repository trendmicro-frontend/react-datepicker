/**
 * Transition-end mapping
 */

let map = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
};

let EL;
let RESULT;

export default () => {
    if (!EL) {
        EL = document.createElement('p');
    }

    if (RESULT) {
        return RESULT;
    }

    for (let transition in map) {
        if (EL.style[transition] != null) {
            RESULT = map[transition];
            break;
        }
    }

    return RESULT;
};
