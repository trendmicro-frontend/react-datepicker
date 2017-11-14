export default (str) => {
    if (typeof str === 'string' && str.length < 2) {
        return str.length ?
            '0' + str :
            '00';
    }

    if (typeof str === 'number') {
        return str < 10 ?
            '0' + str :
            str + '';
    }

    return str;
};
