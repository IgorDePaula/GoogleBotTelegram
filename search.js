const request = require('request');
const cheerio = require('cheerio');

var iconv = require('iconv-lite');
var url = 'https://www.google.com.br/search';
var options = {
  encoding: 'binary',
  qs:
  {
    'q':'agua'
  },
  useQuerystring:true,
  "Content-type": "application/x-www-form-urlencoded;",
};
var resultsq = []
  request(url,options,function(error, response, body){
    if (!error && response.statusCode == 200) {
      // var ic = new Iconv('utf-8','ISO-8859-1');
      //      var buf = ic.convert(body);
      //     var bodys = buf.toString('utf-8');
      console.log(body)
      var utf8String = iconv.decode(new Buffer(body), "utf8");
      //var utf8String = (new Buffer(body)).toString('utf8');
      var $ = cheerio.load(entities.decodeHTML(utf8String));
      var i=0;
      $('div.g').each(function(){
        var item = $(this).html();
        i++
        var $content = cheerio.load(item);
        var title = $content('h3 a').text();
        var description = $content('.s .st').text();
        var message = 'http://'+$content('.s cite').text();
        if(description.length > 0){
        resultsq.push({
      		type: 'article',
      		id: 'clear-'+i,
      		title: title,
          message_text: message,
          description: description
      	})}
      })
      console.log(resultsq);

    }
  })
