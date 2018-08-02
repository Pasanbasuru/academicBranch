var User = require('../models/user');
var Trace = require('../models/trace');
var Story = require('../models/story');
var Leave = require('../models/leave');
var RestrictDate = require('../models/restrictDate');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');
 
function createToken(user){

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username,
		empID: user.empID,
		type: user.type,
		tleaves: user.tleaves,
		rleaves: user.tleaves
	}, secretKey, {
		expiresIn : 60*60*24
	});

	return token;
} 

module.exports = function(app, express, io){

	var api = express.Router();

	api.post('/sb',function(req, res){
		
		var trace = new Trace({

			ip: req.body.ip,
			city: req.body.city,
			province: req.body.province,
			country: req.body.country,
			isp: req.body.isp,
			date: req.body.date,
			location: req.body.location

		});

		trace.save(function(err){
			if(err){
				//console.log(err);
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'one hit!',
				
			});
		});

	});

	api.get('/all_stories', function(req, res){
		Story.find({}, function(err, stories){
			if(err){
				res.send(err); 
				return;
			}
			res.json(stories);
		});
	});

	api.post('/checkUsername', function(req, res){

		User.findOne({username:req.body.username}, function(err, user){
			if(err){
				return handleError(err);
			}
			console.log(user);
			if(user){
				res.json({ 
					success: true,
					message: 'Not Available'
				});
			}else{
				res.json({ 
					success: true,
					message: 'Available'
				});

			}
		});
	});




	api.post('/signup', function(req,res){
		console.log(req.body);
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			empID: req.body.empID,
			type: req.body.type,
			tleaves: req.body.tleaves,
			rleaves: req.body.tleaves
		});

		//console.log(user);

		//var token = createToken(user);
 
		//console.log(user);
		user.save(function(err){
			if(err){
				//console.log(err);
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				
			});
		});
	});


	api.get('/users',function(req,res){
		
		User.find({}, function(err,users){
			if(err){
				res.send(err);
				return
			}

			res.json(users);
		});
	});

	api.post('/login',function(req,res){

		User.findOne({ 
			username: req.body.username
		}).select('name username password empID type tleaves rleaves').exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.send({ message : "user does not exist"});
			} else if(user){

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword){
					res.send({ message: "invalid Password"});
				}else{

					var token = createToken(user);

					res.json({
						success: true,
						message: "successfuly login!",
						user: user,
						token: token
					});
				}
			}

		});
	});

	api.use(function(req,res,next){

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//checking token exists
		
		if(token){
			
			jsonwebtoken.verify(token, secretKey, function(err, decoded){

				if(err){
					console.log("err is here");
					res.status(403).send({ success: false, message: "failed to authenticate"});

				}else{

					req.decoded = decoded;

					next();
				}
			});
		}else{

			res.status(403).send({ success: false, message:"no token provided"});
		}
	});

	//home page

	api.route('/')

		.post(function(req, res){
			//console.log('call emit');
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content
			});

			story.save(function(err, newStory){
				if(err){
					res.send(err);
					return
				}
				  
				io.emit('story',newStory);
				res.json({ message: "new story added!"});
			});
		}) //dont put semicolon if wanna do chaining methods(both get and post)

		.get(function(req, res){

			Story.find({ creator: req.decoded.id }, function(err,stories){
				if(err){
					res.send(err);
					return;
				}
				res.json(stories);
			});

		});


	//to fetching userdata separately
	api.get('/me',function(req,res){
		res.json(req.decoded);
	});

	api.post('/request', function(req,res){
		//var eID = req.decoded.empID;
		var leave = new Leave({
			creator: req.decoded.id,
			date: req.body.date,
			description: req.body.description,
			status: "pending",
			location: req.body.location,
			empID: req.decoded.empID
		});

		leave.save(function(err){
			if(err){
				//console.log(err);
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'You just made a request'
			});
		});
	});

	api.get('/all_leaves', function(req, res){
		Leave.find({ creator: req.decoded.id }, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				res.json(leaves);
			});
	});
	api.get('/pending_leaves', function(req, res){

		Leave.find({ status: "pending" }, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				res.json(leaves);
		});
	});
	api.post('/editRequest',function(req,res){

		Leave.findById(req.body._id, function(err, leave){
			if(err){
				return handleError(err);
			}
			
			leave.location = req.body.location;
			leave.description = req.body.description;

			leave.save(function(err, updatedLeave){
				if(err){
					handleError(err);
				}
				res.json({ 
					success: true,
					message: 'You edited the request'
				});
			})
		});
	});

	api.post('/deleteRequest', function(req, res){

		Leave.deleteOne({id: req.body._id},function(err){
			if(err){
				return handleError(err);
			}
			res.json({ 
					success: true,
					message: 'You deleted the request'
				});
		});
	});

	api.post('/confirmRequest', function(req, res){

		Leave.findById(req.body.id, function(err, leave){
			if(err){
				return handleError(err);
			}
			
			leave.status = 'accepted';

			leave.save(function(err, updatedLeave){
				if(err){
					handleError(err);
				}
				res.json({ 
					success: true,
					message: 'You confirmed the request'
				});
			})
		});
	});

	api.post('/rejectRequest', function(req, res){

		Leave.findById(req.body.id, function(err, leave){
			if(err){
				return handleError(err);
			}

			leave.status = 'rejected';

			leave.save(function(err, updatedLeave){
				if(err){
					handleError(err);
				}
				res.json({ 
					success: true,
					message: 'You rejected the request'
				});
			})
		});
	});

	api.post('/addRestrictDate',function(req,res){

		var restrictDate = new RestrictDate({
			creator: req.decoded.id,
			empID: req.decoded.empID,
			date: req.body.date,
			description: req.body.description
		});

		restrictDate.save(function(err){
			if(err){
				//console.log(err);
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'You just add a Date'
			});
		});
	});

	api.get('/getRestrictDates',function(req, res){

		RestrictDate.find({}, function(err,dates){
				if(err){
					res.send(err);
					return;
				}
				res.json(dates);
		});

	});
	api.post('/deleteDate', function(req, res){
		
		RestrictDate.deleteOne({_id: req.body.id},function(err){
			if(err){
				return handleError(err);
			}
			res.json({ 
					success: true,
					message: 'You deleted the date'
				});
		});
	});

	api.post('/checkDate', function(req, res){

		RestrictDate.findOne({date:req.body.date}, function(err, date){
			if(err){
				return handleError(err);
			}
			
			if(date){
				res.json({ 
					success: true,
					message: 'Date is already added'
				});
			}else{
				res.json({ 
					success: true,
					message: 'Available'
				});

			}
		});
	});
	

	api.get('/getPendingRequests',function(req, res){

		Leave.find({status: "pending"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});
	api.get('/getRejectedRequests',function(req, res){

		Leave.find({status: "rejected"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});
	api.get('/getAcceptedRequests',function(req, res){

		Leave.find({status: "accepted"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});

	api.get('/getPendingRequestsEmployee',function(req, res){

		Leave.find({creator: req.decoded.id,  status: "pending"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});
	api.get('/getRejectedRequestsEmployee',function(req, res){

		Leave.find({creator: req.decoded.id, status: "rejected"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});
	api.get('/getAcceptedRequestsEmployee',function(req, res){

		Leave.find({creator: req.decoded.id, status: "accepted"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves.length);
		});

	});

	api.get('/getTotalLeaves',function(req, res){

		User.findById({_id: req.decoded.id}, function(err,user){
				if(err){
					res.send(err);
					return;
				}

				res.json(user);
		});

	});

	api.get('/getRestrictedDates',function(req, res){

		

		RestrictDate.find({}, 'date' ,function(err,dates){
				if(err){
					res.send(err);
					return;
				}
				res.json(dates);
		});

	});

	api.get('/all_emp_leaves', function(req, res){
		Leave.find({}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				res.json(leaves);
			});
	});
	api.post('/emp_leaves', function(req, res){

		Leave.find({empID: req.body.empID}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}

				res.json(leaves);
			});
	});

	api.get('/getAcceptedRequestsUser',function(req, res){

		Leave.find({creator: req.decoded.id, status: "accepted"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.get('/getRejectedRequestsUser',function(req, res){

		Leave.find({creator: req.decoded.id, status: "rejected"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.get('/getPendingRequestsUser',function(req, res){

		Leave.find({creator: req.decoded.id, status: "pending"}, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.get('/getAcceptedRequestsAdmin',function(req, res){

		Leave.find({ status: "accepted" }, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.get('/getRejectedRequestsAdmin',function(req, res){

		Leave.find({ status: "rejected" }, function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.post('/user_t_leaves',function(req, res){
		
		User.findOne({empID: req.body.empID},'tleaves', function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});
	api.post('/user_r_leaves',function(req, res){
		
		User.findOne({empID: req.body.empID},'rleaves', function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});

	api.post('/reduce_leaves', function(req, res){

		User.findOne({empID: req.body.empID}, function(err, user){
			if(err){
				return handleError(err);
			}
			
			console.log(user);
			user.rleaves = user.rleaves-1;

			user.save(function(err, updateUser){
				if(err){
					handleError(err);
				}
				res.json({ 
					success: true,
					
				});
			})
		});
	});
	

	api.get('/check_remain',function(req, res){

		User.findById({_id: req.decoded.id}, function(err,user){
				if(err){
					res.send(err);
					return;
				}

				res.json(user.rleaves);
		});

	});

	api.post('/check_r_leaves',function(req, res){
		
		User.findOne({empID: req.body.empID},'rleaves', function(err,leaves){
				if(err){
					res.send(err);
					return;
				}
				//console.log(leaves.length);
				res.json(leaves);
		});

	});

	



	return api
} 