var mongoose = require("mongoose");

var LogoSchema = new mongoose.Schema({
  id: String,
  text: [
    {
      text: String,
      color: String,
      size: { type: Number, min: 2, max: 144 },
    },
  ],
  backgroundColor: String,
  borderColor: String,
  borderRadius: { type: Number, min: 0, max: 144 },
  borderWidth: { type: Number, min: 0, max: 144 },
  padding: { type: Number, min: 0, max: 144 },
  margins: { type: Number, min: 0, max: 144 },
  width: { type: Number, min: 0 },
  height: { type: Number, min: 0 },

  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Logo", LogoSchema);
