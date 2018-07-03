var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LeaveSchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	empID: String,
	date: Date,
	description: String,
	status: String,
	location: String,
	created: { type: Date, defauly: Date.now}

});

module.exports = mongoose.model('Leave', LeaveSchema);