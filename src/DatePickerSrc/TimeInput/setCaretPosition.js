export default function setCaretPosition(elem, caretPos) {
    let start = caretPos;
    let end = caretPos;

    if (caretPos && (caretPos.start !== undefined || caretPos.end !== undefined)) {
        start = caretPos.start || 0;
        end = caretPos.end || start;
    }

    if (elem != null) {
        if (elem.createTextRange) {
            let range = elem.createTextRange();
            range.moveStart('character', start);
            range.moveEnd('character', end);
            range.select();
        } else {
            elem.focus();
            elem.setSelectionRange(start, end);
        }
    }
}
