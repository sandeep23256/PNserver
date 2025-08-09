const contactModel = require('../models/contact');

class ContactController {
  // INSERT
  static contactInsert = async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      const contact = await contactModel.create({ name, email, phone, message });

      return res.status(201).json({
        message: 'Contact submitted successfully',
        data: contact,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // DISPLAY ALL
  static contactDisplay = async (req, res) => {
    try {
      const contacts = await contactModel.find().sort({ createdAt: -1 });
      return res.status(200).json(contacts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching contact data' });
    }
  };

  // VIEW ONE
  static contactView = async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await contactModel.findById(id);
      return res.status(200).json({
        success: true,
        message: 'Contact fetched successfully',
        contact,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Contact not found' });
    }
  };

  // DELETE
  static contactDelete = async (req, res) => {
    try {
      const { id } = req.params;
      await contactModel.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to delete contact' });
    }
  };
}

module.exports = ContactController;
