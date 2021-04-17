const mongoose = require("mongoose");


const projectDetailSchema = mongoose.Schema({
    clientBrief: String,

    deliverables: [String],

    marketRes: {
        done: { type: Boolean, default: false },
        deadline: Date,
        detail: String
    },

    moodBrd: {
        done: { type: Boolean, default: false },
        deadline: Date,
        detail: String,
        filePath: String
    },

    brainStorm: {
        done: { type: Boolean, default: false },
        detail: String,
    },

    conceptDevt: {
        done: { type: Boolean, default: false },
        detail: String
    },

    visualExp: {
        done: { type: Boolean, default: false },
        deadline: Date,
    },

    conceptRef: {
        done: { type: Boolean, default: false },
        deadline: Date,
    },

    firstDraft: {
        done: { type: Boolean, default: false },
        deadline: Date,
        filePath: String,
    },

    presentation: {
        done: { type: Boolean, default: false },
        deadline: Date,
        filePath: String,
    },

    clientFdbk: String,

    revision: {
        done: { type: Boolean, default: false },
        deadline: Date
    },

    clientApproval: {
        done: { type: Boolean, default: false },
        deadline: Date
    },

    production: {
        done: { type: Boolean, default: false },
        deadline: Date,
        filePath: String,
        detail: String
    },

    satisfaction: Number,

    onTime: {
        done: { type: Boolean, default: false },
        detail: String
    }
});

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = {
    ProjectDetail,
    projectDetailSchema
};