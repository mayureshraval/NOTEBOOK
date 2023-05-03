const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  userId:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required: true,
  },
  description:{
    type:String,
    required:true,
  },
  tag:{
    type:String,
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;