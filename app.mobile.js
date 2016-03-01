var http = require('http');
var url = require('url');
var fs = require('fs');

var options = {
    hostname: 'i.jandan.net',
    port: 80,
    path: '/?oxwlxojflwblxbsapi=jandan.get_ooxx_comments',
    method: 'GET',
    headers: {
        Connection: 'keep-alive',
        'User-Agent': 'Jandan Android App V3.0.0.0',
        //'Accept-Encoding': 'gzip'
    }
}

meizitu();

function meizitu(page) {

    if (page !== undefined) {
        options.path += '&page=' + page;
    }

    http.request(options, function (res) {

        var content = '';

        res.on('data', function (chunk) {
            content += chunk;
        });

        res.on('end', function () {
            
            var result = JSON.parse(content);
            
            console.log(result['current_page']);

            setTimeout(meizitu, 100, result['current_page'] + 1);
        });

        res.on('error', function (err) {
            console.log(err.mesage);
        });
    }).end();
}

function downloadFile(fileUrl) {

    var DOWNLOAD_PATH = './Images/';

    var fileName = DOWNLOAD_PATH + fileUrl.split('/').pop();

    http.get(fileUrl, function (res) {

        var ws = fs.createWriteStream(fileName);

        res.pipe(ws);

    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

}
