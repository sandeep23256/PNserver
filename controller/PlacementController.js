const placementModel = require('../models/placement');
const cloudinary = require('cloudinary');
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class placementController {
  static placementinsert = async (req, res) => {
    try {
      const { name, position } = req.body;
      const file = req.files.image;

      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "placement",
      });

      const image = {
        public_id: imageUpload.public_id,
        url: imageUpload.secure_url,
      };

      const placementMember = await placementModel.create({
        name,
        position,
        image,
      });

      return res.status(201).json({
        message: "placement member added successfully",
        data: placementMember,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to insert placement member" });
    }
  };

  static placementdisplay = async (req, res) => {
    try {
      const placement = await placementModel.find();
      res.status(200).json(placement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch placement" });
    }
  };

  static placementview = async (req, res) => {
    try {
      const { _id } = req.params;
      const member = await placementModel.findById(_id);
      res.status(200).json({
        success: true,
        message: "placement member fetched successfully",
        member,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to view placement member" });
    }
  };

static placementupdate = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, position } = req.body;

    const member = await placementModel.findById(_id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // पुरानी image delete
    if (req.files?.image && member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    // नई image upload
    let image = member.image;
    if (req.files?.image) {
      const imgUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "placement",
      });
      image = {
        public_id: imgUpload.public_id,
        url: imgUpload.secure_url,
      };
    }

    const updatedMember = await placementModel.findByIdAndUpdate(
      _id,
      { name, position, image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Placement member updated successfully",
      updatedMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update placement member" });
  }
};

static placementdelete = async (req, res) => {
  try {
    const { _id } = req.params;
    const member = await placementModel.findById(_id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Cloudinary से image delete
    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await placementModel.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Placement member deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete placement member" });
  }
};

}

module.exports = placementController;
