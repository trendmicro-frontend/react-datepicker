export default {
    ArrowUp: -7,
    ArrowDown: 7,
    ArrowLeft: -1,
    ArrowRight: 1,

    PageUp(mom) {
        return mom.add(-1, 'month');
    },
    PageDown(mom) {
        return mom.add(1, 'month');
    },
    Home(mom) {
        return mom.startOf('month');
    },
    End(mom) {
        return mom.endOf('month');
    }
};
