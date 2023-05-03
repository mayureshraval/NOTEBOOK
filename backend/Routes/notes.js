const express = require("express");
const router = express.Router();
const getUser = require("../Middlewares/getUser");
const Notes = require("../Models/Notes");
const User = require("../Models/User");

// Add the Notes needs login
router.post("/addnote", getUser, async (req, res) => {
  try {
    const id = req.id;
    // const user = await User.findOne({_id:req.id});
    const Note = await Notes.create({
      userId: id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
    });
    return res.send(Note);
  } catch (error) {
    return res.status(500).send("Internal Server Error.");
  }
});

// Get all the notes needs login
router.get("/fetchallnotes", getUser, async (req, res) => {
  try {
    const Id = req.id;
    const fetchedNotes = await Notes.find({ userId: Id });
    return res.send(fetchedNotes);
  } catch (error) {
    return res.status(500).send("Internal Server Error.");
  }
});

// update notes
router.put("/updatenote/:id", getUser, async (req, res) => {
  try {
    // getting the id from the getuser middleware
    const id = req.id;
    // getting note id to modify the node.
    const noteId = req.params.id;
    // Modifying notes with verification checking if the userId of notes matches with the id of the user so that the one who created the note can only modify the notes.
    const checkNoteOwner = await Notes.findOne({ _id: noteId, userId: id });

    if (!checkNoteOwner) {
      return res.status(401).send("Not Allowed.");
    }
    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      {
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      },
      { new: true }
    );
    // new true brings new updated data from the mongo db not the old one in res.
    return res.send(updatedNote);
  } catch (error) {
    return res.status(500).send("Internal Server Error.");
  }
});

router.delete("/deletenote/:id", getUser, async (req, res) => {
  try {
    // getting the id from the getuser middleware
    const id = req.id;
    // getting note id to modify the node.
    const noteId = req.params.id;
    // Modifying notes with verification checking if the userId of notes matches with the id of the user so that the one who created the note can only modify the notes.
    const checkNoteOwner = await Notes.findOne({ _id: noteId, userId: id });

    if (!checkNoteOwner) {
      return res.status(404).send("Not Found.");
    }
    const deletedNote = await Notes.findByIdAndDelete(noteId);
    // new true brings new updated data from the mongo db not the old one in res.
    return res.send("This note was deleted : \n", deletedNote);
  } catch (error) {
    return res.status(500).send("Internal Server Error.");
  }
});

module.exports = router;
