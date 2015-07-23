var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/transaction/:input',function(req,res,next){

	var inputs ={};
	var input = req.params.input;
	inputs = input.split('$');

	var customerId = inputs[0];
	var machineId = inputs[1];

	var weights = inputs[2].split(',');
	var rates = {};
    var total = 0;

    var connection = req.connection;

    connection.query('select waste_price_per_kg from waste_type',function(err,rows){

    	
    	if(err){
            console.log("error in connection");
        }

        else{
            console.log("got");
    	rates = rows.slice(0);
    	console.log(rates[2].waste_price_per_kg);
    	   if(err){
    		  console.log("error "+err);
    	   }
        }
        
        var total = 0;
        for(var i=0;i<9;i++){

            total+=parseInt(rates[i].waste_price_per_kg)*weights[i];
        }

        connection.query('insert into waste_price_per_kg(waste_name,waste_price_per_kg) values (?,?);',["16","323"],function(err,results){

            if(err){
                console.log("Err");

            }
            else{
                console.log("inserted");
            }
        });
        console.log("here");
    	res.send(total+"");

    });
    /*for(String s:weights){

    	total+=Integer.parseInt(s)*rates[i++];
    }*/


	//console.log(inputs[0]);
	
	
});
module.exports = router;
