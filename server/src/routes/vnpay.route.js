const express = require('express');
const router = express.Router();
const vnpayController = require("../controllers/vnpay.controller");

/**
 * @swagger
 * tags:
 *   name: Vnpay
 *   description: Third-party payment gateway
 */

/**
 * @swagger
 * /vnpay/vnpay_ipn:
 *   get:
 *     tags: [Vnpay]
 *     parameters:
 *       - in: query
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/vnpay_ipn", vnpayController.vnpayIpn);

module.exports = router;
