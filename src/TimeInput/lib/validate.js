module.exports = function validate(val) {
    return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](:[0-9][0-9][0-9])?)?(\s+[ap]m)?$/i.test(val);
};
