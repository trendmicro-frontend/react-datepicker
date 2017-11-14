export default (...args) => {
    if (args.length === 1 && Array.isArray(args[0])) {
        args = args[0];
    }

    return args.filter(x => !!x).join(' ');
};
