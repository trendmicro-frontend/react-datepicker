import toMoment from '../toMoment';

const CONFIG = {
    // the format in which days should be displayed in month view
    dayFormat: 'D',

    // the format in which months should be displayed in year view
    monthFormat: 'MMMM',

    // the format in which years should be displayed in decade view
    yearFormat: 'YYYY'
};

const f = (mom, format) => toMoment(mom).format(format);

export default {

    day(mom, format) {
        return f(mom, format || CONFIG.dayFormat);
    },

    month(mom, format) {
        return f(mom, format || CONFIG.monthFormat);
    },

    year(mom, format) {
        return f(mom, format || CONFIG.yearFormat);
    }
};
