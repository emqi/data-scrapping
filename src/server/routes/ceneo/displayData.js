const db = require("../../../database/database");

module.exports = async function (req, res) {
    const dbConnector = await db.getConnection();
    dbConnector.any("select * from reviews left join products on productId = products.id")
        .then(function (allReviews) {
            return res.json(allReviews);
        })
        .catch(function () {
                console.log("Error while selecting from reviews");
                return res.json("Error");
            }
        )
};
