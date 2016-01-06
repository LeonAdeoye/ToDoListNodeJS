var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var db, itemsCollection;

app.set('port', process.env.PORT || 3000);

MongoClient.connect('mongodb://127.0.0.1:27017/todo', 
	function(err, database)
	{
		if(err)
		{
			throw err;
		}
		
		// Connected
		db = database;
		itemsCollection = db.collection('items');
		
		app.listen(app.get('port'));
		console.log('To-do list server listening on port ' + app.get('port'));
	}
);

var router = express.router();
router.use(bodyParser.json());

// Setup the collection routes
router.route('/')
	.get(
		function(req, res, next)
		{
			itemsCollection.find().toArray(
				function(err, docs)
				{
					res.send(
					{
						status: 'To-do items found',
						items: docs
					});
				});
		})
	.post(
		function(req, res, next)
		{
			var item = req.body;
			itemsCollection.insert(item, 
				function(err, docs)
				{
					res.send(
					{
						status: 'To-do item added',
						items: item._id						
					});
				}); 
		});

//Setup the item routes
router.route('/:id')
	.delete(
		function(req, res, next)
		{
			var id = req.params['id'];
			var lookup = { _id: new mongodb.ObjectID(id) };
			itemsCollection.remove(lookup, 
				function(err, results)
				{
					res.send({ status: "Item cleared." });
				});
		});

app.use(express.static(__dirname + '/public')).use('/todo, router');

