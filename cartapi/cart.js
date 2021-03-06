const { Router } = require('express');

module.exports = (ddb, table, router = new Router()) => {
    router.post('/cart', async (req, res) => {
        var sessionid = req.body.sessionId;
        var productid = req.body.productId;
        var quantity = parseInt(req.body.quantity);
        var datetime = new Date().getTime().toString();

        console.log("Add to cart data:");
        console.log(" ... sessionid: " + sessionid);
        console.log(" ... productid: " + productid);
        console.log(" ... quantity: " + quantity);
    
        ddb.query({
            TableName: table,
            KeyConditionExpression: "#sid = :sid and #pid = :pid",
            ExpressionAttributeNames:{
                "#sid": "SessionId",
                "#pid": "ProductId",
            },
            ExpressionAttributeValues: {
                ":sid": sessionid,
                ":pid": productid
            }
        }, function(err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: err
                });
            }
            else {
                if (data.Count == 0) {
                    ddb.put({
                        TableName: table,
                        Item: {
                            'SessionId': sessionid,
                            'ProductId': productid,
                            'Quantity': quantity,
                            'DateStamp': datetime
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
                                message: 'Item added'
                            });
                            console.log("Success", data);
                        }
                    });
                }
                else {
                    quantity += data.Items[0].Quantity;
                    
                    ddb.update({
                        TableName: table,
                        Key: { 'SessionId': sessionid, 'ProductId': productid },
                        UpdateExpression: "set Quantity = :q",
                        ExpressionAttributeValues: {
                            ':q': quantity
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
                }
            }
        });
    });
    
    router.get('/cart', async (req, res) => {
        var sessionid = req.query.sessionId;

        ddb.query({
            TableName: table,
            KeyConditionExpression: '#sid = :sid',
            ExpressionAttributeNames: {
                "#sid": "SessionId"
            },
            ExpressionAttributeValues: {
                ":sid": sessionid
            }
        }, function(err, data) {
            if (err) {
                res.send({
                    success: false,
                    message: err
                })
                console.log("Error", err);
            } else {
                const { Items } = data;
    
                res.send({
                    success: true,
                    message: 'Retrieved all items in cart',
                    items: Items
                });
                console.log("Success", data);
            }
        });
    });

    router.put('/cart', async(req, res) => {
        var sessionid = req.params.sessionId;

        ddb.delete({
            TableName: table,
            Key: {
                'SessionId': sessionid
            },
            ConditionExpression: 'Quantity <= :qty',
            ExpressionAttributeValues: { ":qty": 0 }
        }, function(err, data) {
            if (err) {
                res.send({
                    success: true,
                    message: err
                });
                console.log("Error", err);
            } else {
                res.send({
                    success: true,
                    message: 'Cart is now empty'
                });
                console.log("Success", data);
            }
        });
    });

    router.delete('/cart', async(req, res) => {
        var sessionid = req.params.sessionId;

        ddb.delete({
            TableName: table,
            IndexName: 'SessionIndex',
            KeyConditionExpression: "#sid = :sidvalue",
            ExpressionAttributeNames: {
                "sid": "SessionId"
            },
            ExpressionAttributeValues: {
                ":sidvalue": sessionid
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
                    message: 'Cart is now empty'
                });
                console.log("Success", data);
            }
        });
    });

    return router;
};
