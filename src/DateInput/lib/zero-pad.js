module.exports = function zeroPad(val, digits) {
    while (val.length < digits) {
        val = '0' + val;
    }
    return val;
};
