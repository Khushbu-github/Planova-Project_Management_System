const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure no more than 4 members per team
teamSchema.path('members').validate(function(members) {
  return members.length <= 4;
}, 'A team cannot have more than 4 members');

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;