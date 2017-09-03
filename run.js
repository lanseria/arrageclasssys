var ArrageClass = require('./lpsdk/arrageClass').ArrageClass;

var client = new ArrageClass({
  'row': 6,
  'col': 5,
  'many': 100,
})
client.execute(function(err, suc){
  if (err) {console.log(err);}
  else{
    console.log("Success!"+suc);
  }
});
