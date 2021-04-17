const mongoose = require('mongoose');

const { projectSchema } = require("./project.model");
const { projectDetailSchema } = require("./project.detail.model");

const deletedProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
   },

   startDate: {
       type: Date,
       default: new Date(),
   },

   deadline: {
       type: Date,
       required: true,
   },

   prority: {
       type: Number,
       default: -1,
   },

   clientId: {
       type: mongoose.SchemaTypes.ObjectId,
       required: true,
       trim: true,
       ref: 'Client'
   },

   assignedTo: [String],

   owner: {
       type: String,
       required: true
   },

   reportTo: {
       type: String,
       required: true
   },

   requestDesc: String,

   detail: projectDetailSchema,

   state: {
       type: Number,
       default: 0,
   }
});

//since the attributes of the deleted and the undeleted projects are the same
//projectSchema is assigned

const DeletedProject = mongoose.model('deletedProject', deletedProjectSchema);

module.exports = {
    DeletedProject
};