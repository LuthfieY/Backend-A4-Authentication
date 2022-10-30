// Create Schema
const mongoose = require('mongoose');

const mitra = new mongoose.Schema({
    nama_mitra: {
        type: String,
        required: true
    },
    tanggal_bergabung: {
        type: Date,
        required: true,
        default: Date.now
    },
    logo_mitra: {
        type: String
    },
    alamat_mitra: {
        type: String,
        required: true
    },
    berkas_mitra: {
        nomor_telepon: {
            type: String,
            required: true
        },
        berkas_ktp: {
            type: String,
            required: true
        },
        berkas_memegang_ktp: {
            type: String,
            required: true
        },
        berkas_npwp: {
            type: String,
            required: true
        },
        berkas_perjanjian: {
            type: String,
            required: true
        },
        foto_produk: {
            type: String,
            required: true
        },
        foto_halaman_pertama: {
            type: String,
            required: true
        },
        foto_restoran_luar: {
            type: String,
            required: true
        },
        foto_restoran_dalam: {
            type: String,
            required: true
        }
    },
    nama_usaha: {
        type: String,
        required: true
    },
    status_kemitraan: {
        type: String,
        required: true,
        enum: ['activated', 'not activated']
    }
});

module.exports = mongoose.model('mitraData', mitra, 'mitraData');