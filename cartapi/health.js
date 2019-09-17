const { Router } = require('express');

module.exports = (ddb, table, router = new Router()) => {
    router.get('/cart/:productId', async(req, res) => {
        res.send({
            success: true,
            message: 'Alive!'
        });
    });

    return router;
};
