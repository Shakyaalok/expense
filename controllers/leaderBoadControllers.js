const userModels = require('../models/userModels');
const sequelize = require('../utils/db')



const showleaderBoad = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const leaderBoard = await userModels.findAll({
            order: [
                ['totalExpenses', 'DESC']
            ],

        });

        await t.commit();
        res.status(200).json(leaderBoard);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error calculating expenses' });
    }
}

module.exports = { showleaderBoad }