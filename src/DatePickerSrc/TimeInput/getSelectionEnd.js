

let document = global.document;

export default function getSelectionEnd(o) {
    if (o.createTextRange && !global.getSelection) {
        let r = document.selection.createRange().duplicate();
        r.moveStart('character', -o.value.length);
        return r.text.length;
    } else {
        return o.selectionEnd;
    }
}
