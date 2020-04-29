const express = require('express');
const app = express();

const aws = require('aws-sdk');
const port = process.env.PORT || 5821;
const localhost = process.env.LOCALHOST_ONLY || '';
const bodyParser = require('body-parser');
const region = process.env.REGION;
const ipaddr = (localhost == '' ? '0.0.0.0' : '127.0.0.1')

aws.config.update({region: region});

const ddb = new aws.DynamoDB.DocumentClient();
const table = process.env.DDB_TABLE_NAME;

const cart = require('./cart');
const cartitem = require('./cartitem');
const health = require('./health');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cart(ddb, table));
app.use(cartitem(ddb, table));
app.use(health());

app.listen(port, ipaddr, () =>{
    console.log('Server listening on port ' + port);
});
