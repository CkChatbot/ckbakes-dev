require('dotenv-extended').load();

const sql = require('mssql');

const config = require("../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

const DBConfig = {
    database: config.dbstorage.DB.mssqlDB.DatabaseName,
    authentication: {
        options: {
            userName: config.dbstorage.DB.mssqlDB.UserName,
            password: config.dbstorage.DB.mssqlDB.Password,
        },
        type: "default",
    },
    server: config.dbstorage.DB.mssqlDB.ServerName,
    connectionTimeout: 0,
    requestTimeout: 0,
    encrypt: true,
    options: {
        connectionTimeout: 0,
        requestTimeout: 0,
        encrypt: true,
        enableArithAbort: false
    },
};

const dataAccessor = async (Category) => {
    
    try {
        let pool = await sql.connect(DBConfig);
        let que = "select * from chatbot_webchat1 where Category = '" + Category + "'"
        //let que = "select * from chatbot_webchat1 where Category = 'Cakes'"

        let result = await pool.request()
            .query(que);

        if (result.recordset.length >= 1) {
            pool = null;
            return { result: result.recordset, error: false };
        } else {
            pool = null;
            return { result: [], error: false };
        }

    } catch (err) {
        console.log("catchblock in Employee Travel Data", err);
        pool = null;
        return { result: [], error: true };
    }
};










module.exports = {
    dataAccessor
    
};