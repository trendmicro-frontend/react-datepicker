import assign from 'object-assign';

const filter = (object) => {
    return Object.keys(object).reduce((acc, prop) => {
        const value = object[prop];

        if (value !== undefined) {
            acc[prop] = value;
        }

        return acc;
    }, {});
};

export default (target, ...args) => {
    return assign(target, ...args.map(filter));
};
