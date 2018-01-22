const pgp = require('pg-promise')({
    promiseLib: require('bluebird'),
    noWarnings: true});

const databases = {
    xyz: pgp(process.env.POSTGRES),
    ghs: pgp(process.env.POSTGRES_GHS)
};

function grid(req, res) {
    // let q = [
    //     "SELECT lon, lat,",
    //     req.query.id ? req.query.id : "null AS id",",",
    //     req.query.c, " AS C,",
    //     req.query.v, " AS V FROM",
    //     req.query.table, "WHERE ST_DWithin(ST_MakeEnvelope(",
    //     req.query.west, ",",
    //     req.query.south, ",",
    //     req.query.east, ",",
    //     req.query.north, ", 4326), geomcntr, 0) AND",
    //     req.query.c, ">= 1 LIMIT 10000"
    // ].join(" ");

    let q = `SELECT
               lon,
               lat,
               ${req.query.id ? req.query.id : "null as id"},
               ${req.query.c} as C,
               ${req.query.v} as V
             FROM ${req.query.table}
             WHERE ST_DWithin(
                     ST_MakeEnvelope(
                       ${req.query.west},
                       ${req.query.south},
                       ${req.query.east},
                       ${req.query.north},
                       4326),
                     geomcntr, 0)
               AND ${req.query.c} >= 1 LIMIT 10000;`
 
    //console.log(q);

    databases[req.query.database].any(q)
        .then(function (data) {

            // console.log(Object.keys(data).map(function (record) {
            //     return Object.keys(data[record]).map(function (field) {
            //         return data[record][field];
            //     });
            // }));

            res.status(200).json(Object.keys(data).map(function (record) {
                return Object.keys(data[record]).map(function (field) {
                    return data[record][field];
                });
            }));
        });
}

function info(req, res) {

    let q = `SELECT
               ${req.body.infoj} as infoj
             FROM gb_hx_1k
             WHERE
               ST_DWithin(
                 ST_SetSRID(
                   ST_GeomFromGeoJSON('${JSON.stringify(req.body.geometry)}'),
                   4326),
                 gb_hx_1k.geomcntr, 0);`

    //console.log(q);

    databases[req.body.database].any(q)
        .then(function (data) {

            // console.log(Object.keys(data).map(function (record) {
            //     return Object.keys(data[record]).map(function (field) {
            //         return data[record][field];
            //     });
            // }));

            console.log(data[0].infoj);

            res.status(200).json(data[0].infoj);

            // res.status(200).json(Object.keys(data).map(function (record) {
            //     return Object.keys(data[record]).map(function (field) {
            //         return data[record][field];
            //     });
            // }));
        });
}

module.exports = {
    grid: grid,
    info: info
};