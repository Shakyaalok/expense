const Sib = require('sib-api-v3-sdk');
const userModels = require('../models/userModels');
const expenseModels = require('../models/expenseModels');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const sequelize = require('../utils/db')



// use of crpto to generta unique id for the params**********

const key = 'mySecretKey';
// Encrypt the ID
const encryptId = (id, key) => {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encryptedId = cipher.update(String(id), 'utf8', 'hex');
    encryptedId += cipher.final('hex');
    return encryptedId;
};

// Decrypt the ID
const decryptId = (encryptedId, key) => {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decryptedId = decipher.update(encryptedId, 'hex', 'utf8');
    decryptedId += decipher.final('utf8');
    return decryptedId;
};


// ends here********

const forgetPassword = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email } = req.body;
        const user = await userModels.findOne({ where: { email } }, { transaction: t })
        if (!user) {
            await t.rollback();
            return res.status(200).json({ message: 'Email id is not register' })
        }


        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SendinBlue_Api_key
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        // const UserId = user.id
        // const UserId = uuid.v4();
        const UserId = encryptId(user.id, key)

        const sender = {
            email: 'shakyaalok99@gmail.com',

        }

        const recievers = [{
            email: user.email,
        }, ]

        tranEmailApi.sendTransacEmail({
                sender,
                to: recievers,
                subject: 'Forget Password',
                textContent: `<a href="http://localhost:4000/forgetpwd.html?id=${UserId}">click here to reset your password</a>`
            })
            .then(console.log)
            .catch(console.log)

        await t.commit();
        res.status(201).json({ message: `Reset link has been sent on ${user.email}` })
    } catch (error) {
        await t.rollback();
        res.status(200).json({ message: 'something went wrong' })
    }

}



// reset and  update password
const resetandUpdatePassword = async(req, res) => {
    try {
        const { id } = req.params;
        const decodeId = decryptId(id, key)
            // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4', decodeId)
        const { newpassword } = req.query;


        const user = await userModels.findOne({ where: { id: decodeId } })
        if (!user) {
            return res.status(200).json({ message: 'user not found' })
        }

        const saltRounds = 10;
        bcrypt.hash(newpassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            user.update({ password: hash })
        });

        // user.update({ password: newpassword })

        res.status(201).json({ message: 'Password has been reset successfully!' })
    } catch (error) {
        res.status(200).json({ message: 'something went wrong' })
    }
}







module.exports = { forgetPassword, resetandUpdatePassword }