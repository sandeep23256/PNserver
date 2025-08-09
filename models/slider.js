const mongoose = require('mongoose')

const sliderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
   image: {
    public_id: { 
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}

}, { timestamps: true });
const sliderModel = mongoose.model('Slider', sliderSchema);
module.exports = sliderModel