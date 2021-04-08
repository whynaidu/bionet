var mc = require('mongodb').MongoClient;
var bodyparser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;
var multipart = require('connect-multiparty');
const  multipartMiddlewareDP  =  multipart({ uploadDir:  __dirname+'/uploads' });
const  multipartMiddlewareLinkImage  =  multipart({ uploadDir:  __dirname+'/linkimages' });
var cors = require('cors');

exports.api = function(app,port){

	app.listen(port, function(){});
	app.use(cors());
	app.use(bodyparser.urlencoded({
		extended:true
	}));

	app.use(bodyparser.json());
	

	mc.connect("mongodb://localhost:27017", function(err, dbs){

		var db = dbs.db('biotree');		
		var col = db.collection('creators');

		app.post("/userAdd",function(req, res){

			req.body.links = [];

			console.log(req.body);

			col.insertOne(req.body, function(err, r){

				if(err) throw err;

			});

			res.json({SUCCESS:"USER_ADDED"});

		});

		app.post("/uploadDp", multipartMiddlewareDP, function(req, res){

			console.log(req.files);
			var fp = "uploads"+req.files.userdp.path.split("uploads")[1];
			res.json({filepath:fp});

		});


		app.post("/uploadLinkImage", multipartMiddlewareLinkImage, function(req, res){

			console.log(req);
			var fp = "linkimages"+req.files.linkimage.path.split("linkimages")[1];
			res.json({linkimage:fp});

		});

		app.post("/updateLinkInfo", function(req, res){
			console.log(req.body);
			
			col.updateOne({
					"_id":ObjectId(req.body.uid), 
					"links":{
						$elemMatch:{
							"_id":ObjectId(req.body.lid)
						}
					}
				}, {
				$set:{
						"links.$.url":req.body.url,
						"links.$.linkTitle":req.body.linkTitle
				}
			}, function(err, r){

				console.log(r.matchedCount);
				console.log(r.modifiedCount);
				 if(r.matchedCount!=0 && r.modifiedCount!=0){

				 	res.json({SUCCESS:"LINK_ADDED"});

				 }
				 else{
					res.json({ERROR:"CONTACT_DEVELOPER"});				 	
				 }

			});
		});

		app.post("/addLink", function(req, res){

			console.log(req.body);

			col.update({"_id": ObjectId(req.body.id)}, {
				$addToSet:{
					"links":{
						"_id":new ObjectId(),
						"url":req.body.url,
						"clicks":0,
						"linkTitle":req.body.title,
						"linkImage":req.body.linkimage
					}
				}
			}, function(err, r){

				 if(r.matchedCount!=0 && r.modifiedCount!=0){

				 	res.json({SUCCESS:"LINK_ADDED"});

				 }
				 else{
					res.json({ERROR:"CONTACT_DEVELOPER"});				 	
				 }

			});

		});

	

		app.get("/linkClicked/:uid/:lid", function(req, res){

			col.update(
				{
					"_id":ObjectId(req.params.uid), 
					"links":{
						$elemMatch:{
							"_id":ObjectId(req.params.lid)
						}
					}
				},
				{
					$inc:{
						"links.$.clicks":1
					}
				},
				function(err, r){
					if(r.matchedCount!=0 && r.modifiedCount!=0){

					 	res.json({SUCCESS:"CLICK_INCREMENTED"});

					 }
					 else{
						res.json({ERROR:"CONTACT_DEVELOPER"});				 	
					 }
				}
			);

		});

		app.get("/deleteLink/:uid/:lid", function(req, res){

			col.updateMany(
				{
					"_id":ObjectId(req.params.uid)
				},
				{
					$pull:{
						"links":{
							
							"_id":ObjectId(req.params.lid)
					
						}
					}
				},
				function(req, r){
					if(r.matchedCount!=0 && r.modifiedCount!=0){

					 	res.json({SUCCESS:"LINK-DELETED"});

					 }
					 else{
						res.json({ERROR:"CONTACT_DEVELOPER"});				 	
					 }
				}
			);

		});


		app.get("/getAllUserData", function(req,res){

			col.find().toArray(function(err, docs){
				res.json(docs);
			});

		});


		app.post("/login", function(req, res){

			// req.body.uname req.body.passwd
			col.find({username:req.body.uname, password:req.body.passwd}).project({"links":0, "password":0, "phone":0}).toArray(function(err, docs){
				
				if(docs.length==0){

					res.json({"ERROR":"AUTH_FAILED"});

				}
				else{

					res.json(docs);

				}
			});

		});

		app.get("/getUserData/:uid", function(req,res){

			col.find({_id:ObjectId(req.params.uid)}).toArray(function(err, docs){
				res.json(docs);
			});

		});

		app.get("/getuserLinks/:uid", function(req,res){

			col.find(
				{_id:ObjectId(req.params.uid)}).project({"links":1}).toArray(function(err, docs){
				res.json(docs);
			
			});

		});


		app.get("/userProfile/:uid", function(req,res){

			col.find(
				{_id:ObjectId(req.params.uid)}).project({"links":0}).toArray(function(err, docs){
				res.json(docs);
				
			});

		});

		// app.get("/getclicks/:uid/:lid", function(req,res){
		// 	col.find({
		// 		_id:ObjectId{req.params.uid}, 


		// 	})

		// })
		

	});

}