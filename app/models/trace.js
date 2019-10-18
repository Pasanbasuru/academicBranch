var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TraceSchema = new Schema({

	ip: String,
	city: String,
	country: String,
	date: Date,
	isp: String,
	province: String,
	location: String,
	view:  { type: String, default: 'xxx' }

});

module.exports = mongoose.model('Trace', TraceSchema);