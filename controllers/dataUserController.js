require('dotenv').config()
const userData = require('../models/dataUser')
const merchantData = require('../models/dataMerchant')
var {
    validationResult
} = require('express-validator')


const updateCustomerProfile = async (req, res) => {
    try{
        const id = Types.ObjectId(res.user._id)
        const data = await userData.findOneAndUpdate({ _id: id }, req.body, { new: true })
        res.json(data)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

const updateMerchantProfile = async (req, res) => {
    try{
        const id = Types.ObjectId(res.merchant._id)
        const data = await merchantData.findOneAndUpdate({ _id: id }, req.body, { new: true })
        res.json(data)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}
module.exports = {
    updateCustomerProfile,
    updateMerchantProfile
}