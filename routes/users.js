var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  var connection = req.connection;
   
    connection.query('select * from waste_type',function(err,rows){
        console.log("here");
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else{
            console.log(err);
            res.send(err);
        }

    });

    res.render('mainpage.html');
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
    var timenow = new Date();
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
        
        var d = new Date();

        function ISODateString(d){
        return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate()) +' '
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds());
        }
        function pad(n){
            return n<10 ? '0'+n : n;
        }

        
        
console.log(ISODateString(d));
        var total = 0;
        for(var i=0;i<9;i++){

            total+=parseInt(rates[i].waste_price_per_kg)*weights[i];
        }

        connection.query("INSERT INTO transaction(user_id,machine_id,total_amount_in_rs,wastetype1,wastetype2,wastetype3,wastetype4,wastetype5,wastetype6,wastetype7,wastetype8,wastetype9) VALUES ( ?,?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [customerId,machineId,total,weights[0],weights[1],weights[2],weights[3],weights[4],weights[5],weights[6],weights[7],weights[8]],function(err,results){

            if(err){
                console.log("Err"+err);

            }
            else{
                console.log("inserted");
            }
        });
        console.log("here");
    	res.send(total+"");

    });

	
	
});

router.get('/getdetails/:machine',function(req,res,next){

   
    var machineId = req.params.machine;
	var connection = req.connection;
   
    connection.query('select * from transaction where machine_id = ?',[machineId],function(err,rows){
        console.log("here");
        if(!err){
           // console.log(rows);
            res.render('mainpage.html',{rows:rows});
        }
        else{
            console.log(err);
            res.send(err);
        }

    });
});

module.exports = router;
