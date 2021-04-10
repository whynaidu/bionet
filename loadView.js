exports.loadView = function(app, viewPort, apiPort){
	var urls = {
		viewUrl:"http://localhost:"+viewPort,
		apiUrl:"http://localhost:"+apiPort
	};

	app.set('view engine', 'ejs');
	app.listen(viewPort, function(){});

	app.get("/login", function(req, res){	
		res.render('login.ejs');
	});

	app.get("/myprofile", function(req, res){
		res.render('userprofile.ejs');
	});

	app.get("/vendor/*", function(req, res){
		res.sendFile(__dirname+req.url);
	});

	app.get("/linkimages/*", function(req, res){
		res.sendFile(__dirname+req.url);
	});

	app.get("/controller/*", function(req, res){
		res.sendFile(__dirname+req.url);
	});

	app.get("/css/*", function(req, res){
		res.sendFile(__dirname+req.url);
	});

	app.get("/modal/*", function(req, res){
		res.sendFile(__dirname+req.url);
	});
	
}