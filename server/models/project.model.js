const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
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
       required: true,
   },

   clientId: {
       type: mongoose.SchemaTypes.ObjectId,
       required: true,
       trim: true
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

   detailId: {
       type: mongoose.SchemaTypes.ObjectId,
       required: true,
   },

   state: {
       type: Number,
       default: 0,
   }

});

const Project = mongoose.model('Project', projectSchema);

module.exports = {
    Project
};