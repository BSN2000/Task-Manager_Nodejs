const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'pubkey-02dce4c1c0086fdaa950468363ee0614'});

mg.messages.create('sandboxe8fd94ad0ac844e6bc94755247561b4b.mailgun.org', {
	from: 'Excited User <mailgun@sandboxe8fd94ad0ac844e6bc94755247561b4b.mailgun.org>',
	to: ['prasadnagur09@gmail.com'],
	subject: "Hello",
	text: "Testing some Mailgun awesomeness!",
	html: "<h1>Testing some Mailgun awesomeness!</h1>"
})
.then(msg => console.log(msg)) // logs response data
.catch(err => console.log(err)); // logs any error


// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandboxe8fd94ad0ac844e6bc94755247561b4b.mailgun.org';
// const api_key = 'pubkey-02dce4c1c0086fdaa950468363ee0614'
// const mg = mailgun({apiKey: api_key, domain: DOMAIN});
// const data = {
// 	from: 'Excited User <me@samples.mailgun.org>',
// 	to: 'prasadnagur09@gmail.com',
// 	subject: 'Hello',
// 	text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });