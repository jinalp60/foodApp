//comment to check 1
//another comment
var express =require("express");
var app=express();
var server=require('http').createServer(app);
var db_api=require('./db_api');

var io = require('socket.io')(server);
var client;

//validation express-validator
const { check, validationResult } = require('express-validator/check');
const { query } = require('express-validator/check');

var bodyParser = require('body-parser');
app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: 102410241024,
    extended: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/placeOrder',
    [check('itemName').isLength({ min: 2 }),check('quantity').isLength({ min: 1 })],
    function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            console.log("Item:",req.body);
            db_api.insert_product_data(req.body).then(function(result){
                console.log(result.affectedRows," rows updated");
                io.sockets.emit('order_data_changed', '');
                res.status(200).json({message:result.affectedRows+" rows updated"});
            });
        }
        
});
app.post('/setPredictedValue',
    [check('itemName').isLength({ min: 2 }),check('predictedItems').isLength({ min: 1 })],
    function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            console.log("Item:",req.body);
            db_api.set_predicted_value(req.body).then(function(result){
                console.log(result.affectedRows," rows updated");
                io.sockets.emit('order_data_changed', '');
                res.status(200).json({message:result.affectedRows+" rows updated"});
            });
        }
        
});
app.get('/fetchOrderData',function(req,res){
   
    db_api.fetch_order_data().then(function(data){
        console.log("results of fetch query:",data);
        res.status(200).json({result:data});
    });
    
});
app.post('/orderServed',
    [check('itemName').isLength({ min: 2 }),check('quantity').isLength({ min: 1 })],
    function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            console.log("Item:",req.body);
            db_api.get_items_served(req.body).then(function(createdItemsOld){
                //console.log("app",createdItemsOld);
                db_api.update_item_served(req.body,createdItemsOld).then(function(result){
                    io.sockets.emit('order_data_changed', '');
                    res.status(200).json({message:result.affectedRows+" rows updated"});
                });    
            });
        }
        
});

//socket connection
io.on('connection', function (client_1) {
    client = client_1;
    
    client.on('join', function (data) {
      //io.sockets.emit('client_connect', 'id');
      //console.log("connect");
      io.sockets.emit('json', 'finally');
    });
  });


server.listen(8000);
db_api.connect_db();
console.log("connected to server");