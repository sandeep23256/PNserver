const mongoose = require("mongoose")

const eventsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
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

const eventsModel = mongoose.model('event', eventsSchema)
module.exports = eventsModel