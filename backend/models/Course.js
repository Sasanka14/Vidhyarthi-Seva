const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  lectures: Number,
  hours: Number,
  timings: String,
  batchStartDate: Date,
  batchRecording: {
    preRecorded: String,
    newRecording: String,
  },
  booksIncluded: [String],
  accessOptions: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      views: { type: Number, required: true },
      validity: { type: String, required: true }
    }
  ],
  platforms: [String],
  doubtSolvingPlatform: String,
  syllabusType: String,
  videoLanguage: String,
  systemRequirements: {
    supported: [String],
    notSupported: [String],
  },
  faculty: {
    name: String,
    bio: String,
    experience: String,
    style: String,
    image: String,
  },
  thumbnail: {
    type: String, // URL or path to image
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema); 