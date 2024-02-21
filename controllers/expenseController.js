const expenseModel = require('../models/expenseModels');
const userModels = require('../models/userModels')




const addExpense = async(req, res) => {
    try {
        const { productName, productPrice, productCategory, remarks } = req.body;
        const userId = req.user.id; // we are getting this because we are passing this in token and then we pass this in middle ware and from there we are fetching from this
        // console.log(userId)

        if (!productName) {
            return res.status(200).json({ message: 'Product name is required' })
        }
        if (!productPrice) {
            return res.status(200).json({ message: 'Product price is required' })
        }
        if (!productCategory) {
            return res.status(200).json({ message: 'Product category is required' })
        }


        const expense = await expenseModel.create({ productName, productPrice, productCategory, remarks, userId })
            // adding expense to the user models 
        const totalExpense = Number(req.user.totalExpenses) + Number(productPrice);
        await userModels.update({ totalExpenses: totalExpense }, { where: { id: req.user.id } })
        res.status(201).json({
            message: 'Add Successfully!',
            success: true,
            expense
        })
    } catch (error) {
        res.status(200).json({ message: 'something went wrong' })
    }
}


const getExpenses = async(req, res) => {
    try {
        const userId = req.user.id
        const expenses = await expenseModel.findAll({ where: { userId } });
        res.status(201).json({
            message: 'Your all expense is shown here',
            expenses
        })
    } catch (error) {
        res.status(200).json({ message: 'something went wrong' })
    }
}


const getOneExpense = async(req, res) => {
    try {
        const { id } = req.params
        const expense = await expenseModel.findOne({ where: { id } });
        res.status(200).json({
            expense
        })
    } catch (error) {
        res.status(200).json({ message: 'something went wrong' })
    }
}


const deleteExpense = async(req, res) => {
    // const { id } = req.params
    // await expenseModel.destroy({ where: { id } })
    // res.status(201).json({ message: "Expense has been deleted" })
    try {
        const { id } = req.params

        let amount = 0;
        const partAmountofthatUser = await expenseModel.findOne({ where: { id } });
        const totalAmount = await userModels.findOne({ where: { id: req.user.id } });

        amount = totalAmount.totalExpenses - partAmountofthatUser.productPrice;
        await partAmountofthatUser.destroy({ where: { id } })
        await totalAmount.update({ totalExpenses: amount })
        res.status(201).json({ message: 'deleted Successfully!' })
    } catch (error) {
        res.status(200).json({ message: 'Unable to delete' })
    }
}







module.exports = { addExpense, getExpenses, getOneExpense, deleteExpense }