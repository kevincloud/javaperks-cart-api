const { Router } = require('express');

module.exports = (ddb, table, router = new Router()) => {
    router.get('/cart/:productId', async(req, res) => {
        var sessionid = req.params.sessionId;
        var productid = req.params.productId;
    
        ddb.get({
            TableName: table,
            Key: {
                'SessionId': sessionid,
                'ProductId': productid
            }
        }, function(err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: err
                })
                console.log("Error", err);
            } else {
                const { Item } = data;
    
                res.send({
                    success: true,
                    message: 'Retrieved item in cart',
                    item: Item
                });
                console.log("Success", data);
            }
        });
    });

    router.put('/cart/:productId', async(req, res) => {
        var sessionid = req.params.sessionId;
        var productid = req.params.productId;
        var quantity = req.params.quantity;
        var datetime = new Date().getTime().toString();
    
        ddb.update({
            TableName: table,
            Key: {
                'SessionId': sessionid,
                'ProductId': productid
            },
            UpdateExpression: "set Quantity = :q, DateStamp = :d",
            ExpressionAttributeValues: {
                ":q": quantity,
                ":d": datetime
            },
            ReturnValues: "UPDATED_NEW"
        }, function(err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: err
                });
                console.log("Error", err);
            } else {
                res.send({
                    success: true,
                    message: 'Item updated'
                });
                console.log("Success", data);
            }
        });
    });

    router.delete('/cart/:productId', async(req, res) => {
        var sessionid = req.body.sessionId;
        var productid = req.params.productId;
    
        console.log("sessionid: " + sessionid);
        console.log("productid: " + productid);
    
        ddb.delete({
            TableName: table,
            Key: {
                'SessionId': sessionid,
                'ProductId': productid
            }
        }, function(err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: err
                });
                console.log("Error", err);
            } else {
                res.send({
                    success: true,
                    message: 'Item deleted'
                });
                console.log("Success", data);
            }
        });
    });

    return router;
};
