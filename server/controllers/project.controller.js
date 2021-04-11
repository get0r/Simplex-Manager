const { logger } = require("../config/logger");
const { Client } = require("../models/client.model");
const { ProjectDetail } = require("../models/project.detail.model");
const { Project } = require("../models/project.model");
const responseConstants = require("../utils/constants/responseConstants");
const { sendSuccess, sendError } = require("../utils/responseBuilder");
const { registerClient } = require("./client.controller");


/**
 * a method to create new Project.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns success or error message to the client
 */
const createProject = async (req, res) => {

    const projectInfo = req.body;

    try {

        //check if project Name exists already
        const projectName = await Project.findOne({ name: projectInfo.name });
        if(projectName) {
            return sendError(res, responseConstants.BAD_REQUEST_CODE, 'Project already exists!');
        }
        //first create Project Detail object for referencing later
        const projectDetail = new ProjectDetail();
        await projectDetail.save();

        let clientId = projectInfo.client.id;

        //create client if it's a new client (not a reference).
        if(!clientId) {
            //no id reference provided so create one.
            clientId = registerClient(projectInfo.client);
        }

        //check if the clientId is null as it'd have the value of null if the client
        //has been registered already
        if(!clientId) return sendError(res, responseConstants.BAD_REQUEST_CODE, 'Client already exists!');

        //create the project by linking the above details
        const project = new Project({
            name: projectInfo.name,
            deadline: projectInfo.deadline,
            priority: projectInfo.priority || -1,
            clientId: clientId,
            assignedTo: projectInfo.assignedTo,
            owner: projectInfo.owner,
            reportTo: projectInfo.reportTo,
            requestDesc: projectInfo.requestDesc,
            detailId: projectDetail._id,
        });

        //finally commit saving(creating the project).
        project.save();

        logger.info(`Created new project --- ${JSON.stringify(project)}`);
        return sendSuccess(res, project);

    } catch(e) {
        logger.error(`Unable create new project due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, "Sorry, Something went wrong. Please try later!");
    }
};


module.exports = {
    createProject
};