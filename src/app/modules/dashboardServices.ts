import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//*/
export class DashboardService {

  constructor(public rest: RestService) { }

  async getValueWithAsync() {
    const value = await this.getAndBuildStadistics();
    console.log(`async result: ${value}`);
    return value;
    //console.log(`async result: ${value}`);
  }


  async getAndBuildStadistics() {
    let it = this;
    let response = {};
    let request = {
      "startDate": "2020/07/01",
      "endDate": "2020/07/23"
    }
    this.rest.getAllStatistics(request).subscribe((data) => {
      console.log("ALL: " + JSON.stringify(data));
    });

    return new Promise(async function (resolve, reject) {
      it.rest.getStadistics({}).subscribe((data) => {
        //console.log("stadistics data: " + JSON.stringify(data));
        if (data.response.statusCode == 200) {
          let body = data.response.body;

          let newBody = JSON.parse(JSON.stringify(body));
          //console.log("body: " + newBody);
          let bodyParse = JSON.parse(newBody);
          let sendDataPoints = bodyParse.SendDataPoints

          let delivery = 0;
          let bounces = 0;
          let complaints = 0;
          let rejects = 0;
          let emailTotal = 0
          for (let i = 0; i < sendDataPoints.length; i++) {
            let obj = sendDataPoints[i];
            let deliveryAttempts = obj.DeliveryAttempts;
            let bouncesO = obj.Bounces;
            let complaintsO = obj.Complaints;
            let rejectsO = obj.Rejects;

            delivery += deliveryAttempts;
            bounces += bouncesO;
            complaints += complaintsO;
            rejects += rejectsO;


          }
          console.log("deliveryAttempts: " + delivery);
          console.log("bounces: " + bounces);
          console.log("complaints: " + complaints);
          console.log("rejects: " + rejects);


          response["delivery"] = delivery;
          response["bounces"] = bounces;
          response["complaints"] = complaints;
          response["rejects"] = rejects;
          response["total"] = delivery + bounces + complaints + rejects;

          //resolve(response);
          resolve([3, 4, 6, 10]);


        }//if
        else {
          reject("error")
        }
      });


    }).then(function (value) {
      console.log("finish promise" + value);
      //it.valueGlobal = value;
      console.log("build graphics...");

    });
  }





  cards() {
    return [10, 40, 80, 66];
  }

  pieChartDelivery(responseData) {

    return [{
      name: 'Entregados',
      y: (responseData.Delivery/responseData.Send) * 100,
      sliced: true,
      selected: true
    }, {
      name: 'Bounce ',
      y: (responseData.Bounce/responseData.Send) * 100,
     
    }, {
      name: 'No Entregados',
      y: (responseData.undelivered/responseData.Send) * 100,
    }];
  }

  pieChartOpen(responseData) {
    console.log("entregados: " + responseData.Delivery);
    console.log("bounce: " + responseData.Bounce);
    console.log("abiertos: " + responseData.Open);
    console.log("click: " + responseData.Click);
    console.log("No entregados: " + responseData.Reject);
    console.log("enviados: " + responseData.Send);

    return [{
      name: 'Open',
      y: responseData.Open,
      sliced: true,
      selected: true
    }, {
      name: 'Click',
      y: responseData.Click
    }];
  }
}
