const mongoose = require('mongoose');

const { logger } = require("../config/logger");
const { ProjectDetail } = require("../models/project.detail.model");
const { Project } = require("../models/project.model");
const { DeletedProject } = require("../models/deleted.project.model");
const responseConstants = require("../utils/constants/responseConstants");
const { sendSuccess, sendError } = require("../utils/responseBuilder");
const { registerClient, clientExists } = require("./client.controller");
const { iterateAndChange } = require('../utils/helperFunctions');


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
        if(!clientId || clientId.length == 0) {
            //no id reference provided so create one.
            clientId = await registerClient(projectInfo.client);
        } else if(!(await clientExists(clientId))) {
            //given the id but client isn't in the databse.
            return sendError(res, responseConstants.BAD_REQUEST_CODE, `Client doesn't exist. Please Create a new one.`);
        }
        //check if the clientId is null as it'd have the value of null if the client
        //has been registered already
        if(!clientId) return sendError(res, responseConstants.BAD_REQUEST_CODE, 'Client already exists! Choose among the list!');

        //create the project by linking the above details
        const project = new Project({
            name: projectInfo.name,
            deadline: projectInfo.deadline,
            priority: projectInfo.priority || -1,
            clientId: clientId,
            assignedTo: projectInfo.assignedTo,
            owner: req.user.username,
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
 * a method to get projects which are in the state *ongoing and either the owner or
 * the reportTo or the assignedTo field contains the current user.
 * @param {Object} req request object
 * @param {Object} res response object
 */
const getEmployeeOngoingProjects = async (req, res) => {
    try {
        const currentUser = req.user.username;
        const projects = await Project.find().or([{"owner": currentUser},
                                                {"reportTo": currentUser},
                                                {"assignedTo": {"$in": [currentUser]}
                                            }]).lean();

        //check if there are ongoing projects and send them.
        if(projects) {
            return sendSuccess(res, projects);
        }

    } catch(e) {
        logger.error(`Unable to get employee based ongoing projects due to --- ${e.message}`);
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
        //id must be 24 hec characters as mongoDB instructs that
        if(id.length != 24) return sendError(res, responseConstants.BAD_REQUEST_CODE, `Project Not Found!`);
        //check if the project exists
        const project = await Project.findOne({_id: mongoose.Types.ObjectId(id)});

        if(project) {
            ///first save the project to the deleted section
            //and delete it from the project section
            //get the project detail
            const projectDetail = await ProjectDetail.findOne({_id: project.detailId });

            //exists---check if he is admin or creator oof the project
            //allow deletion
            if(req.user.userType == 0 ||
               req.user.username === project.owner) {
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

            return sendError(res, responseConstants.UNAUTHORIZED_CODE, `Unauthorized Access`);
        }
        return sendError(res, responseConstants.BAD_REQUEST_CODE, `Project Not Found!`);
    } catch (e) {
        logger.error(`Unable to remove project with id --- ${id} --- due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, `Sorry! Something went wrong, try again!`);
    }

};

/**
 * a method to update a specific attribute in a specific project
 * @param {Object} req request object
 * @param {Object} res response object
 */
const updateProjectDetail = async (req, res) => {
    const projectId = req.params.id;
    //check the existance of the project
    try {
        const project = await Project.findById(mongoose.Types.ObjectId(projectId));

        if(project) {
            //exists so read detail and update
            //const projectDetail = await ProjectDetail({_id: project.detailId});
            //check if he is admin or he is involved in the project
            // to allow editing of project
            if(req.user.userType == 0 ||
                req.user.username === project.owner ||
                req.user.username === project.reportTo ||
                project.assignedTo.includes(req.user.username)) {
                    //get the fields to be edited change the who field to the current user
                    // and merge the object with the existing one
                    const newProjectDetail = req.body;
                    iterateAndChange(newProjectDetail, {who: req.user.username});

                    const projectDetail = await (await ProjectDetail.findById(project.detailId)).toObject();
                    const updatedObject = {...projectDetail, ...newProjectDetail};

                    //commit to databse
                    const update = await ProjectDetail.updateOne({_id: project.detailId}, updatedObject);

                    if(update.nModified === 1)
                        return sendSuccess(res, "Updated Successfully!");
                    return sendSuccess(res, "Nothing was changed!");
            }
            return sendError(res, responseConstants.UNAUTHORIZED_CODE, `Unauthorized Access`);
        }
    } catch (e) {
        logger.error(`Unable to update project with id --- ${id} --- due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, `Sorry! Something went wrong, try again!`);
    }
};

module.exports = {
    createProject,
    getAllOngoingProjects,
    removeProject,
    updateProjectDetail,
    getEmployeeOngoingProjects
};