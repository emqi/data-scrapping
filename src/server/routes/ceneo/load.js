const db = require("../../../database/database");

module.exports = async function (req, res) {
    const dbConnector = await db.getConnection();

    dbConnector.any("SELECT * FROM reviews_transform")
        .then(function (transformedReviews) {
            // TODO: prevent from duplicated reviews (similar like in whole process)
            transformedReviews.forEach(review => {
                dbConnector.none('INSERT INTO reviews(id, reviewerUsername, rating, upvotes, downvotes, date, reviewedAfter, content, reviewerBoughtProduct, productId) ' +
                    'VALUES(${id}, ${reviewerUsername}, ${rating}, ${upvotes}, ${downvotes}, ${date}, ${reviewedAfter}, ${content}, ${reviewerBoughtProduct}, ${productId})', {
                    id: review.id,
                    reviewerUsername: review.username,
                    rating: review.rating,
                    upvotes: review.upvotes,
                    downvotes: review.downvotes,
                    date: review.date,
                    reviewedAfter: review.reviewedafter,
                    content: review.content,
                    reviewerBoughtProduct: review.reviewerboughtproduct,
                    productId: review.productid
                });
            });
            dbConnector.none('DELETE FROM reviews_transform')
                .then(() => console.log('DELETE FROM reviews_transform'))
                .catch(() => console.log("Error while deleting from reviews_transform"));
            return res.json(transformedReviews.length);
        })
        .catch(function () {
                console.log("Error");
                // return res.json("Error");
            }
        );
};
