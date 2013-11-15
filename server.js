var express = require('express');
var app = express();


   
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.errorHandler());        
	app.use(express.logger('dev'));
	app.use("/static",express.static(__dirname + '/.tmp/public'));
	/*app.engine('jade', require('jade').__express);
	app.set('views', __dirname + '/demo');*/
	app.set('views', __dirname + '/demo');
	app.set('view engine', 'twig');
	app.set('twig options', { 
    	strict_variables: false
	});

});



app.get('/', function(req, res){
    res.render('index');
});

app.get('/demo/:id',function(req,res){
	res.render('demo1');
});


app.listen(3000);
console.log('Express app started on port 3000');
