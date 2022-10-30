const express = require('express')
const router = express.Router()

const {
    updateCustomerProfile,
    updateMerchantProfile
} = require('../../controllers/dataUserController')

const {
    authToken,
    authMerchant,
    authAdmin,
    setUserDataById,
    setMerchantDataById,
    setAdminDataById,
} = require('../../controllers/userAuthController')

router.get('/customer', authToken, (req, res) => {
    console.log('Ini untuk halaman customer')
})

router.get('/mitra', authToken, setUserDataById, authMerchant(true), (req,res)=>{
    console.log('Ini template untuk halaman mitra')
})

router.get('/admin', authToken, setAdminDataById, authAdmin("super-admin"), (req, res)=>{
    console.log('Ini template untuk halaman admin')
})

router.get('/customer/profile', authToken, setUserDataById, (req, res)=>{
    res.json(res.user)
})

router.get('/merchant/profile', authToken, setUserDataById, authMerchant(true), setMerchantDataById, (req, res)=>{
    res.json(res.merchant)
})

router.get('/admin/profile', authToken, setAdminDataById, authAdmin("super-admin"), (req, res)=>{
    res.json(res.user)
})

router.get('/validator/profile', authToken, setAdminDataById, authAdmin('validator'), (req, res)=>{
    res.json(res.user)
})

router.patch('/customer/profile', authToken, setUserDataById, updateCustomerProfile)

router.patch('/merchant/profile', authToken, setUserDataById, authMerchant(true), setMerchantDataById, updateMerchantProfile)

module.exports = router