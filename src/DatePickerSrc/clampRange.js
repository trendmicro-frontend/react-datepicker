export default (range) => {
    if (range[1] && range[0].isAfter(range[1])) {
        range = [range[1], range[0]];
    }

    return range;
};
