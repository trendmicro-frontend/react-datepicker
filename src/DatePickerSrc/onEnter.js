export default (fn) => {
    return (event) => {
        if (event.key === 'Enter') {
            fn(event);
        }
    };
};
