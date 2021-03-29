/**
 * a method to register an admin user.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns success or error message to the client
 */
const createProject = async (req, res) => {
    res.send('Project Created!');
};


module.exports = {
    createProject
};