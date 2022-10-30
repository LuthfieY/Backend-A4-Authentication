const express = require('express')
const router = express.Router()
const {validateUserAuth, validateMerchant} = require('../../validationInput/validation.js')
const {
    upload
} = require('../../controllers/fileController/fileController.js')

const {
    registerUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    authUserPassword,
    generateToken,
    authAdminPassword,
    authMerchant,
    setUserDataById,
    insertDataMerchant
} = require('../../controllers/userAuthController')

router.post('/register', validateUserAuth, registerUser)

router.post('/login-customer', authUserPassword, generateToken)

router.post('/login-merchant', authUserPassword, setUserDataById, authMerchant(true), generateToken)

router.post('/login-admin', authAdminPassword, generateToken)

router.post('/refresh-token', refreshToken)

router.delete('/logout', logoutUser)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:_id/:token', resetPassword)

router.post('/register/merchant', upload.fields([{
    name: "logo_mitra",
    maxCount: 1
},
{
    name: "berkas_ktp",
    maxCount: 1
}, {
    name: "berkas_memegang_ktp",
    maxCount: 1
}, {
    name: "berkas_npwp",
    maxCount: 1
}, {
    name: "berkas_perjanjian",
    maxCount: 1
}, {
    name: "foto_produk",
    maxCount: 1
}, {
    name: "foto_halaman_pertama",
    maxCount: 1
}, {
    name: "foto_restoran_luar",
    maxCount: 1
}, {
    name: "foto_restoran_dalam",
    maxCount: 1
}
]), validateMerchant, insertDataMerchant)

module.exports = router