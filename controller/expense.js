
const User = require('../models/user')
const Expense = require('../models/expenses')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
const AWS=require('aws-sdk');

const addExpense = (req,res) => {
    const {amount,description,category}=req.body;
    req.user.createExpense({
        amount : amount,
        description : description,
        category : category
    })
    .then(expense => {
        return res.status(201).json({expense, success:true, message:'expense added successfully'})
    })
    .catch(err=>{
        console.log(err)
        return res.status(403).json({success:false,message:'expense not added'})

    })
}


const getexpenses = (req, res)=> {
    req.user.getExpenses()
    .then(expenses => {
        return res.status(200).json({expenses, success: true,message:'expense will get displayed'})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

 const deleteexpense = (req, res) => {
    const expenseid = req.params.id;
    console.log(expenseid)
    Expense.destroy({where: { id: expenseid }})
    .then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

const downloadExpenses =  async (req, res) => {
    const userId = req.user.id
    const expenses = await req.user.getExpenses()
    const stringifiedExp = JSON.stringify(expenses)
    const filename = `myexpenselist${userId}/${new Date()}.txt`

    let s3Bucket = new AWS.S3({
        accessKeyId: 'AKIAYO2P73RJ2NGN3WD4',
        secretAccessKey:'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',
       
// AKIAYO2P73RJ2NGN3WD4
// Secret Access Key:
// 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
    })

    let params = {
        Bucket: 'myexpenselist',
        Key: filename,
        Body: stringifiedExp,
        ACL: 'public-read'
    }

    s3Bucket.upload(params, (err, s3Response)=>{
        if(err){
            console.log(err)
        }
        else{
            //console.log(s3Response)
            let fileURL = s3Response.Location
            res.status(200).json({fileURL, msg:'File downloaded Successfully'})
        }
    })

};

module.exports = { addExpense, getexpenses, deleteexpense, downloadExpenses };