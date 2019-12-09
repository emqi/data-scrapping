const extract = require("../../routes/utils/extract");
const test = require("../../../tmp/test"); // TODO: extract getTestProductWithOpinions to file
const database = require("../../../database/somedb");

module.exports = async function (req, res) {
    const phrase = req.body.phrase;
    const pagesToSearch = req.body.pagesToSearch;

    if (!(Number.isInteger(pagesToSearch) && pagesToSearch > 0))
        return res.json("wrong pages format");
    // TODO database connection should be done somewhere else
    // const data = await extract(phrase, pagesToSearch);
    const testProduct = getTestProductWithOpinions();
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


function getTestProductWithOpinions() {
    return {
        "id": 69232971,
        "name": "Telewizor Philips 55OLED803",
        "description": "Telewizor Philips Przekątna: 55 cali, Rozdzielczość: 4K UHD, Matryca: OLED, Odświeżanie: 120 Hz, Wi-Fi, Tuner: DVB-C, DVB-S, DVB-T, DVB-T2, DVB-S2, Rodzaj ekranu: Prosty, Dostępne łącza bezprzewodowe: Wi-Fi",
        "rating": 4.4,
        "price": 5990,
        "reviews": [
            {
                "reviewId": 8682471,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/9.svg",
                    "username": "Quatro"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 9,
                    "downvotes": 1
                },
                "date": "2018-12-05T22:09:32.000Z",
                "reviewedAfter": 10967792000,
                "text": "Obraz na tym tv jest po prostu świetny trzeba to zobaczyć na własne oczy.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 8583258,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/6.svg",
                    "username": "wither"
                },
                "rating": 4.5,
                "usefulness": {
                    "upvotes": 12,
                    "downvotes": 2
                },
                "date": "2018-11-18T19:12:45.000Z",
                "reviewedAfter": null,
                "text": "Telewizor świetnie sprawuje się w każdych warunkach i w każdych zastosowaniach. Jakość obrazu jest świetna. Ktoś napisał, że system to padaka - sorry, ale ja nie widzę telewizorów za 5 lat z systemami smartTV innymi niż te typu Android lub Apple. Za duża konkurencja. A twój zarzut o wolne działanie jest kompletnie niewiarygodny: po pierwsze sam jestem użytkownikiem i widzę jak system pracuje naprawdę, po drugie nie ma nigdzie indziej takich zarzutów jak na ceneo, a po trzecie filmiki na yt też przeczą temu co piszesz. Na przyszłość pisz trochę obiektywniej.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 10724824,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/7.svg",
                    "username": "Michał"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 2,
                    "downvotes": 0
                },
                "date": "2019-06-10T18:34:44.000Z",
                "reviewedAfter": 1782162000,
                "text": "niesamowite wrażenia z oglądania filmów HDR w odległości około 2,5 m od tv. Czuję się lepiej niż w kinie",
                "didUserBuyTheProduct": true
            },
            {
                "reviewId": 8828078,
                "reviewer": {
                    "avatar": "https://graph.facebook.com/1368393953208805/picture?width=320&height=320",
                    "username": "mr_roba"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 6,
                    "downvotes": 2
                },
                "date": "2018-12-29T10:48:11.000Z",
                "reviewedAfter": 764920000,
                "text": "Telewizor zakupiłem z profesjonalną kalibracją. Obraz powala na kolana.  Jakość wykonania, dźwięk, obsługa na najwyższym poziomie. Idealnie współpracuje z dekoderem - używam do obsługi pilota od TV. Proszę nie słuchajcie tych bredni o wolno działającym Androidzie. Ludzie powielają zasłyszane na forach opinie. Owszem, gdy oglądamy materiał 4k to wolniej reaguje na pilota, ale to jedyna niedogodność. Zabezpieczenie przed wypaleniem działa bardzo dobrze. Gdy nacisniesz pauzę to po minucie włącza się wygaszacz i jest ok. Po miesiącu użytkowania z każdym dnie uwielbiam go coraz bardziej. ",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 10659869,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/1.svg",
                    "username": "Grzegorz"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 1,
                    "downvotes": 0
                },
                "date": "2019-06-08T17:40:07.000Z",
                "reviewedAfter": 490824000,
                "text": "Super , spełnił moje oczekiwania . Zakup uważam za bardzo udany ",
                "didUserBuyTheProduct": true
            },
            {
                "reviewId": 8877798,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/5.svg",
                    "username": "kwolana"
                },
                "rating": 3.5,
                "usefulness": {
                    "upvotes": 2,
                    "downvotes": 2
                },
                "date": "2019-01-07T10:03:26.000Z",
                "reviewedAfter": 174628000,
                "text": "Obraz dosłownie powala (po przesiadce z lcd) nawet po wielu godzinach opatrzenia się z tym obrazem cały czas robi wielkie wrażenie. Eleganckie wykonanie telewizora i wygląd i jakość, ambilight - to wszystko zdecydowany plus. Wyposażenie tj 2 piloty, 4 hdmi, wejście optyczne, rj, usb - wszystko czego potrzeba powinno wystarczyć. Głośniki niestety fatalne (po przesiadce z tv od sony) być może powieszenie na ścianie poprawiłoby trochę odsłuch. Dźwięk jest wyraźny ale tępy i nieprzyjemny. Na szczęście mam swoją grajbelkę - w przeciwnym wypadku chyba bym zrezygnował z tego tv. Ogólnie do oglądania fantastyczny obraz i stosunek jakość/cena w tej chwili bezkonkurencyjny.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 8497649,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/2.svg",
                    "username": "Paweł"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 10,
                    "downvotes": 0
                },
                "date": "2018-10-29T18:09:58.000Z",
                "reviewedAfter": null,
                "text": "Zakupiony parę dni temu, jak na razie nie mam zastrzeżeń , jakość obrazu powala na kolana szczególnie netflix, ale przy zwykłym sygnale sd z kablówki również jest spoko, widać że ten drugi procesor działa ,z androida mało korzystam, wieczorami ambilight robi atmosferę nie potrzebuje odpalić innego światła, na koniec pochwalę design, jest minimalistyczny, elegancki.Fajny drugi pilot z touchpadem, polecam wszystkim nie zdecydowanym.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 10686287,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/7.svg",
                    "username": "Anghor"
                },
                "rating": 3,
                "usefulness": {
                    "upvotes": 3,
                    "downvotes": 5
                },
                "date": "2019-06-21T10:46:28.000Z",
                "reviewedAfter": 3277383000,
                "text": "Nie wszystko złoto\" co... ma idealną czerń.\n\nTo mój pierwszy tydzień z tym TV i dawno nie miałem do czynienia z produktem tak dobrym z jednej strony i tak fatalnym z drugiej.\n\nJakość obrazu jest cudowna. Plastyka, kontrast, efekt HDR, Netflix 4K... wszystko to bajka. I tu kończą się pozytywy. \n\nNegatywy?\n\n- TV otrzymałem z uszkodzonym (nie działającym) pilotem - różdzką. TV za grubą kasę z nagrodami a taka wtopa na dzień dobry.\n\n- Brak obsługi nowszych formatów HDR\n\n- Procesor P5(gen.2) jest potwornym żartem. Może i skalowanie obrazu odwala OK, ale snapdragony w budżetowych Xioami mają więcej mocy.\n\n- Android: prawdopodobnie przez brak mocy opisany powyżej całość działa jak mucha w smole.\n\n- YT bez HDR i dźwięku przestrzennego\n\n- Blokada dźwięku przestrzennego dla innych aplikacji (np. Kodi)\n\n\n\nOgólnie TV dla \"niewymagających\". \n\nWyjąc z pudełka, odpalić TVN, PLayer i Netflix: Tak.\n\nChcesz mieć dostęp do nowoczesnych treści i formatów Video/Dźwięku: NIE\n\n\n\nNiestety kupiłem bezpośrednio w sklepie więc nawet oddać nie ma jak bo \"przecież działa\". Skończy się pewnie na korzystaniu z przystawki Android TV, aby nie korzystać z wbudowanego Adroid TV. Paranoja wg. Philipsa.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 8518088,
                "reviewer": {
                    "avatar": "https://www.ceneo.pl/Content/img/account/avatar/1.svg",
                    "username": "Amadeusz85"
                },
                "rating": 5,
                "usefulness": {
                    "upvotes": 7,
                    "downvotes": 2
                },
                "date": "2018-11-05T12:29:30.000Z",
                "reviewedAfter": null,
                "text": "Czytałem bardzo dużo opinii na temat tego TV , Przetestowałem na sklepie i  Bardzo dobrze radzi sobie z ruchem, oraz naturalnie odwzorowuje kolory, HDR na tym Tv petarda. Czerń wiadomo powala w końcu to Oled. Miałem prędzej TV z androidem i nie rozumiem tego Hejtu bo u mnie działa wszystko ok i na tym również śmiga czekam na aktualizacje do Oreo bo jest ciekaw bardzo Google asystent. Telewizor Warty uwagi polecam samemu sprawdzić jak to wygląda.",
                "didUserBuyTheProduct": false
            },
            {
                "reviewId": 10572116,
                "reviewer": {
                    "avatar": "https://graph.facebook.com/1431681383633706/picture?width=320&height=320",
                    "username": "EDYTA"
                },
                "rating": 2,
                "usefulness": {
                    "upvotes": 1,
                    "downvotes": 13
                },
                "date": "2019-05-05T18:22:52.000Z",
                "reviewedAfter": 1677687000,
                "text": "Tv przyjechał rozregulowany, okropne kolory:( sama musiałam go nastrajać, dalej efekt nie jest powalający... chyba muszę wezwać kogoś do wyregulowania tv.",
                "didUserBuyTheProduct": true
            }
        ]
    };
}
