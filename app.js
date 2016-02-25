var http = require('http');
var url = require('url');
var fs = require('fs');
var cheerio = require('cheerio');

var options = {
    hostname: 'i.jandan.net',
    port: 80,
    path: '/ooxx',
    method: 'GET',
    headers: {
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5'
    }

}

meizitu();

function meizitu(page) {

    if (page !== undefined) {
        options.path += '/page-' + page;
    }

    http.request(options, function (res) {

        var content = '';

        res.on('data', function (chunk) {
            content += chunk;
        });

        res.on('end', function () {

            var $ = cheerio.load(content);

            var currentPage = $('.current-comment-page').first().text();

            if (currentPage === '') {
                fs.writeFile('./error.txt', content, function (err) {
                   if (err) throw err;
                   console.log('It\'s done!');
                });
                return;
            }

            currentPage = currentPage.substr(1, currentPage.length - 2);

            console.log('Page: ' + currentPage);

            $('.commentlist li p img').each(function () {

                var imageUrl = $(this).attr('org_src');

                if (imageUrl === undefined) {
                    imageUrl = $(this).attr('src');
                }

                downloadFile(imageUrl);
            });

            setTimeout(meizitu, 5000, currentPage - 1);
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
