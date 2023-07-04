const mongoose = require('mongoose');
const Joi = require('joi')

const productSchema = new mongoose.Schema({
    productName: String,
    info: String,
    img_url: String,
    priceEtimate: Number,
    customerName: String,
    customerMail: String,
    topOffer: {
        type: Number, default: 0
    },
    // 0 ממתיל לאישור מנהל
    // 1 מאושר ע"י מנהל
    // 2 נגמר הזמן להצעת הגשות
    status: {
        type: Number, default: 0
    },
    user_id: String,
    date_created: {
        type: Date, default: Date.now()
    }
})

exports.ProductModel = mongoose.model("products", productSchema);

exports.validateProduct = (_reqBody) => {
    let schemaJoi = Joi.object({
        productName: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(9999).required(),
        img_url: Joi.string().min(2).max(500).required(),
        priceEtimate: Joi.number().min(1).max(9999999).required(),
        customerName: Joi.string().min(2).max(99).allow(null, ""),
        customerMail: Joi.string().min(2).max(99).email().allow(null, ""),
        topOffer: Joi.number().min(1).max(9999999).allow(null, ""),
        status: Joi.number().min(0).max(2).allow(null, ""),
    })
    return schemaJoi.validate(_reqBody);
}