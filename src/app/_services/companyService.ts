
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



  
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {}

  getAddresses() {
    return this.http.get('/api/companys/getC').pipe(
      map((data: any) => {
        return data;
      })
    );
  }
}



    


    

    


