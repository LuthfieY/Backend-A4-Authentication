const {
    body
} = require('express-validator');
const userAuth = require('../models/userAuth.js');

const validateUserAuth = [
    body('email').notEmpty().withMessage('email tidak boleh kosong')
    .isEmail().withMessage('field ini harus berbentuk email').bail().trim().escape()
    .custom(value => {
        return userAuth.findOne({
            email: value
        }).then(user => {
            if (user) {
                return Promise.reject('email is already in use')
            }
        })
    }),
    body('password').notEmpty()
    .isLength({
        min: 8
    }).withMessage('password minimal 8 karakter').exists(),
    body('confirmPassword', 'Password dan konfirmasi password harus sama').notEmpty().withMessage('konfirmasi password harus diisi').exists()
    .custom((value, {
        req
    }) => value === req.body.password),
    body('name').notEmpty().withMessage('Nama tidak boleh kosong').bail()
    .exists().isLength({
        min: 3
    }).withMessage('Nama minimalah 3 karakter')
]

const validateMerchant = [
    body('nama_mitra').notEmpty().withMessage('nama mitra ini tidak boleh kosong').isLength({
        min: 3
    }).withMessage('Panjang karakter minimal 3').bail().trim(),
    body('alamat_mitra').notEmpty().withMessage('alamat usaha ini tidak boleh kosong').isLength({
        min: 3
    }).withMessage('Panjang karakter minimal 3').bail().trim(),
    body('nama_usaha').notEmpty().withMessage('nama usaha ini tidak boleh kosong').bail().trim()
]

module.exports = {validateUserAuth, validateMerchant}