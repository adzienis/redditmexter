const nodemailer = require('nodemailer');
const https = require('https');
//const fs = require('fs'); Not sure if explicit file necessary

const RedditMexter = class {
  constructor (email, number, options) {
    this.email = email;
    this.number = number;
    //this.file = fs.createWriteStream("test.json");
    this.contents = '';
    this.options = options;
    this.transporter = nodemailer.createTransport(options);
  }

  PullPosts(sub, cat) {
    const sup = this;

    https.get('https://www.reddit.com/r/' + sub +
      (cat === 'hot' ? '' : '/' + cat) + '.json', function(response) {
          response.on('data', (chunk) => {
            sup.contents += chunk;
          });

          response.on('end',  () => {
            //console.log(sup.contents);
            sup.contents = JSON.parse(sup.contents);
            //console.log(sup.contents.data.children[0].data.title);
               var message = {
                   from: sup.email,
                   to: sup.number + '@mms.att.net',
                   subject: sub,
                   text: sup.contents.data.children[0].data.title
                 //  html: '<p>HTML version of the message</p>'
               };
               sup.transporter.sendMail(message, (err, info) => {
                      if (err) {
                          return console.log(err);
                      }
                  });
          });
        });
    }
  }

module.exports.RedditMexter = RedditMexter;
