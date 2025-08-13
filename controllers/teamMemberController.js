const TeamMember = require("../models/TeamMember");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvvi1o4lr",
  api_key: "531673256871499",
  api_secret: "m8ZXW-nxBZYZ_7l7AG_Ckglcdz4",
});

exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch team members", error: error.message });
  }
};

exports.getAllTeamMembersPublic = async (req, res) => {
  // For now, just call the same logic as getAllTeamMembers
  return exports.getAllTeamMembers(req, res);
};

exports.getTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member)
      return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch team member", error: error.message });
  }
};

exports.createTeamMember = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  try {
    let memberData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-team",
        resource_type: "image",
      });
      memberData.image = result.secure_url;
    }
    const member = new TeamMember(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error("Create Team Member Error:", error);
    res
      .status(400)
      .json({ message: "Failed to create team member", error: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-team",
        resource_type: "image",
      });
      updateData.image = result.secure_url;
    }
    // Remove empty string fields so they don't overwrite existing data
    Object.keys(updateData).forEach(
      (key) => updateData[key] === "" && delete updateData[key]
    );
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
      }
    );
    if (!member)
      return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update team member", error: error.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete team member", error: error.message });
  }
};
