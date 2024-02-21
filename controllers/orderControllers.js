const orderModels = require('../models/orderModels')
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const sequelize = require('../utils/db')


const generatewebToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretKey')
}


const purchasepremium = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const rzp = new Razorpay({
            key_id: process.env.RazorPay_Key_Id,
            key_secret: process.env.RazorPay_Key_Secret

        });

        const amount = 250000;
        const order = await new Promise((reslove, reject) => {
            rzp.orders.create({ amount, currency: 'INR' }, async(err, order) => {
                if (err) {
                    reject(err)
                } else {
                    reslove(order)
                }
            });
        })



        await req.user.createOrder({ orderid: order.id, status: 'PENDING' }, { transaction: t })
        await t.commit();
        res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const updateTransactions = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await orderModels.findOne({ where: { orderid: order_id } }, { transaction: t });
        await order.update({ paymentid: payment_id, status: "Successfull" }, { transaction: t });

        await req.user.update({ ispremiumuser: true }, { transaction: t });


        // passing the new updated token
        await t.commit();
        res.status(202).json({ success: true, message: "Transaction Successful", token: generatewebToken(userId, undefined, true) });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: "Something went wrong " });
    }
};




module.exports = { purchasepremium, updateTransactions };