const technologyModel = require('../models/technology');
const cloudinary = require('cloudinary');
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class TechnologyController {
  static technologyInsert = async (req, res) => {
   try {
      const { title, description } = req.body;
      const file = req.files.image;
      const imageupload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "technology",
      });
      const image = {
        public_id: imageupload.public_id,
        url: imageupload.secure_url,
      };
      const technology = await technologyModel.create({
        title,
        description,
        image,
      });
      return res.status(201).json({
        message: "Data Inserted Successfully",
        data: technology,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static technologyDisplay = async (req, res) => {
      try {
      const techs = await technologyModel.find();
      res.status(200).json(techs);
    } catch (error) {
      res.status(500).json({ techs});
    }
  };
  static technologyView = async (req, res) => {
    try {
      const { id } = req.params;
      const technology = await technologyModel.findById(id);
      return res.status(200).json({
        success: true,
        message: "Data View Successfully",
        technology,
      });
    } catch (error) {
      console.log(error);
    }
  };
static technologyUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const tech = await technologyModel.findById(id);
    if (!tech) return res.status(404).json({ message: "Technology not found" });

    // अगर नई image मिली तो पुरानी delete
    if (req.files?.image && tech.image?.public_id) {
      await cloudinary.uploader.destroy(tech.image.public_id);
    }

    // नई image upload
    let image = tech.image;
    if (req.files?.image) {
      const imgUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "technology",
      });
      image = {
        public_id: imgUpload.public_id,
        url: imgUpload.secure_url,
      };
    }

    const updatedTech = await technologyModel.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Data Updated Successfully",
      technology: updatedTech,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

static technologyDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const tech = await technologyModel.findById(id);
    if (!tech) return res.status(404).json({ message: "Technology not found" });

    // Cloudinary से image delete
    if (tech.image?.public_id) {
      await cloudinary.uploader.destroy(tech.image.public_id);
    }

    await technologyModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Data Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};

}
module.exports = TechnologyController;