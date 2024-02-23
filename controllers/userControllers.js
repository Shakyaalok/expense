const userModels = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('../utils/db')

const signup = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, email, mobile, password } = req.body

        if (!name) {
            await t.rollback();
            return res.status(200).json({ message: 'Name is required' });
        }
        if (!email) {
            await t.rollback();
            return res.status(200).json({ message: 'Email is required' });
        }
        if (!mobile) {
            await t.rollback();
            return res.status(200).json({ message: 'Mobile is required' });
        }
        if (mobile.length > 10) {
            await t.rollback();
            return res.status(200).json({ message: 'Required valid number' });
        }
        if (!password) {
            await t.rollback();
            return res.status(200).json({ message: 'Password is required' });
        }




        const existingEmail = await userModels.findOne({ where: { email } }, { transaction: t });
        if (existingEmail) {
            await t.rollback();
            return res.status(200).json({ message: 'Email id already exists' })

        }
        const existingMobile = await userModels.findOne({ where: { mobile } });
        if (existingMobile) {
            await t.rollback();
            return res.status(200).json({ message: 'Mobile Number already exists' })

        }



        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const user = await userModels.create({ name, email, mobile, password: hash })
            await t.commit();
            res.status(201).json({
                user: {
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                }
            })
        });

    } catch (error) {
        await t.rollback();
        res.status(200).json({ message: 'something went wrong' })
    }

}


const generatewebToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretKey')
}

const login = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, password } = req.body;

        if (!email) {
            await t.rollback();
            return res.status(200).json({ message: 'Email is required' });
        }
        if (!password) {
            await t.rollback();;
            return res.status(200).json({ message: 'Password is required' });
        }


        const user = await userModels.findOne({ where: { email } })
        if (!user) {
            await t.rollback();
            return res.status(200).json({ message: 'credentials does not match' })
        }
        const match = bcrypt.compareSync(password, user.password); // true
        if (!match) {
            await t.rollback();
            return res.status(200).json({ message: 'credentials does not match' })
        }

        await t.commit()
        return res.status(201).json({ message: 'Login Successffully!', token: generatewebToken(user.id, user.name, user.ispremiumuser) })
    } catch (error) {
        await t.rollback();
        return res.status(200).json({ message: 'something went wrong-->backend from user login controllers' })
    }
}



module.exports = { signup, login }