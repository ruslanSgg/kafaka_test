// const {producer} = require('../../services/kafka')
module.exports = function(req,res){
    var sentMessage = JSON.stringify(req.body.message);
    payloads = [
        { topic: req.body.topic, messages:sentMessage , partition: 0 }
    ];
    // producer.send(payloads, function (err, data) {
    //         res.json(data);
    // });
}
