const { Router } = require('express');

module.exports = (ddb, table, router = new Router()) => {
    router.get('/_health_check', async(req, res) => {
        res.send({
            success: true,
            message: 'Alive!'
        });
    });

    return router;
};
