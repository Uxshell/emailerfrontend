var fs = require("fs");
var mailComposer = require("nodemailer/lib/mail-composer");

const AWS = require("aws-sdk");
var ses = new AWS.SES({ apiVersion: "2010-12-01" });


sendMassiveEmail = async(event, context, callback) => {
    var clients = [];
    var htmlBody = "";
    var tags =[];
    var subject = "";
    if (!event.data) {
        console.log("event.body: " + JSON.stringify(event.body));
        let body = event.body;
        //clients = body.data.arr;
        clients = body.clientArray;
        tags = body.tags;
        htmlBody = body.html;
        subject = body.subject;
        console.log("arreglo tamaño: " + clients.length);
        console.log("tags"+tags);
        console.log("CLIENTES QUE LLEGAN A LA LAMBDA"+clients);

    } else {
        console.log("event.data: " + JSON.stringify(event.data));
        let data_ = event.data;
        clients = event.data.clientArray;
        htmlBody = event.html;
        subject = event.subject;
        tags = event.tags;
        console.log("arreglo tamaño: " + clients.length);
        console.log("tags"+tags);
        console.log("CLIENTES QUE LLEGAN A LA LAMBDA"+clients);

    }

    function promise() { 
        return new Promise(resolve => {
            sendEmailsAsync(client, htmlBody, subject);
        });
      }
    var iniDate = new Date();           
    var response = {};
    try {
        
        let result = await promise();
        response = {
            "statusCode": 200,
            "body": result,
            "tiempo": new Date() - iniDate
        };
        console.log("end response: " + JSON.stringify(response));
        return callback(null, response);
    } catch (e) {
        response = {
            statusCode: 400,
            error: e
        };
        console.log("error end of promises");

        return callback(null, response);
    }
};


function sendEmailsAsync(cliente, htmlBody, subject) {
    var error = {}
    var response = {}
    htmlBody =  processTag(htmlBody, cliente.name)
    subject = processTag(subject, cliente.name)
    return new Promise(resolve => {

        // encrypting pdf email

        let sendRawEmailPromise;
        const mail = new mailComposer({
            //from: "Afore XXI Banorte <experienciadelcliente@xxibanorte.com>",
            from: "Afore XXI Banorte <servicio.afore@xxi-banorte.com>",
            //from: "Afore XX <noe.vasquez.ext@xideral.co>",
            to: cliente.email,
            headers: {
                "X-SES-CONFIGURATION-SET": "EmailerSET",
                "X-SES-MESSAGE-TAGS": "emailerSetMetrics=Custom"
            },
            subject: subject,
            html: htmlBody
        });

        mail.compile().build(async(err, message) => {
            if (err) {
                error.code = "compiling_mail"
                error.message = "Error during email compilation (mailComposer)"
                response.status = 400
                response.body = error
                return resolve(response)
            }
            try {
                sendRawEmailPromise = await ses.sendRawEmail({ RawMessage: { Data: message } }).promise();
                response.status = 200
                response.body = sendRawEmailPromise;
                return resolve(response);


            } catch (err) {
                console.log("error of sendRawEmail");
                error.code = err.code || "invalid_email"
                error.message = err.message || "Error sending email"
                response.status = 400
                response.body = error
                console.log(err)
                return resolve(response)
            }
        });


    }); 
}