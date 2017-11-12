export default (className) => {
    return (element, modifier) => {
        const el = element ? `-${element}` : '';
        const mod = modifier ? `--${modifier}` : '';

        return `${className}${el}${mod}`;
    };
};
