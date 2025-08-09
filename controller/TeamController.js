const teamModel = require('../models/team');
const cloudinary = require('cloudinary');
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class TeamController {
  static teaminsert = async (req, res) => {
    try {
      const { name, position } = req.body;
      const file = req.files.image;

      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "team",
      });

      const image = {
        public_id: imageUpload.public_id,
        url: imageUpload.secure_url,
      };

      const teamMember = await teamModel.create({
        name,
        position,
        image,
      });

      return res.status(201).json({
        message: "Team member added successfully",
        data: teamMember,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to insert team member" });
    }
  };

  static teamdisplay = async (req, res) => {
    try {
      const team = await teamModel.find();
      res.status(200).json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  };

  static teamview = async (req, res) => {
    try {
      const { _id } = req.params;
      const member = await teamModel.findById(_id);
      res.status(200).json({
        success: true,
        message: "Team member fetched successfully",
        member,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to view team member" });
    }
  };

static teamupdate = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, position } = req.body;

    // Member खोजो
    const member = await teamModel.findById(_id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    // अगर नई image मिली तो पुरानी delete करो
    if (req.files?.image && member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    // नई image upload
    let image = member.image;
    if (req.files?.image) {
      const imgUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "team",
      });
      image = {
        public_id: imgUpload.public_id,
        url: imgUpload.secure_url,
      };
    }

    const updatedMember = await teamModel.findByIdAndUpdate(
      _id,
      { name, position, image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      updatedMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update team member" });
  }
};

static teamdelete = async (req, res) => {
  try {
    const { _id } = req.params;

    const member = await teamModel.findById(_id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    // Cloudinary से image delete
    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await teamModel.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
};

}

module.exports = TeamController;
