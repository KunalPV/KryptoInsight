const express = require('express');
const tokenController = require('../controllers/tokenController')

const router = express.Router();

router.get('/getTokenBalance', tokenController.getTokenBalanceByAddress);

module.exports = router;