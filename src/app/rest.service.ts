import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  endpoint = 'http://ec2-54-90-17-93.compute-1.amazonaws.com:3000/';


  constructor(private http: HttpClient) {

  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  activeLambdaEmailer(): Observable<any> {
    let res = {};
    return this.http.post<any>(this.endpoint + 'aws/sendEmails', null)
      /*.pipe(tap( // Log the result or error
        data => console.log(data),
        error => console.log(error)
      ))//*/
      .pipe(map(this.extractData));
  }

  activeLambdaMassiveEmailer(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'aws/sendMassiveEmails', request)
      .pipe(map(this.extractData));
  }


  login(request): Observable<any> {
    let email = request.email;
    let password = request.password;
    let res = {};
    return this.http.post<any>(this.endpoint + 'users/login', request)
      .pipe(map(this.extractData));
  }

  addUser(request, headers): Observable<any> {
    return this.http.post<any>(this.endpoint + 'users/addUser', request, { headers: headers })
      .pipe(map(this.extractData));
  }

  createAdmin(): Observable<any> {
    return this.http.post<any>(this.endpoint + 'users/createAdminUser',{})
    .pipe(map(this.extractData));
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.endpoint + 'users/getUsers')
    .pipe(map(this.extractData));
  }

  getUserByEmail(request, headers): Observable<any> {
    return this.http.post<any>(this.endpoint + 'users/getUserByEmail', request, { headers: headers })
    .pipe(map(this.extractData));
  }

  getClients(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'clients/getClients', request)
    .pipe(map(this.extractData));
  }
  getLists(): Observable<any> {
    return this.http.get<any>(this.endpoint + 'lists/getListas')
    .pipe(map(this.extractData));
  }
  getBlacks(): Observable<any> {
    return this.http.get<any>(this.endpoint + 'black/getBlacks')
    .pipe(map(this.extractData));
  }


  setFilters(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'clients/setFilters', request)
    .pipe(map(this.extractData));
  }

  getFilters(): Observable<any> {
    return this.http.get<any>(this.endpoint + 'clients/getFilters')
    .pipe();
  }
  addLists(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'lists/addLists', request)
      .pipe(map(this.extractData));
  }

  addClients(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'clients/addClients', request)
      .pipe(map(this.extractData));
  }
  
  upsertClients(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'clients/upsertClients', request)
      .pipe(map(this.extractData));
  }

  createCampaign(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'campaigns/createCampaign', request)
      .pipe(map(this.extractData));
  }

  changePassword(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'users/changePassword', request);
    //.pipe(map(this.extractData));
  }

  getStadistics(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'aws/stadistics', request)
      .pipe(map(this.extractData));
  }

  getAllStatistics(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'aws/getAllStatistics', request)
      .pipe(map(this.extractData));
  }


}
