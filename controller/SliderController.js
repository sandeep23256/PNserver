const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const sliderModel = require("../models/slider")
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
class SliderController {
  
  static getAllSlides = async (req, res) => {
    try {
      const slides = await sliderModel.find();
      res.status(200).json(slides);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static createSlide = async (req, res) => {
    try {
      const { title, subtitle } = req.body;
      const file = req.files.image;
      const imageupload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "Slider",
      });
      const image = {
        public_id: imageupload.public_id,
        url: imageupload.secure_url,
      };
      const Slider = await sliderModel.create({
        title,
        subtitle,
        image,
      });
      return res.status(201).json({
        message: "Data Inserted Successfully",
        data: Slider,
      });
    } catch (error) {
      console.log(error);
    }
  };
static updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle } = req.body;

    const slide = await sliderModel.findById(id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    // पुरानी image delete अगर नई मिली
    if (req.files?.image && slide.image?.public_id) {
      await cloudinary.uploader.destroy(slide.image.public_id);
    }

    // नई image upload
    let image = slide.image;
    if (req.files?.image) {
      const imgUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "Slider",
      });
      image = {
        public_id: imgUpload.public_id,
        url: imgUpload.secure_url,
      };
    }

    await sliderModel.findByIdAndUpdate(
      id,
      { title, subtitle, image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Data Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

static deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await sliderModel.findById(id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    // Cloudinary से image delete
    if (slide.image?.public_id) {
      await cloudinary.uploader.destroy(slide.image.public_id);
    }

    await sliderModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Data Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};


}
module.exports = SliderController;