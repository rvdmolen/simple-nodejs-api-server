var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var fs 				 = require("fs");

// configure
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 9000; // set our port

// create our router
var router = express.Router();
app.use('/api/v1/rest', router);

// create the requests
function createrequest(res, filename) {
	 var applicationRoot = __dirname.replace(/\\/g,"/");
   var mockRoot = applicationRoot + '/test/mocks/api';
	 var data =  fs.readFileSync(mockRoot + filename, 'utf8');
   res.writeHead(200, { 'Content-Type': 'application/json' });
   res.write(data);
   res.end();
}

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	//console.log('Something is happening.');
	next();
});

// routes
router.get('/test', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/users', function(req, res) {
	 createrequest(res, '/users.json');
});



// REGISTER OUR ROUTES -------------------------------


// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
