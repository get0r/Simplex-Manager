
/**
 * a method to recursively iterate through an object and replace a certain fields value
 * @param {Object} original original object to be iterated and altered
 * @param {Object} field a field whose values is to be altered specifically in the original
 */
const iterateAndChange = (original, field) => {
    Object.keys(original).forEach((key) => {
        if(original[key] !== null && typeof original[key] === 'object') {
            //reiterate
            original[key][Object.keys(field)[0]] = field[Object.keys(field)[0]];
        }
    });
};

module.exports = { iterateAndChange };