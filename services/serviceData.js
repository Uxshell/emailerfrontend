var lineReader = require('line-reader');
const AWS = require('aws-sdk');
const fs = require('fs');

const { moviesMock } = require('../utils/mocks/movies');
const e = require('express');
const readline = require('readline');
var Request = require("request");

const ID = 'AKIAWJ7YDV23ELLZBKPP';
const SECRET = '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';
const BUCKET_NAME = 'emailerfiles';

const { config } = require('../config');
const AWS_LAMBDA_EMAIL = config.lambdaEmail;

var cron = require('../node_modules/node-cron');
//var  cron  = require ( ' nodo-cron ' ) ;
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

class DataService {
    /*
    async getFileS3() {
        //var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
        var params = { Bucket: 'emailerfiles', Key: 'data.txt' };
        var file = require('fs').createWriteStream('./files/data_.txt');
        s3.getObject(params).createReadStream().pipe(file);
        console.log("end getFiless3");
    }
//*/
    async buildArrayEmail() {
        var objectResult = {};
        var jsonArr = [];

        var params = { Bucket: 'emailerfiles', Key: 'data.txt' };

        const rl = readline.createInterface({
            input: s3.getObject(params).createReadStream()
        });

        return new Promise((resolve, reject) => {
            var id = 0;
            const fileName = 'custom_clients.json';

            rl.on('line', function(line, last) {
                    //console.log(line);
                    //var line = lines[x];
                    //console.log('line: ' + line);
                    var pivot = 0;
                    var indexId = 2; //ignore tag and _id
                    var jsonItem = {};

                    for (var i = 0; i < size.length; i++) {
                        var sumIndex = pivot + size[i]
                        var item = line.substring(pivot, sumIndex).trim();
                        if (!isNaN(item)) {
                            item = parseInt(item, 10) + "";
                        }
                        pivot = pivot + size[i];
                        jsonItem[items[indexId++]] = item;

                    }
                    jsonArr.push(jsonItem);
                    id = id + 1;
                    console.log(id);
                })
                .on('close', function() {
                    console.log("close: " + jsonArr.length);
                    objectResult = {};

                    objectResult = {
                            data: {
                                arr: jsonArr
                            }
                        }
                        //console.log('myObj -----> ' + JSON.stringify(objResult));
                        //myObj["data"] = jsonArr;

                    //console.log("objectResult: " + JSON.stringify(objectResult));
                    //return objResult || {};
                    console.log("resolve...")
                    fs.writeFile('datajson.txt', JSON.stringify(objectResult), function(err) {
                        if (err) return console.log(err);
                        console.log('Hello World > datajson.txt');

                        fs.readFile('datajson.txt', (err, data) => {
                            if (err) throw err;
                            const params = {
                                Bucket: BUCKET_NAME, // pass your bucket name
                                Key: fileName, // file will be saved as testBucket/custom_clients.json
                                Body: JSON.stringify(objectResult, null, 2)
                            };
                            s3.upload(params, function(s3Err, objectResult) {
                                if (s3Err) throw s3Err
                                console.log(`File uploaded successfully at ${data.Location}`)
                            });
                        });
                    }); //console.log("objectResult: " + JSON.stringify(objectResult));

                    resolve(objectResult);
                });

            rl.on('error', function(err) {
                reject(err)
            });
        })

    }

    async buildArrayAndSendEmail() {
        var objectResult = {};
        var jsonArr = [];

        var params = { Bucket: 'emailerfiles', Key: 'data.txt' };

        const rl = readline.createInterface({
            input: s3.getObject(params).createReadStream()
        });

        var it = this;
        return new Promise((resolve, reject) => {
            var total = 0;

            rl.on('line', function(line) {
                    var pivot = 0;
                    var indexId = 2; //ignore tag and _id
                    var jsonItem = {};

                    for (var i = 0; i < size.length; i++) {
                        var sumIndex = pivot + size[i]
                        var item = line.substring(pivot, sumIndex).trim();
                        if (!isNaN(item)) {
                            item = parseInt(item, 10) + "";
                        }
                        pivot = pivot + size[i];
                        jsonItem[items[indexId++]] = item;

                    }
                    jsonArr.push(jsonItem);
                    total = total + 1;
                    //console.log(id);

                    //--------
                    objectResult = {};

                    objectResult = {
                            data: {
                                arr: jsonArr
                            }
                        }
                        //console.log("envia #: " + objectResult.data.arr.length);
                        //Envio asincrono de emails
                    it.sendEmail(objectResult)
                    jsonArr = [];
                })
                .on('close', function() {
                    console.log("close: " + jsonArr.length);
                    let response = {
                        statusCode: 200,
                        totalEmails: total,
                        //tiempo: tiempo
                    }
                    resolve(response)
                });

            rl.on('error', function(err) {
                console.error("error: " + err);
                reject(err)
            });
        })

    }

    async sendEmail(jsonObject) {
        


        Request.post({
            "headers": {
                "content-type": "application/json",
                "X-Amz-Invocation-Type": "Event"
            },
            "url": AWS_LAMBDA_EMAIL,
            "body": JSON.stringify(jsonObject)
        }, (error, response, body) => {
            if (error) {
                console.error(error);
                //reject(error);
            }
            //console.log("response server: " + JSON.stringify(response))
            //console.log("body server: " + JSON.stringify(body))

            /*
                        var bodyP = JSON.parse(body);

                        var status = bodyP.statusCode;
                        var totalEmails = bodyP.totalEmails;
                        var tiempo = bodyP.tiempo;

                        var result = {
                                statusCode: status,
                                totalEmails: totalEmails,
                                tiempo: tiempo
                            }
                            /*
                                            res.statusCode = status;
                                            res.totalEmails = totalEmails;
                                            res.tiempo = tiempo;
                                            //*/
            //console.log("response server: " + response)
            //console.log("response: " + res)
            //console.log("response: " + JSON.stringify(result))

        });
    }

/*BUILD TEMPLATE ANTES DE MIS CAMBIOS 

   async buildTemplateAndEmail(clientArray, html, subject) {
        var o = {} // empty Object
        var key = 'arr';
        //var htmls='htmls';
        var objResult = new Object();
        o[key] = clientArray;
        //o[htmls]= html;

        objResult.data = o;
        objResult.html = html;
        objResult.subject = subject;

        return objResult || {};

    }*/
    async buildTemplateAndEmail(clientArray, tags, html, subject) {
        var o = {} // empty Object
        var key = 'arr';
        //var htmls='htmls';
        var objResult = new Object();
        o[key] = clientArray;
        //o[htmls]= html;

        objResult.data = o;
        objResult.html = html;
        objResult.subject = subject;
        objResult.tags = tags;
        objResult.clientArray = clientArray;

        return objResult || {};

    }

}

module.exports = DataService;


var size = [60, 11, 18, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, +
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100
]

var items = [
    "_id",
    "tag",
    "nombre",
    "codigo",
    "nss",
    "curp",
    "fecha",
    "individual",
    "retiro",
    "voluntario",
    "vivienda",
    "retiro1997",
    "vejez",
    "cuotaSocial",
    "sar1992",
    "sarIssste",
    "retiroIssste",
    "vejezIssste",
    "cuotaSocialIssste",
    "bonoPension",
    "subtotalRetiro",
    "aporNoDeducibles",
    "aporDeducibles",
    "aporComplementarias",
    "aporLargoPlazo",
    "ahorroSolidario",
    "subtotalVoluntario",
    "infonavit1997",
    "infonavit1992",
    "fovissste1992",
    "fovissste2008",
    "subtotalVivienda",
    "total",
    "email"
]