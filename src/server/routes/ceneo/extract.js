const extract = require("../../routes/utils/extract");
const db = require("../../../database/database");

module.exports = async function (req, res) {
    const phrase = req.query.phrase;
    const pagesToSearch = req.query.pagesToSearch;
    const dbConnector = await db.getConnection();
   
    const data = await staticData(dbConnector, phrase, pagesToSearch)
    return res.json(data);
}

async function staticData(dbConnector, phrase, pagesToSearch) {
  const done = await addToDb(dbConnector, phrase, pagesToSearch);
    if(done){
   return dbConnector.one("SELECT COUNT(*) FROM reviews_extract")
     .then(result => {
         console.log(result)
         return result.count;
     });}
}

async function deleteDb(dbConnector) {
    dbConnector.none('DELETE FROM products;')
   .then(() => {
       console.log("usuniecie bazy")
       }
       )
   .catch(() => console.log("Error while deleting from products"));
}

async function addToDb(dbConnector, phrase, pagesToSearch) {
    await deleteDb(dbConnector);
    const products = await extract(phrase, pagesToSearch);
    // const products = getTestProductWithOpinions();

    products.forEach(product => {
        dbConnector.none('INSERT INTO products(id, name, description, rating, price) ' +
            'VALUES(${id}, ${name}, ${description}, ${rating}, ${price})', {
            id: product.id,
            name: product.name,
            description: product.description,
            rating: product.rating,
            price: product.price
        }).catch(function () {
            console.log("Error while inserting into products");
            // return res.json("Error");
        });

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
            }).catch(function (error) {
                console.log(error);
                // return res.json("Error");
            });
        });
    
    })
    return true;
}
