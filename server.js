var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'green.heaven.london@gmail.com',
        pass: 'Gr33nh34v3n'
    },
    tls: {
        rejectUnauthorized: false
    }
};
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);
app.use(express.static(__dirname + '/public'));
app.post('/api/send_query',function(req,res){
	console.log(req.body)
	if( typeof req.body == 'undefined') { return res.json({error: "body is undefined"})}
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: req.body.first_name + 
	    ' ' + req.body.last_name +' 👥 <' + req.body.email + '>', // sender address
	    to: 'green.heaven.london@gmail.com', // list of receivers
	    subject: 'Contact from Green Heaven ✔', // Subject line
	    text: "User: " + req.body.first_name + " " + req.body.last_name + 
	    " " + req.body.email + "\nMessage: " + req.body.message, // plaintext body	    
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return res.json(error)
	    }
	    return res.json(info)
	});
})
app.listen(3111, function () {
  console.log('Green Heaven app listening on port 3111!');
})