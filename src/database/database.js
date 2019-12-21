let dbConnection = null;

// module.exports = getDbConnection = async() => {
const getConnection = async function getDbConnection() {
    if (dbConnection) {
        return dbConnection;
    }
    dbConnection = await setupDatabaseConnection();
    return dbConnection
};

module.exports = {
    getConnection
};

function setupDatabaseConnection() {
    const postgres = require('pg-promise')(/* initialization options */);

    const connection = {
        host: 'localhost',
        port: 5432,
        database: 'todo',
        user: 'postgres',
        password: 'postgres'
    };

    const db = postgres(connection);

    db.none('DROP TABLE IF EXISTS products CASCADE').then(r => console.log(r)); // TODO: remove this later to create table if not exists

    db.none('CREATE TABLE products (' +
        '    id bigint  NOT NULL,' +
        '    name text  NULL,' +
        '    description text  NULL,' +
        '    rating double precision  NULL,' +
        '    price double precision  NULL,' +
        '    PRIMARY KEY (id));'
    ).then(r => console.log(r));


    db.none('DROP TABLE IF EXISTS reviews').then(r => console.log(r)); // TODO: remove this later to create table if not exists
    db.none('CREATE TABLE reviews (' +
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
        // 'CONSTRAINT reviews_pkey' +
        '    PRIMARY KEY (id)')
        // '    PRIMARY KEY (id),' +
        // 'CONSTRAINT productId' +
        // '    FOREIGN KEY (productId) REFERENCES public.products(id));').then(r => console.log(r));
        .then(r => console.log(r));

    return db
}