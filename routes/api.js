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
            return result.data;
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
            const body = {
                    "method": "GetWordstatReport",
                    "param" : reportId,
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

        async deleteAllReports() {
            let reportList = await this.GetWordstatReportList();
            reportList.data.forEach(element => {
                this.deleteWordstatReport(element.ReportID)
            });
        }

}

async function deleteAllReports(){
    let data = new WordStatParse([''], []);
    let allReports = await data.GetWordstatReportList();
        if(allReports.data.length>4){
            deleteAllReports();
        }
    data.deleteAllReports();
}

async function waiting(data, newReport){
    let allReports = await data.GetWordstatReportList();
    allReports.data.forEach((element)=>{
        if(element.ReportID == newReport){
            if(element.StatusReport == 'Done'){
                console.log(element);
                console.log('Отчет готов!');
                return true;
            }
            else{
                console.log(element);
                console.log('Отчёт еще не готов.');
                return false;
            }
        }
    });
}

async function dataRequest(data, newReport){
    let res = await data.GetWordstatReport(newReport);
    console.log(res['data'][0].SearchedWith);
}

async function getData(phrase) {
    await deleteAllReports();
    let data = new WordStatParse([phrase], []);
    let newReport = await data.CreateNewWordstatReport();

    const intervalObj = setInterval(()=>{
        if(waiting(data, newReport)){
            dataRequest(data,newReport);
            clearInterval(intervalObj);
        }
    }, 10000);
}

router.post('/', function(req, res, next) {
    switch(req.body.post_type){
        case 'new_search': {
            console.log('New search accepted:');
            console.log(req.body.phrase);

            getData(req.body.phrase);
            //GetWordstatReport(771009682);

            res.json({
                ok: true
            })
            break;
        }
    }
  });

  module.exports = router;