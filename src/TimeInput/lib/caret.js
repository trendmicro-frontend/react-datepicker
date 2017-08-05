module.exports = {
    start: function(el) {
        return el.selectionStart;
    },
    end: function(el) {
        return el.selectionEnd;
    },
    set: function(el, start, end) {
        el.setSelectionRange(start, end || start);
    }
};
