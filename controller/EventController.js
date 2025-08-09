const eventsModel = require("../models/events");
const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class EventController {
    static eventinsert = async (req, res) => {
        try {
            const { title, description } = req.body;
            const file = req.files.image;
            const imageupload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "event",
            });
            const image = {
                public_id: imageupload.public_id,
                url: imageupload.secure_url,
            };
            const event = await eventsModel.create({
                title,
                description,
                image,
            });
            return res.status(201).json({
                message: "Data Inserted Successfully",
                data: event,
            });
        } catch (error) {
            console.log(error);
        }
    };
    static eventdisplay = async (req, res) => {
        try {
            const events = await eventsModel.find();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ events });
        }
    };
    static eventview = async (req, res) => {
        try {
            const { id } = req.params;
            const event = await eventsModel.findById(id);
            return res.status(200).json({
                success: true,
                message: "Data View Successfully",
                event,
            });
        } catch (error) {
            console.log(error);
        }
    };
    static eventupdate = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const event = await eventsModel.findById(id);
            if (!event) return res.status(404).json({ message: "Event not found" });

            // पुरानी image delete
            if (event.image?.public_id) {
                await cloudinary.uploader.destroy(event.image.public_id);
            }

            // नई image upload
            const file = req.files?.image;
            let image = event.image;
            if (file) {
                const imgUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "event",
                });
                image = {
                    public_id: imgUpload.public_id,
                    url: imgUpload.secure_url,
                };
            }

            const updatedEvent = await eventsModel.findByIdAndUpdate(
                id,
                { title, description, image },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Data Updated Successfully",
                event: updatedEvent,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    static eventdelete = async (req, res) => {
        try {
            const event = await eventsModel.findById(req.params.id);
            if (!event) return res.status(404).json({ message: "Event not found" });

            await cloudinary.uploader.destroy(event.image?.public_id);
            await event.deleteOne();

            res.json({ message: "Event & image deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}
module.exports = EventController