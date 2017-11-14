export default (a, b) => {
    if (a && b) {
        return (...args) => {
            a(...args);
            b(...args);
        };
    }

    return a || b;
};
