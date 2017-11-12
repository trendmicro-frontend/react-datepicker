export default (str) => {
    return str ?
        str.charAt(0).toUpperCase() + str.substr(1) :
        '';
};
