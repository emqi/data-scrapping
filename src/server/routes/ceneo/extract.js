const extract = require("../../routes/utils/extract");
const getTestProduct = require("../../../tmp/dummy");
const database = require("../../../database/somedb");

module.exports = async function (req, res) {
    const phrase = req.body.phrase;
    const pagesToSearch = req.body.pagesToSearch;

    if (!(Number.isInteger(pagesToSearch) && pagesToSearch > 0))
        return res.json("wrong pages format");
    // TODO database connection should be done somewhere else
    // const data = await extract(phrase, pagesToSearch);
    const testProduct = getTestProduct();
    // TODO extract database code to separate file


    const pgp = require('pg-promise')(/* initialization options */);

    const connection = {
        host: 'localhost',
        port: 5432,
        database: 'todo',
        user: 'postgres',
        password: 'postgres'
    };
    const db = pgp(connection);
    // TODO first add all reviews of specific product
    await db.none('DROP TABLE IF EXISTS products CASCADE'); // TODO: remove this later to create table if not exists
    await db.none('CREATE TABLE products (' +
        '    id bigint  NOT NULL,' +
        '    name text  NULL,' +
        '    description text  NULL,' +
        '    rating double precision  NULL,' +
        '    price double precision  NULL,' +
        '    PRIMARY KEY (id));'
    );

    let productId = testProduct.id;
    await db.none('INSERT INTO products(id, name, description, rating, price) ' +
        'VALUES(${id}, ${name}, ${description}, ${rating}, ${price})', {
        id: productId,
        name: testProduct.name,
        description: testProduct.description,
        rating: testProduct.rating,
        price: testProduct.price
    });

    await db.none('DROP TABLE IF EXISTS reviews'); // TODO: remove this later to create table if not exists
    await db.none('CREATE TABLE reviews (' +
        '    id bigint  NOT NULL,' +
        '    reviewerUsername text  NULL,' +
        '    rating double precision  NULL,' +
        '    upvotes smallint  NULL,' +
        '    downvotes smallint  NULL,' +
        '    date date  NULL,' +
        '    reviewedAfter bigint  NULL,' +
        '    content text  NULL,' +
        '    reviewerBoughtProduct boolean  NULL,' +
        '    productId bigint  NOT NULL,' +
        'CONSTRAINT reviews_pkey' +
        '    PRIMARY KEY (id),' +
        'CONSTRAINT productId' +
        '    FOREIGN KEY (productId) REFERENCES products(id));');

    let reviews = testProduct.reviews;
    reviews.forEach(review => {
        db.none('INSERT INTO reviews(id, reviewerUsername, rating, upvotes, downvotes, date, reviewedAfter, content, reviewerBoughtProduct, productId) ' +
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


