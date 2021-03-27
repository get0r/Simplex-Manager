const bcrypt = require('bcrypt');
const { logger } = require('../config/logger');

/**
 * a metho to return the hash version of a string given to it.
 * @param {String} str characters to be converted to a hash.
 * @param {Number} saltRounds the round the algorithm should go round to hash.
 * @returns the hash version of the string or null if error happend.
 */

const hashString = async (str, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(str, salt); //password hash
    } catch(e) {
        logger.error(`Unable to hash String due to --- ${e.message}`);
    }
    return null;
};

/**
 * a method to compare encrypted hash to a string by converting it.
 * @param {String} newStr the string to be converted and compared to hash.
 * @param {String} hash the hash to be compared to the new converted string.
 * @returns true if the comparison is successful or false if not.
 */
const compareHash = async (newStr, hash) => {
    try {
        return await bcrypt.compare(newStr, hash);
    } catch(e) {
        logger.error(`Unable to compare hash due to --- ${e.message}`);
    }
    return false;
};

module.exports = {
    hashString,
    compareHash
};