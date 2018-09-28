import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { Angular2Csv } from 'angular2-csv';
import { environment } from '../../environments/environment';
import * as io from "socket.io-client";
@Component({
  selector: 'app-display-order',
  templateUrl: './display-order.component.html',
  styleUrls: ['./display-order.component.css']
})
export class DisplayOrderComponent implements OnInit {
  url= environment.socket_url;
  socket = io(this.url);
  orderDetails=[];
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fetchOrderData();
    this.socket.on('order_data_changed', function (message) {
      this.fetchOrderData();
    }.bind(this));
  }
  fetchOrderData(){
    this.appService.fetchOrderData().subscribe(data=>{
      this.orderDetails=data["result"];
      console.log("order Details:",this.orderDetails);
    },
    error=>{
      console.log("error fetching order data");
    })
  }
  orderServed(itemName,quantity){
    console.log("quantity",quantity);
    this.appService.orderServed(itemName,quantity).subscribe(data=>{

    },error=>{
      console.log("error:",error);
    });
  }

  downloadReport(){
    let orderDataToDownload=[];
    for(let i=0;i<this.orderDetails.length;i++){
      let rowData={};
      rowData['itemName']=this.orderDetails[i]['itemName']+":";
      rowData['createdItems']=this.orderDetails[i]['createdItems'];
      rowData['predictedItems']=this.orderDetails[i]['predictedItems'];
      orderDataToDownload.push(rowData);
    }
    //console.log("data to download",orderDataToDownload);
    let options = {
      fieldSeparator: ' ',
      quoteStrings: '',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['dishName', 'Produced','Predicted']
  };
    new Angular2Csv(orderDataToDownload, 'order_data',options);
    //console.log("downloaded");
  }
}
