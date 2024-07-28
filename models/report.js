const SQL = require("mssql");
const DBCONFIG = require("../dbConfig");

class Report {
    constructor(reportId, contentType, contentId, industry, reason, reportDate) {
        this.reportId = reportId;
        this.contentType = contentType;
        this.contentId = contentId;
        this.industry = industry;
        this.reason = reason;
        this.reportDate = reportDate;
    }

    // called when admin goes to report page
    static async getReports() {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Reports`;
            const result = await connection.request().query(sqlQuery); 
            return result.recordset[0] ? result.recordset.map(row => new Report(
                row.reportId, 
                row.contentType, 
                row.contentId,
                row.industry,
                row.reason,
                row.reportDate
            )) : null;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }

    // called when a user reports a content (article/comment)
    static async createReport(body) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `INSERT INTO 
            Reports (industry, contentType, contentId,  reason, reportDate) 
            VALUES (@industry, @contentType, @contentId, @reason, CONVERT(date, GETDATE())); 
            SELECT SCOPE_IDENTITY() as reportId`;
            const request = connection.request();
            request.input("industry", body.industry);
            request.input("contentType", body.contentType);
            request.input("contentId", body.contentId);
            request.input("reason", body.reason);
            const result = await request.query(sqlQuery);
            connection.close();

            // check if report was added to db
            return this.getReportById(result.recordset[0].reportId);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            if (connection) {
                connection.close();
            }
        } 
    }

    // called when an admin selects "Remove"
    static async deleteReportsByContentId(contentType, contentId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `DELETE FROM Reports WHERE contentType = @contentType AND contentId = @contentId`;
            const request = connection.request();
            request.input("contentType",  contentType);
            request.input("contentId", contentId);
            const result = await request.query(sqlQuery);
            return result.rowsAffected > 0;
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }

    // called when an admin selects "Keep"
    static async deleteReportById(reportId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `DELETE FROM Reports WHERE reportId = @reportId`;
            const request = connection.request();
            request.input('reportId', reportId);
            const result = await request.query(sqlQuery);
            return result.rowsAffected > 0;
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }

    static async getReportById(reportId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Reports WHERE reportId = @reportId`;
            const request = connection.request();
            request.input('reportId', reportId);
            const result = await request.query(sqlQuery); 
            return result.recordset[0] ? new Report(
                result.recordset[0].reportId, 
                result.recordset[0].contentType, 
                result.recordset[0].contentId,
                result.recordset[0].industry,
                result.recordset[0].reason,
                result.recordset[0].reportDate
            ) : null;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }
} 

module.exports = Report;