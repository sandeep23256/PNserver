const portfolioModel = require('../models/portfolio');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class PortfolioController {
  // INSERT
  static portfolioInsert = async (req, res) => {
    try {
      const { title, url } = req.body;
      const file = req.files?.image;

      if (!file) return res.status(400).json({ message: "Image is required" });

      // Cloudinary async upload
      const [imageupload] = await Promise.all([
        cloudinary.uploader.upload(file.tempFilePath, { folder: "portfolio" })
      ]);

      const portfolio = await portfolioModel.create({
        title,
        url,
        image: {
          public_id: imageupload.public_id,
          url: imageupload.secure_url,
        },
      });

      res.status(201).json({ message: "Inserted Successfully", data: portfolio });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Insert failed" });
    }
  };

  // DISPLAY
  static portfolioDisplay = async (req, res) => {
    try {
      const ports = await portfolioModel.find().lean(); // lean() = faster
      res.status(200).json(ports);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data" });
    }
  };

  // VIEW
  static portfolioView = async (req, res) => {
    try {
      const id = req.params.id;
      const portfolio = await portfolioModel.findById(id).lean();
      if (!portfolio) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ success: true, portfolio });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "View failed" });
    }
  };

  // UPDATE
  static portfolioUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, url } = req.body;

      let portfolio = await portfolioModel.findById(id);
      if (!portfolio) return res.status(404).json({ message: "Not found" });

      let image = portfolio.image;

      if (req.files?.image) {
        // Delete old image + upload new in parallel
        await Promise.all([
          portfolio.image?.public_id
            ? cloudinary.uploader.destroy(portfolio.image.public_id)
            : null,
          cloudinary.uploader
            .upload(req.files.image.tempFilePath, { folder: "portfolio" })
            .then(upload => {
              image = { public_id: upload.public_id, url: upload.secure_url };
            })
        ]);
      }

      portfolio = await portfolioModel.findByIdAndUpdate(
        id,
        { title, url, image },
        { new: true }
      );

      res.status(200).json({ success: true, message: "Updated", portfolio });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Update failed" });
    }
  };

  // DELETE
  static portfolioDelete = async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await portfolioModel.findById(id);
      if (!portfolio) return res.status(404).json({ message: "Not found" });

      // Delete from Cloudinary + DB in parallel
      await Promise.all([
        portfolio.image?.public_id
          ? cloudinary.uploader.destroy(portfolio.image.public_id)
          : null,
        portfolioModel.findByIdAndDelete(id)
      ]);

      res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Delete failed" });
    }
  };
}

module.exports = PortfolioController;
