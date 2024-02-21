const expenseModel = require('../models/expenseModels');
const fileDownloadModels = require('../models/previousdownloadModels')
const AWS = require('aws-sdk');


const download = async(req, res) => {
    try {
        const expenses = await req.user.getExpenses(); // is line ka matlab bahiya se puchunga mein
        let BriefDetailsofexpense = [];

        for (const data of expenses) {
            let addedDetails = {
                productName: data.productName,
                productPrice: data.productPrice,
                productCategory: data.productCategory,
                Remarks: data.remarks,
                ExpenseDateAndTime: data.createdAt.toLocaleString()
            }

            BriefDetailsofexpense.push(addedDetails)
        }
        // console.log(BriefDetailsofexpense)


        //now taking the data which is an array now are goig to convet it into an array
        const stringifiedExpenses = JSON.stringify(BriefDetailsofexpense)
        const userId = req.user.id;
        const filename = `NewExpense${userId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename); // -->//DataTransfer,filename
        const fileDownload = await fileDownloadModels.create({ fileUrl: fileURL, userId })
        res.status(201).json({ fileURL, success: true, fileDownload })


    } catch (err) {
        res.status(404).json({ message: 'something went wrong in ur s3 credentials', err })
    }

}


function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.Bucket_Name;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })


    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read' // to make the file all time publiciy availbale



    }
    return new Promise((resolve, reject) => {

        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong in ', err);
                reject(err)
            } else {
                // console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })



}


// downloading the previous report
const reportDownload = async(req, res) => {
    try {

        const { userId } = req.params
        const fileDownloadHistory = await fileDownloadModels.findAll({ where: { userId } });
        res.status(201).json({ fileDownloadHistory })
    } catch (error) {
        res.status(200).json({ message: "something went wrong" })
    }
}





module.exports = { download, reportDownload }