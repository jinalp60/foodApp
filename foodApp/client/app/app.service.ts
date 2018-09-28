import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }
  fetchOrderData(){
    return this.http.get("http://localhost:8000/fetchOrderData");
  }
  orderServed(itemName,quantity){
    return this.http.post("http://localhost:8000/orderServed",{"itemName":itemName,"quantity":quantity});
  }
}
