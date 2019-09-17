const express = require('express');
const app = express();

const aws = require('aws-sdk');
const port = process.env.PORT || 5823;
const bodyParser = require('body-parser');
const region = process.env.REGION;

aws.config.update({region: region});

const ddb = new aws.DynamoDB.DocumentClient();
const table = 'customer-cart';

const cart = require('./cart');
const cartitem = require('./cartitem');
const health = require('./health');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cart(ddb, table));
app.use(cartitem(ddb, table));
app.use(health());

app.listen(port, () =>{
    console.log('Server listening on port ' + port);
});
