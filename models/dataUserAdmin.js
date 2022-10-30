const mongoose = require('mongoose')

const dataUserAdminSchema = new mongoose.Schema({
    avatar: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    no_telepon: {
        type: String,
        required: true
    },
    tanggal_lahir: {
        type: Date,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('data_user_admin', dataUserAdminSchema)