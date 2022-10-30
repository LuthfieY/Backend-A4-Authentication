const mongoose = require('mongoose')

const dataUserSchema = new mongoose.Schema({
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
    isMitra: {
        type: Boolean,
        required: true,
        default:false
    },
    nama: {
        type: String,
        required: true
    },
    keranjang_restauran: {
        type: Array,
        required: false
    },
    data_mitra: {
        type: Object,
        required: false
    }

})

module.exports = mongoose.model('data_user', dataUserSchema)