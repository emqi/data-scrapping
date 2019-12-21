const extract = require("../../routes/utils/extract");
const getTestProduct = require("../../../tmp/dummy");
const db = require("../../../database/database");

module.exports = async function (req, res) {
    const phrase = req.query.phrase;
    const pagesToSearch = req.query.pagesToSearch;

    if (!(Number.isInteger(pagesToSearch) && pagesToSearch > 0))
        return res.json("wrong pages format");
    // const data = await extract(phrase, pagesToSearch);

    const testProduct = getTestProduct();
    let productId = testProduct.id;
    let dbConnector = await db.getConnection();
/*    await dbConnector.none('INSERT INTO products(id, name, description, rating, price) ' +
        'VALUES(${id}, ${name}, ${description}, ${rating}, ${price})', {
        id: productId,
        name: testProduct.name,
        description: testProduct.description,
        rating: testProduct.rating,
        price: testProduct.price
    });*/

    let reviews = testProduct.reviews;
    reviews.forEach(review => {
        dbConnector.none('INSERT INTO reviews(id, reviewerUsername, rating, upvotes, downvotes, date, reviewedAfter, content, reviewerBoughtProduct, productId) ' +
            'VALUES(${id}, ${reviewerUsername}, ${rating}, ${upvotes}, ${downvotes}, ${date}, ${reviewedAfter}, ${content}, ${reviewerBoughtProduct}, ${productId})', {
            id: review.reviewId,
            reviewerUsername: review.reviewer.username,
            rating: review.rating,
            upvotes: review.usefulness.upvotes,
            downvotes: review.usefulness.downvotes,
            date: review.date,
            reviewedAfter: review.reviewedAfter,
            content: review.text,
            reviewerBoughtProduct: review.didUserBuyTheProduct,
            productId: productId
        });
        console.log(review.rating)
    });

    return res.json(testProduct);
};


