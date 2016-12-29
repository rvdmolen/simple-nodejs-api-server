/* Define some initial variables. */
var applicationRoot = __dirname.replace(/\\/g,"/"),
  ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  port = process.env.OPENSHIFT_NODEJS_PORT || 8090;
  mockRoot = applicationRoot + '/test/mocks/api',
  mockFilePattern = '.json',
  mockRootPattern = mockRoot + '/**/*' + mockFilePattern,
  apiRoot = '/api',
  fs = require("fs"),
  glob = require("glob");

/* Create Express application */
var express = require("express");
var app = express();


/* Read the directory tree according to the pattern specified above. */
var files = glob.sync(mockRootPattern);

/* Register mappings for each file found in the directory tree. */
if(files && files.length > 0) {
  files.forEach(function(fileName) {

    var mapping = apiRoot + fileName.replace(mockRoot, '').replace(mockFilePattern,'');

    app.get(mapping, function (req, res) {
      var data =  fs.readFileSync(fileName, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    });

    console.log('Registered mapping: %s -> %s', mapping, fileName);
  })
} else {
    console.log('No mappings found! Please check the configuration.');
}

/* Start the API mock server. */
console.log('Application root directory: [' + applicationRoot +']');
console.log('Mock Api Server listening: [http://' + ipaddress + ':' + port + ']');
app.listen(port, ipaddress);