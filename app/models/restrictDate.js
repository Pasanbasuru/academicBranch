var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RestrictDateSchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	empID: String,
	date: { type: Date, unique:true },
	description: String

});

module.exports = mongoose.model('RestrictDate', RestrictDateSchema);