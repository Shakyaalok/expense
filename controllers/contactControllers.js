const contactModels = require('../models/contactModels')
const sequelize = require('../utils/db')


const contactVisit = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, mobile, query } = req.body;
        if (!mobile) {
            await t.rollback();
            return res.status(200).json({ message: "Mobile number is required" })
        }
        if (mobile.length > 10) {
            await t.rollback();
            return res.status(200).json({ message: "Not a Valid Number" })
        }
        if (!query) {
            await t.rollback();
            return res.status(200).json({ message: "Please enter your query" })
        }

        await contactModels.create({ name, email, mobile, query })
        await t.commit();
        res.status(201).json({ message: 'sent successfully!' })
    } catch (error) {
        await t.rollback();
        res.status(200).json({ message: "something went wrong" })
    }
}


// i was thinking a register user should enter his mobile number or name becuase they are already our customer so why we need name of register users
const contact = async(req, res) => {
    const t = await sequelize.transaction();
    const userId = req.user.id;
    // console.log('id----------------------------------------->', userId)
    try {
        const { name, email, mobile, query } = req.body;
        if (!mobile) {
            await t.rollback();
            return res.status(200).json({ message: "Mobile number is required" })
        }
        if (mobile.length > 10) {
            await t.rollback();
            return res.status(200).json({ message: "Not a Valid Number" })
        }
        if (!query) {
            await t.rollback();
            return res.status(200).json({ message: "Please enter your query" })
        }
        await contactModels.create({ name, email, mobile, query, userId })
        await t.commit();
        res.status(201).json({ message: "sent successfully!" })

    } catch (error) {
        await t.rollback();
        res.status(200).json({ message: "something went wrong" })
    }
}


module.exports = { contact, contactVisit }