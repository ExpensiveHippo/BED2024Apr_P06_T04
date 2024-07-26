const Report = require("../models/report");

const createReport = async (req, res) => {
    const newReport = req.body;

    try {
        const result = await Report.createReport(newReport);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error creating report");
    }
}

const deleteReportById = async (req, res) => {
    const reportId = parseInt(req.params.reportId);

    try {
        const success = await Report.deleteReportById(reportId);

        if (!success) {
            res.status(404).send("Report not found");
        }
        else {
            res.status(204).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error deleting report");
    }
}

const deleteReportsByContentId = async (req, res) => {
    const contentType = req.params.contentType;
    const contentId = parseInt(req.params.contentId);

    try {
        const success = await Report.deleteReportsByContentId(contentType, contentId);

        if (!success) {
            res.status(404).send(`Reports with contentType ${contentType} & contentId ${contentId} not found`);
        } else {
            res.status(204).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error deleting reports");
    }
}

const getReportById = async (req, res) => {
    const reportId = parseInt(req.params.id);

    try {
        const report = Report.getReportById(reportId);
        res.json(report);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving report");
    }
}

module.exports = {
    createReport,
    deleteReportById,
    deleteReportsByContentId,
    getReportById
}

