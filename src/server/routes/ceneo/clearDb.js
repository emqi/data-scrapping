const db = require("../../../database/database");

module.exports = async function (req, res) {
    const dbConnector = await db.getConnection();
    dbConnector.none('DELETE FROM reviews;')
        .then(() => console.log("Delete reviews_extract"))
        .catch(() => console.log("Error while deleting from table reviews_extract"));
    dbConnector.none('DELETE FROM reviews_transform;')
        .then(() => console.log("Delete reviews_transform"))
        .catch(() => console.log("Error while deleting from table reviews_transform"));
    dbConnector.none('DELETE FROM reviews_extract;')
        .then(() => console.log("Delete reviews"))
        .catch(() => console.log("Error while deleting from table reviews"));
    dbConnector.none('DELETE FROM products;')
        .then(() => console.log("Delete products"))
        .catch(() => console.log("Error while deleting from table products"));
    return res.json({finished: true});
};
