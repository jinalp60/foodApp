var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "FoodDisplay"
});

var db_api={
    connect_db:function(){
        con.connect();
    },
    
    insert_product_data:function(newItem){
        return new Promise(function(resolve,reject){
            var sql = "UPDATE foodItems SET quantity = "+newItem.quantity+" WHERE itemName = '"+newItem.itemName+"';"
            //var sql =   "INSERT INTO foodItems (itemName,quantity,createdItems,predictedItems) VALUES ('"+newItem.itemName+"',"+newItem.quantity+","+0+","+0+")";
            con.query(sql, function (err, result) {
                if (err) {
                    reject();
                    throw err;
                }
                
                resolve(result);
                console.log("1 record updated");
            });
        });
            
    },
    set_predicted_value:function(newItem){
        return new Promise(function(resolve,reject){
            var sql = "UPDATE foodItems SET predictedItems = "+newItem.predictedItems+" WHERE itemName = '"+newItem.itemName+"';"
            console.log("query:"+sql);
            //var sql =   "INSERT INTO foodItems (itemName,quantity,createdItems,predictedItems) VALUES ('"+newItem.itemName+"',"+newItem.quantity+","+0+","+0+")";
            con.query(sql, function (err, result) {
                if (err) {
                    reject();
                    throw err;
                }
                
                resolve(result);
                console.log("1 record updated");
            });
        });
            
    },
    fetch_order_data:function(){
        return new Promise(function(resolve,reject){ 
            var sql="SELECT * FROM foodItems";
            con.query(sql, function (err, result) {
                if (err) throw err;
                resolve(result);
            });
        });        
    },
    get_items_served:function(item){
        return new Promise(function(resolve,reject){
            var sql="SELECT createdItems FROM foodItems WHERE itemName = '"+item.itemName+"';"
            con.query(sql, function (err, result) {
                if (err) throw err;
                resolve(result[0].createdItems);
            });
        });     
    }, 
    update_item_served:function(item,createdItemsOld){
        return new Promise(function(resolve,reject){
            var updatedValue=createdItemsOld+item.quantity;
            var sql = "UPDATE foodItems SET createdItems = "+updatedValue+",quantity = "+0+" WHERE itemName = '"+item.itemName+"';"
            con.query(sql, function (err, result) {
                if (err) {
                    reject();
                    throw err;
                }
                
                resolve(result);
                console.log("1 record updated");
            });
        });
            
    }    
    
};
module.exports=db_api;
