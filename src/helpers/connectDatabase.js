const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'BookEStore',
    port: 8889,
    connectionLimit : 20,
    multipleStatements: true
});

const queryDB = (sql , arrData) => {
    return new Promise((resolve , reject) => {
        pool.getConnection((err , connection) => {
            if(err) return reject(new Error('CANNOT_CONNECTED_DATABASE'));
            connection.query(sql , arrData , (errQuery, results, fields) =>{
                if(errQuery) return reject(new Error('INVALID_QUERY_SQL'));
                resolve(results);
                connection.release();
            });
        });
    });
}

module.exports = { queryDB };

// const slq = `SELECT * FROM DANHMUCSACH`;
// queryDB(slq)
// .then(data => console.log(JSON.stringify(data)))
// .catch(err => console.log(err.message));
