const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "logo_mitra") {
            cb(null, "../controller/fileController/image");
        } else if (file.fieldname === "berkas_ktp") {
            cb(null, "../controller/fileController/file/berkas_ktp/");
        } else if (file.fieldname === "berkas_memegang_ktp") {
            cb(null, "../controller/fileController/file/berkas_ktp");
        } else if (file.fieldname === "berkas_npwp") {
            cb(null, "../controller/fileController/file/berkas_npwp");
        } else if (file.fieldname === "berkas_perjanjian") {
            cb(null, "../controller/fileController/file/berkas_perjanjian/");
        } else if (file.fieldname === "foto_produk") {
            cb(null, "../controller/fileController/file/foto_produk/");
        } else if (file.fieldname === "foto_halaman_pertama") {
            cb(null, "../controller/fileController/file/foto_halaman_pertama/");
        } else if (file.fieldname === "foto_restoran_luar") {
            cb(null, "../controller/fileController/file/foto_restoran_luar/");
        } else if (file.fieldname === "foto_restoran_dalam") {
            cb(null, "../controller/fileController/file/foto_restoran_dalam/");
        }
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
});

module.exports = {
    upload
}