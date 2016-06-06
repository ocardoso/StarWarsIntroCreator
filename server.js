// Simple static serve to run in node
var express = require('express'),
    app = express(),    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https');

var app = express();

var nonSslPort = 9194;
var sslPort = 445;

var args = process.argv.splice(2);

var arg;
for (var count = 0; count < args.length; count++) {
    arg = args[count];

    if (arg.indexOf("--non-ssl-port=") === 0) {
        nonSslPort = arg.replace("--non-ssl-port=", "");
    }

    if (arg.indexOf("--ssl-port=") === 0) {
        sslPort = arg.replace("--ssl-port=", "");
    }
}

//app.configure(function() {
    app.set('port', nonSslPort);  // non-ssl port
    //app.set('sport', sslPort); // ssl port
    app.use(express.cookieParser()); // cookie parser
    app.use(express.static(path.resolve(root, __dirname /*+ '/build'*/)));   // Serve static files
//});


/* redirect / to login or home based on ticket validation *
app.get('/', function(req,res,next) {
    iusauth.isLoggedInAndValid(req, function(isValid) {
        var redir = '/login/';
        if (isValid) {
            redir = '/home/'
        }
        res.redirect(redir);
    });
});
*/

var startServer = function() {
    /* --- run non-SSL server --- */
    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });

    /* --- run SSL server --- */
    /*var httpsOptions = {
        key: fs.readFileSync(__dirname+'/certs/nonprod.ssl-key.pem'),
        cert: fs.readFileSync(__dirname+'/certs/nonprod.ssl-cert.pem')
    };*/

    https.createServer({}, app).listen(app.get('sport'), function(){
        console.log("Express server listening on port " + app.get('sport'));
    });
};


startServer();
