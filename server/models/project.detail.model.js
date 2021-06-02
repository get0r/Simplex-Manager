const mongoose = require("mongoose");


const projectDetailSchema = mongoose.Schema({
    clientBrief: {
        done: { type: Boolean, default: false },
        detail: String,
        who: { type: String, default:"@none", required: true},
    },

    deliverables: {
        done: { type: Boolean, default: false },
        detail: [String],
        who: { type: String, default:"@none", required: true},
    },

    marketRes: {
        done: { type: Boolean, default: false },
        deadline: Date,
        detail: String,
        who: { type: String, default:"@none", required: true},
    },

    moodBrd: {
        done: { type: Boolean, default: false },
        deadline: Date,
        detail: String,
        filePath: String,
        who: { type: String, default:"@none", required: true},
    },

    brainStorm: {
        done: { type: Boolean, default: false },
        detail: String,
    },

    conceptDevt: {
        done: { type: Boolean, default: false },
        detail: String,
        who: { type: String, default:"@none", required: true},
    },

    visualExp: {
        done: { type: Boolean, default: false },
        deadline: Date,
    },

    conceptRef: {
        done: { type: Boolean, default: false },
        deadline: Date,
        who: { type: String, default:"@none", required: true},
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
        who: { type: String, default:"@none", required: true},
    },

    clientFdbk: {
        done: { type: Boolean, default: false },
        detail: String,
        who: { type: String, default:"@none", required: true},
    },

    revision: {
        done: { type: Boolean, default: false },
        deadline: Date,
        who: { type: String, default:"@none", required: true},
    },

    clientApproval: {
        done: { type: Boolean, default: false },
        deadline: Date,
        who: { type: String, default:"@none", required: true},
    },

    production: {
        done: { type: Boolean, default: false },
        deadline: Date,
        filePath: String,
        detail: String,
        who: { type: String, default:"@none", required: true},
    },

    satisfaction: Number,

    onTime: {
        done: { type: Boolean, default: false },
        detail: String,
        who: { type: String, default:"@none", required: true},
    }
});

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = {
    ProjectDetail,
    projectDetailSchema
};