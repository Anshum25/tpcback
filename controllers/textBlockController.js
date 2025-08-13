const TextBlock = require("../models/TextBlock");

exports.getAllTextBlocks = async (req, res) => {
  console.log("Fetching text blocks...");
  try {
    const blocks = await TextBlock.find();
    console.log("Fetched blocks:", blocks);
    res.json(blocks);
  } catch (error) {
    console.error("Error fetching text blocks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch text blocks", error: error.message });
  }
};

exports.getTextBlock = async (req, res) => {
  try {
    const block = await TextBlock.findById(req.params.id);
    if (!block)
      return res.status(404).json({ message: "Text block not found" });
    res.json(block);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch text block", error: error.message });
  }
};

exports.createTextBlock = async (req, res) => {
  try {
    const block = new TextBlock(req.body);
    await block.save();
    res.status(201).json(block);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create text block", error: error.message });
  }
};

exports.updateTextBlock = async (req, res) => {
  try {
    const block = await TextBlock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!block)
      return res.status(404).json({ message: "Text block not found" });
    res.json(block);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update text block", error: error.message });
  }
};

exports.deleteTextBlock = async (req, res) => {
  try {
    await TextBlock.findByIdAndDelete(req.params.id);
    res.json({ message: "Text block deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete text block", error: error.message });
  }
};

exports.getTextBlockByTitle = async (req, res) => {
  try {
    
    const block = await TextBlock.findOne({ title: req.query.title });
    
    if (!block) return res.status(404).json({ value: "" });
    res.json(block);
  } catch (error) {
    console.log("error", error);
    
    res.status(500).json({ value: "" });
  }
};
