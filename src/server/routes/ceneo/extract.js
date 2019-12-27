const extract = require("../../routes/utils/extract");
const getTestProducts = require("../../../tmp/dummy");
const db = require("../../../database/database");

function transformRating(rating) {
    let parsedRating = parseFloat(
        rating
            .replace(",", ".")
            .replace("/5", ""));
    return Number.isNaN(parsedRating) ? null : parsedRating;
}

function transform(reviews) {
    let transformedReviews = [];
    reviews.forEach(review => {
        let transformedReview = {
            reviewId: review.reviewId,
            reviewer: {avatar: review.reviewer.avatar, username: review.reviewer.username.trim()},
            rating: transformRating(review.rating),
            usefulness: {upvotes: review.usefulness.upvotes, downvotes: review.usefulness.downvotes},
            date: review.date,
            reviewedAfter: review.reviewedAfter,
            text: review.text,
            didUserBuyTheProduct: review.didUserBuyTheProduct
        };
        transformedReviews.push(transformedReview);
    });
    return transformedReviews;
}


function transformTest(reviews) {
    let transformedReviews = [];
    reviews.forEach(review => {
        let transformedReview = {
            id: review.id,
            avatar: review.avatar,
            username: review.username.trim(),
            rating: transformRating(review.rating),
            upvotes: review.upvotes,
            downvotes: review.downvotes,
            date: review.date,
            reviewedAfter: review.reviewedafter,
            content: review.content,
            reviewerBoughtProduct: review.reviewerboughtproduct,
            productId: review.productid
        };
        transformedReviews.push(transformedReview);
    });
    return transformedReviews;
}

async function wholeProcess(res, products) {
    let dbConnector = await db.getConnection();

    let numberOfRecords = 0;
    // E - products
    products.forEach(product => {
        // T
        const transformedReviews = transform(product.reviews);

        dbConnector.none('INSERT INTO products(id, name, description, rating, price) ' +
            'VALUES(${id}, ${name}, ${description}, ${rating}, ${price})', {
            id: product.id,
            name: product.name,
            description: product.description,
            rating: product.rating,
            price: product.price
        }).catch(function () {
                return res.json("Error");
            }
        );

        // L
        dbConnector.any("SELECT * FROM reviews where productId = ${productId}", {productId: product.id})
            .then(function (existingReviews) {
                let existingReviewsIds = existingReviews.map(review => review.id);
                let filteredReviews = transformedReviews.filter(function (review) {
                    return !existingReviewsIds.includes(review.reviewId.toString()) // TODO: id enough?
                });
                numberOfRecords += filteredReviews.length; // TODO fix calculating

                filteredReviews.forEach(review => {
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
                        productId: product.id
                    });
                });
            })
            .catch(function () {
                    return res.json("Error");
                }
            );
    });
    return res.json(numberOfRecords);
}

module.exports = async function (req, res) {
    const phrase = req.query.phrase;
    const pagesToSearch = req.query.pagesToSearch;
    const mapping = req.query.mapping;
    // const phrase = "telewizor";
    // const pagesToSearch = 1;

    const dbConnector = await db.getConnection();
    // GET RESULT REVIEWS
    if (mapping === '11') {
        dbConnector.any("select * from reviews left join products on productId = products.id")
            .then(function (allReviews) {
                return res.json(allReviews);
            })
            .catch(function () {
                    return res.json("Error");
                }
            )
    }


    // ETL PROCESS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    if (mapping === '123') {
        const data = await extract(phrase, pagesToSearch);
        await wholeProcess(res, data);
    }
    // EXTRACT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    if (mapping === '1') {
        // if (mapping === 'EXTRACT') {
        let TODO_RENAME = 0;

        const products = await extract(phrase, pagesToSearch);
        // const products = getTestProductWithOpinions();
        let count = 0;
        let reviewsCount = data.forEach(product => count += product.reviews.length);
        console.log("number of reviews: " + reviewsCount);
        products.forEach(product => {
            dbConnector.none('INSERT INTO products(id, name, description, rating, price) ' +
                'VALUES(${id}, ${name}, ${description}, ${rating}, ${price})', {
                id: product.id,
                name: product.name,
                description: product.description,
                rating: product.rating,
                price: product.price
            }).catch(function () {
                return res.json("Error");
            });

            TODO_RENAME += product.reviews.length;
            product.reviews.forEach(review => {
                dbConnector.none('INSERT INTO reviews_extract(id, avatar, username, rating, upvotes, downvotes, date, reviewedAfter, content, reviewerBoughtProduct, productId) ' +
                    'VALUES(${id}, ${avatar}, ${username}, ${rating}, ${upvotes}, ${downvotes}, ${date}, ${reviewedAfter}, ${content}, ${reviewerBoughtProduct}, ${productId})', {
                    id: review.reviewId,
                    avatar: review.reviewer.avatar,
                    username: review.reviewer.username,
                    rating: review.rating,
                    upvotes: review.usefulness.upvotes,
                    downvotes: review.usefulness.downvotes,
                    date: review.date,
                    reviewedAfter: review.reviewedAfter,
                    content: review.text,
                    reviewerBoughtProduct: review.didUserBuyTheProduct,
                    productId: product.id
                }).catch(function () {
                    return res.json("Error");
                });
            });
        });
        return res.json(TODO_RENAME);
    }

    // TRANSFORM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    else if (mapping === '2') {
        // else if (mapping === 'TRANSFORM') {
        dbConnector.any("SELECT * FROM reviews_extract")
            .then(function (reviews) {
                const transformedReviews = transformTest(reviews);
                transformedReviews.forEach(review => {
                    dbConnector.none('INSERT INTO reviews_transform(id, avatar, username, rating, upvotes, downvotes, date, reviewedAfter, content, reviewerBoughtProduct, productId) ' +
                        'VALUES(${id}, ${avatar}, ${username}, ${rating}, ${upvotes}, ${downvotes}, ${date}, ${reviewedAfter}, ${content}, ${reviewerBoughtProduct}, ${productId})', {
                        id: review.id,
                        avatar: review.avatar,
                        username: review.username,
                        rating: review.rating,
                        upvotes: review.upvotes,
                        downvotes: review.downvotes,
                        date: review.date,
                        reviewedAfter: review.reviewedAfter,
                        content: review.content,
                        reviewerBoughtProduct: review.reviewerBoughtProduct,
                        productId: review.productId
                    }).catch(function () {
                        return res.json("Error");
                    });
                });

                dbConnector.none('DELETE FROM reviews_extract')
                    .then(() => console.log('DELETE FROM reviews_extract'));
                return res.json(reviews.length);
            });
    } else if (mapping === '3') {
        // } else if (mapping === 'LOAD') {

        dbConnector.any("SELECT * FROM reviews_transform")
            .then(function (transformedReviews) {
                // TODO: jezeli mozna wykonac load wiele razy to trzeba filtrowac reviews zeby nie duplikowac
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
                    .then(() => console.log('DELETE FROM reviews_transform'));
                return res.json(transformedReviews.length);
            })
            .catch(function () {
                    console.log("Error");
                    // return res.json("Error");
                }
            );
    }


};


