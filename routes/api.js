var express = require('express');
var router = express.Router();

const request = require('request-promise');
const url = 'https://api.direct.yandex.ru/v4/json/';
const token = 'AgAAAABGJaNDAAHlKIfNtDVr5kFlq74xc1rsfxI';

class WordStatParse {
    constructor(phrases, geoId) {
        this.type = 'POST';
        this.uri = url;
        this.phrases = phrases;
        this.GeoID = geoId;

        this.options = {
            method: this.type,
            uri: this.uri,
            body: {},
            json: true
            // Тело запроса приводится к формату JSON автоматически
          }
    }

    async CreateNewWordstatReport() {
        let body = {
            "method": "CreateNewWordstatReport",
            "param": {
               /* NewWordstatReportInfo */
               "Phrases": this.phrases,
               "GeoID":  this.GeoID
            },
            "token" : token
        }

        this.options.body = body;

            let result = await request(this.options)
                .then(function (response) {
                    // Обработка ответа
                    return response;
                })
                .catch(function (err) {
                    // Работа с ошибкой
                    console.log(err);
                })
            return result;
        }

    async GetWordstatReportList() {
            let body = {
                "method": "GetWordstatReportList",
                "token" : token
            }
    
            this.options.body = body;
    
            let result = await request(this.options)
                .then(function (response) {
                    // Обработка ответа
                    return response;
                })
                .catch(function (err) {
                    console.log(err);
                })
            return result;
        }

        deleteWordstatReport(param) {
            let body = {
                "method": "DeleteWordstatReport",
                "param" : param,
                "token" : token
            }
    
            this.options.body = body;
    
            request(this.options)
                .then(function (response) {
                    // Обработка ответа
                    if(response.data == 1) {
                        console.log(`ReportID: ${param} sucessfully deleted.`);
                    }
                })
                .catch(function (err) {
                    // Работа с ошибкой
                    console.log(err);
                });
        }

        async GetWordstatReport(reportId) {
            let body = {
                "method": "GetWordstatReport",
                "param" : reportId,
                "token" : token
            }
    
            this.options.body = body;
    
            let reportList = await this.GetWordstatReportList();
            let ourReport = await reportList.data.filter((element, index) => {
                if(element.ReportID == reportId){
                    return element.ReportID;
                }
            });

            if(ourReport.length>0) {
                console.log('Репорт найден');
            }

            let result = await request(this.options)
                .then(function (response) {
                    // Обработка ответа
                    return response;
                })
                .catch(function (err) {
                    console.log(err);
                })
            return result;
        }

        async deleteAllReports() {
            let reportList = await this.GetWordstatReportList();
            reportList.data.forEach(element => {
                this.deleteWordstatReport(element.ReportID)
            });
        }

}

const options = {
    method: 'POST',
    uri: url,
    body: {
        "method": "GetWordstatReport",
        "param" : 771009682,
        "token" : token
    },
    json: true
    // Тело запроса приводится к формату JSON автоматически
  }

async function GetWordstatReport(reportId) {
    let data = new WordStatParse(['Холодильник'], []);
    let reportList = await data.GetWordstatReportList();
    let ourReport = await reportList.data.filter((element, index) => {
        if(element.ReportID == reportId){
            return element.ReportID;
        }
    });

    if(ourReport.length>0) {
        console.log('Репорт найден');
    }

    let result = await request(options)
        .then(function (response) {
            // Обработка ответа
            console.log(response);
            return response;
        })
        .catch(function (err) {
            console.log(err);
        })
    return result;
}

function deleteAllReports(){
    let data = new WordStatParse([''], []);
    data.deleteAllReports();
}

router.post('/', function(req, res, next) {
    switch(req.body.post_type){
        case 'new_search': {
            console.log('New search accepted:');
            console.log(req.body.phrase);
            GetWordstatReport(771009682);
            res.json({
                ok: true
            })
            break;
        }
    }
  });

  module.exports = router;