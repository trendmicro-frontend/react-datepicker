const times = (count) => (count >= 0 ? [...new Array(count)] : []).map((v, i) => i);
export default times;
