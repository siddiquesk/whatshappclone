const chat = require("../models/chat"); // Importing the Chat model for database operations
module.exports.index = async (req, res) => {
  try {
    // Fetch all chats from the database
    let allchat = await chat.find();
    // Render the index page with all chats
    res.render("chats/index.ejs", { allchat });
  } catch (err) {
    // If an error occurs while fetching the chats, send a 405 error
    res.status(405).send("Error caught");
  }
};
// Render the new chat form
module.exports.newForm = (req, res) => {
  res.render("chats/new.ejs"); // Render the new chat creation page
};
// Handle chat creation
module.exports.createChat = async (req, res) => {
  try {
    // Create a new chat document using the data from the form (req.body)
    let newchat = await chat.create(req.body);
    // Flash a success message after the chat is created
    req.flash("success", "New Chat Created");
    // Redirect to the chats page after creation
    res.redirect("/");
  } catch (err) {
    // If chat creation fails, send a 405 error and flash an error message
    res.status(405).send("Chat was not created");
    req.flash("error", "Something went wrong");
  }
};
// Render the edit chat form
module.exports.editForm = async (req, res) => {
  const { id } = req.params; // Get the chat ID from the URL parameters
  try {
    // Find the chat by ID to edit
    let editchat = await chat.findById(id);
    // Render the edit form with the chat details
    res.render("chats/edit", { editchat });
  } catch (err) {
    // Handle any error while fetching the chat for editing
    res.status(500).send("Error fetching chat for editing");
  }
};
// Handle chat update
module.exports.editChat = async (req, res) => {
  let { id } = req.params; // Get the chat ID from the URL parameters
  let { msg: newmsg, image: newimage } = req.body; // Extract new message and image data
  try {
    // Find the chat document by ID
    let chatToUpdate = await chat.findById(id);
    // If the chat does not exist, send a 404 error
    if (!chatToUpdate) return res.status(404).send("Chat not found");
    // Update the chat message and image fields
    chatToUpdate.set({ msg: newmsg, image: newimage });
    // Save the updated chat document
    await chatToUpdate.save();
    // Flash a success message after the update and redirect to the chats page
    req.flash("success", "Chat updated");
    res.redirect("/");
  } catch (err) {
    // Handle any error while updating the chat
    res.status(500).send("Error updating chat");
    req.flash("error", "Something went wrong");
  }
};

// Handle chat deletion
module.exports.destroyChat = async (req, res) => {
  let { id } = req.params; // Get the chat ID from the URL parameters
  try {
    // Find and delete the chat by ID
    let delchat = await chat.findByIdAndDelete(id);

    // Flash a success message after deletion and redirect to the chats page
    req.flash("success", "Your chat deleted");
    res.redirect("/");
  } catch (err) {
    // Handle any error during the deletion process
    res.status(405).send("Error deleting chat");
    req.flash("error", "Something went wrong");
  }
};
