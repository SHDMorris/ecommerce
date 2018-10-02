let express = require('express');
let mongodb = require('./mongodb.utils');
let product = require('./products');
let bodyParser = require('body-parser');
let dailyInspiration = require('./dailyinspiration');
let axios = require('axios');

let app = express();
let jsonParser = bodyParser.json();

const forismaticUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
const dadJokeUrl = 'https://icanhazdadjoke.com/';

mongodb.connect();
mongodb.createEventListeners();

app.get('/products', (request, response) => {
    let sortInput = request.query.sort;

    if (sortInput) {
        product.sortProduct(sortInput).then(
            (sortedList) => {
                response.status(200).send(sortedList);
            },
            (error) => {
                response.status(500).send("Error")
            });
    }

    product.findAll().then(
        (allProduct) => {
            response.status(200).send(allProduct);
        });
});

app.post('/products', jsonParser, (request, response) => {
    let productData = request.body;

    product.newProduct(productData).then(
        (productSaved) => {
            response.status(200).send(productSaved);
        });
});

app.post('/products/:id/reviews', (req, res) => {
    product.findByIdAndUpdate(req.params.id, { $push: { "reviews": req.body } }, { new: true })
        .then(
            (results) => {
                res.status(200).send(results);
            });
});

app.get('/dailyinspiration', (req, res) => {
    let dadJokePromise = axios.get(dadJokeUrl, { headers: { 'Accept': 'application/json' } }).then(
        (result) => {
            return result.data;
        });

    let inspirationalPromise = axios.get(forismaticUrl);

    let promiseArray = [dadJokePromise, inspirationalPromise];

    Promise.all(promiseArray).then(
        (results) => {
            res.status(200).json({ 'Dad Joke': results[0].joke, 'Inspirational Quote': results[1].data.quoteText + ' - ' + results[1].data.quoteAuthor });
        }
    );

    // dadJokePromise.then(
    //     (result) => {
    //         res.status(200).send(result.data.joke);
    //     })

    // .then(
    //     (result) => {
    //         res.status(200).send(result.data.quoteText + " - " + result.data.quoteAuthor);
    //     }).catch(
    //         (error) => {
    //             console.log('Error');
    //         });
});

app.listen(3000, () => {
    console.log('Beam me up Scotty!');
});

