const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
var Bot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
var bot
if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  //bot = new Bot(token, { webHook: { port: process.env.PORT, host: process.env.HEROKU_URL } });
  //bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}
console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');
console.log(process.env.HEROKU_URL);

var url = 'https://www.google.com.br/search';

bot.onText(/^\/start$/, function(msg) {
	bot.sendMessage(msg.from.id, 'Put my username and one term separated by space for see results on google search site. Something like @glegoobot term.')
})
bot.on('inline_query', function(msg) {
var resultsq = []
  var j=0;
  var options = {
    encoding: 'binary',
    qs:
    {
      'q':msg.query
    },
    useQuerystring:true
  };
  request(url,options,function(error, response, body){
    //console.log(response.headers);
    if (!error && response.statusCode == 200) {

      var utf8String = iconv.decode(new Buffer(body), "UTF8");
      var $ = cheerio.load(utf8String);
      var i=0;
      $('div.g').each(function(){
        var item = $(this).html();
        i++
        var $content = cheerio.load(item);
        var title = $content('h3 a').text();
        var description = $content('.s .st').text();
        var message = $content('.s cite').text();
        if(message.indexOf('http') === -1){
          message = 'http://'+message
        }
        if(description.length > 0){
        resultsq.push({
      		type: 'article',
      		id: 'clear-'+i,
      		title: title,
          message_text: message,
          description: description
      	})}
      })
    bot.answerInlineQuery(msg.id,resultsq)

    }
  })

})
module.exports = bot
