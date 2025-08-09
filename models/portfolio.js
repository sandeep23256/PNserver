const mongoose = require('mongoose')

const portfolioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
   image: {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },
}, { timestamps: true });

const portfolioModel = mongoose.model('portfolio', portfolioSchema);
module.exports = portfolioModel