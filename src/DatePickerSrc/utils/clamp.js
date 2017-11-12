const clamp = (value, { min, max, circular = true }) => {
    return value < min ? //eslint-disable-line
        (circular ? max : min) :
        value > max ? //eslint-disable-line
            (circular ? min : max) :
            value;
};

export const clampHour = (value, { max, min, circular }) => {
    return clamp(value, { min: min || 0, max: max || 23, circular });
};

export const clampMinute = (value, { circular }) => {
    return clamp(value, { min: 0, max: 59, circular });
};

export const clampSecond = (value, { circular }) => {
    return clamp(value, { min: 0, max: 59, circular });
};

const MAP = {
    second: clampSecond,
    seconds: clampSecond,
    minute: clampMinute,
    minutes: clampMinute,
    hour: clampHour,
    hours: clampHour
};

export const clampNamed = (name, value, { circular, max, min }) => {
    return MAP[name](value, { circular, max, min });
};

export default clamp;
