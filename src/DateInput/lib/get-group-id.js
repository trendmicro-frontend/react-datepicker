module.exports = function getGroupId(index) {
    if (index < 5) {
        return 0;
    }
    if (index < 8) {
        return 1;
    }
    return 2;
};
