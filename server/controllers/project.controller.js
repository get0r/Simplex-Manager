const mongoose = require('mongoose');

const { logger } = require("../config/logger");
const { ProjectDetail } = require("../models/project.detail.model");
const { Project } = require("../models/project.model");
const { DeletedProject } = require("../models/deleted.project.model");
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


/**
 * a method to get projects which are in the state *ongoing.
 * @param {Object} req request object
 * @param {Object} res response object
 */
const getAllOngoingProjects = async (req, res) => {
    try {
        const projects = await Project.find({state: 0}).lean();

        //check if there are ongoing projects and send them.
        if(projects) {
            return sendSuccess(res, projects);
        }

    } catch(e) {
        logger.error(`Unable to get all ongoing projects due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, "Sorry, Something went wrong. Please try later!");
    }
    return sendSuccess(res, []);
};

/**
 * a method to remove a single project by taking the id from the url
 * @param {Object} req request object
 * @param {Object} res response object
 */
const removeProject =  async (req, res) => {
    const id = req.params.id;

    try {
        //check if the project exists
        const project = await Project.findOne({_id: mongoose.Types.ObjectId(id)});

        if(project) {
            ///first save the project to the deleted section
            //and delete it from the project section
            //get the project detail
            const projectDetail = await ProjectDetail.findOne({_id: project.detailId });

            //clean project for deleted state saving
            const projectObject = await project.toObject();
            delete projectObject._id;
            delete projectObject.__v;
            delete projectObject.detailId;

            //embedd the project detail inside the project document
            projectObject.detail = await projectDetail.toObject();
            delete projectObject.detail._id;
            delete projectObject.detail.__v;
            const deletedProject = new DeletedProject(projectObject);
            await deletedProject.save();

            await projectDetail.remove();
            await project.remove();

            return sendSuccess(res, deletedProject);
        }
        return sendError(res, responseConstants.BAD_REQUEST_CODE, `Project Not Found!`);
    } catch (e) {
        logger.error(`Unable to remove project with id --- ${id} --- due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, `Sorry! Something went wrong, try again!`);
    }

};

module.exports = {
    createProject,
    getAllOngoingProjects,
    removeProject
};