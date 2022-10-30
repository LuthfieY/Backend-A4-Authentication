require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userAuth = require('../models/userAuth')
const userData = require('../models/dataUser')
const refToken = require('../models/refreshToken')
const adminAuth = require('../models/userAuthAdmin')
const merchantData = require('../models/dataMerchant')
const { Types } = require('mongoose');
const {sendEmail} = require('../helpers')
const {
    validationResult
} = require('express-validator')

const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    } else {
        try {
            const{
                username,
                email,
                password,
                nama,
                alamat,
                no_telepon,
                tanggal_lahir,
                avatar
            } = req.body
            
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new userAuth({
                username: username,
                email: email,
                password: hashedPassword
            })

            await newUser.save()

            const newUserData = new userData({
                _id: savedUser._id,
                nama: nama,
                alamat: alamat,
                no_telepon: no_telepon,
                isMitra: false,
                avatar: avatar,
                keranjang_restauran: []
            })

            await newUserData.save().then(user => {
                return res.status(201).json({
                    success: true,
                    message: 'User berhasil dibuat'
                })
            }).catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'User tidak bisa dibuat'
                })
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

const authUserPassword = async (req, res, next) => {
    let user = req.body

    try{
        user = await userAuth.findOne({username: user.username})
        if(user == null){
            return res.status(404).json({message: 'User belum terdaftar'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }

    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.user = user
            next()
        }else{
            res.status(401).json({message: 'Password salah'})
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const authAdminPassword = async (req, res, next) => {
    let user = req.body

    try{
        user = adminAuth.findOne({username: user.username})
        if(user == null){
            return res.status(404).json({message: 'User belum terdaftar'})
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }

    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.user = user
            next()
        }else{
            res.status(401).json({message: 'Password salah'})
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const authMerchant = (status) => {
    return (req, res, next) => {
        if(res.user.isMitra === status) return next()
        return res.status(403).json({ message: 'User tidak memiliki akses' })
    }
}

const authToken = (req, res, next) => { 
    const authHeader = req.headers['authorization'] // Bearer <token>
    const token = authHeader && authHeader.split(' ')[1] // <token>
    if (token == null) return res.sendStatus(401) // if there isn't any token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{ // verify token
        if(err) return res.sendStatus(403) // if token is invalid
        res.user = user
        next()
    })
}

const authAdmin = (role) => {
    return (req, res, next) => {
        if(res.user.role === role) return next()
        return res.status(403).json({ message: 'User tidak memiliki akses' })
    }
}

const setUserDataById = (req, res, next) => {
    const id = Types.ObjectId(res.user._id)
    userData.findOne({ _id: id }, (err, user) => {
        if(err) return res.status(500).json({ message: err.message })
        if(!user) return res.status(403).json({ message: 'User tidak ditemukan' })
        res.user = user
        next()
    })
}

const setMerchantDataById = (req, res, next) => {
    const id = Types.ObjectId(res.user.data_mitra)
    merchantData.findOne({ _id: id }, (err, merchant) => {
        if(err) return res.status(500).json({ message: err.message })
        if(!merchant) return res.status(403).json({ message: 'Merchant tidak ditemukan' })
        res.merchant = merchant
        next()
    })
}

const setAdminDataById = (req, res, next) => {
    const id = Types.ObjectId(res.user._id)
    adminData.findOne({ _id: id }, (err, admin) => {
        if(err) return res.status(500).json({ message: err.message })
        if(!admin) return res.status(403).json({ message: 'Admin tidak ditemukan' })
        res.user = admin
        next()
    })
}

const generateToken = (req, res) => {
    const user = res.user
    const payload = {
        _id: user._id,
        email: user.email
    }
    const accessToken = generateAccessToken(payload)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
    refToken.create({ token: refreshToken }, (err) => {
        if (err) {
            return res.status(500).json({ message: err.message })
        }
        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    })
}

const refreshToken = (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    refToken.findOne({ token: refreshToken }, (err, token) => {
        if(err) return res.status(500).json({ message: err.message })
        if(!token) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ _id: user._id, email: user.email })
            return res.json({ accessToken: accessToken })
        })
    })
}

const logoutUser = (req, res) => {
    refToken.findOneAndDelete({ token: req.body.token }, (err, token) => {
        if(err) return res.status(500).json({ message: err.message })
        if(!token) return res.sendStatus(403)
        return res.sendStatus(204)
    })
}

const forgotPassword = async(req, res) => {
    try{
        const { email } = req.body
        const user = await userAuth.findOne({ email: email })
        if(!user) return res.status(404).json({ message: 'Email tidak ditemukan' })
        const payload = {
            _id: user._id,
            email: user.email
        }
        const secret = process.env.RESET_PASSWORD_KEY + user.password
        const token = jwt.sign(payload, secret, { expiresIn: '15m' })
        const link = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`
        const templateEmail = {
            from: 'Geopark Ciletuh Info <info.proyek3a@gmail.com>',
            to: email,
            subject: 'Reset Password',
            template: 'email',
            context: {
                link: link
            }
        }
        sendEmail(templateEmail)
        res.status(200).json({ message: 'Link reset password telah dikirim ke email anda' })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const resetPassword = async (req, res) => {
    try{
        const { _id, token } = req.params
    
        const user = await userAuth.findOne({ _id: _id })
        if(!user) return res.status(404).json({ message: 'User tidak ditemukan' })

        const secret = process.env.RESET_PASSWORD_KEY + user.password
        jwt.verify(token, secret, (err, decoded) => {
            if(err) return res.status(401).json({ message: 'Link kadaluarsa' })
            const { password } = req.body
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            userAuth.findOneAndUpdate({ _id: _id }, { password: hash }, { new: true }, (err, doc) => {
                if(err) return res.status(500).json({ message: err.message })
                return res.status(200).json({ message: 'Password berhasil diubah' })
            })
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

function generateAccessToken(user) {
    return accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

const insertDataMerchant = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({
            errorMessage: errors.array()
        })
    } else {
        var mitraData = new mitra({
            nama_mitra: req.body.nama_mitra,
            tanggal_bergabung: req.body.tanggal_bergabung,
            logo_mitra: req.files.logo_mitra[0].path,
            alamat_mitra: req.body.alamat_mitra,
            berkas_mitra: {
                nomor_telepon: req.body.nomor_telepon,
                berkas_ktp: req.files.berkas_ktp[0].path,
                berkas_memegang_ktp: req.files.berkas_memegang_ktp[0].path,
                berkas_npwp: req.files.berkas_npwp[0].path,
                berkas_perjanjian: req.files.berkas_perjanjian[0].path,
                foto_produk: req.files.foto_produk[0].path,
                foto_halaman_pertama: req.files.foto_halaman_pertama[0].path,
                foto_restoran_luar: req.files.foto_restoran_luar[0].path,
                foto_restoran_dalam: req.files.foto_restoran_dalam[0].path,
            },
            nama_usaha: req.body.nama_usaha,
            status_kemitraan: 'not activated'
        });

        await mitraData
            .save(mitraData)
            .then(success => {
                res.status(200).send({
                    message: 'Saved Successfully'
                })
            }).catch(failed => {
                res.status(500).send({
                    message: 'Error when insert data because ' + failed.message
                })
            });
    }
}

module.exports = {
    registerUser,
    authUserPassword,
    authAdminPassword,
    authMerchant,
    authToken,
    authAdmin,
    setUserDataById,
    setMerchantDataById,
    setAdminDataById,
    generateToken,
    refreshToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    insertDataMerchant
}