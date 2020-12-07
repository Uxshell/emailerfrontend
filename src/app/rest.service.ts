import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RestService {
//endpoint = 'http://ec2-18-234-63-154.compute-1.amazonaws.com:3000/';
endpoint = 'http://localhost:3000/';
  

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
  activeSchedule(request): Observable<any>{
    return this.http.post<any>(this.endpoint + 'aws/sendMassiveEmailsWithSchedule', request)
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
  
  crearLista(req):Observable<any> {

  
    return this.http.post<any>(this.endpoint + 'api/listas/',req)
    .pipe(map(this.extractData));
  
  }

  crearBlack(nombre: string):Observable<any> {
  
    return this.http.post<any>(this.endpoint + 'api/blacks/',{nombre})
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
  getCompanys(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/companys/getCompanys')
    .pipe(map(this.extractData));
  }

  crearCompany(nombre: string):Observable<any> {
  
    return this.http.post<any>( 'http://localhost:3000/api/companys/',{nombre})
    .pipe(map(this.extractData));
  
  }
  getClients(request): Observable<any> {
    
    return this.http.post<any>(this.endpoint + 'clients/getClients', request)
    .pipe(map(this.extractData));
  }
  getLists(userId:string): Observable<any> {
    //    return this.http.get<any>(this.endpoint + 'api/listas/getListas')
    return this.http.post<any>('http://localhost:3000/api/listas/getListas', {userId})
    .pipe(map(this.extractData));
  }
  getListsPro(request): Observable<any> {
    //    return this.http.get<any>(this.endpoint + 'api/listas/getListas')
    return this.http.post<any>('http://localhost:3000/api/listas/getListas', request)
        .pipe(map(this.extractData));
      }
  getCampanias():Observable<any>{
    return this.http.get<any>('' + 'http://localhost:3000/campaigns/getCampaigns')
    .pipe(map(this.extractData));
  }
  searchLista(seleccionada: string):Observable<any> {

  
    return this.http.post<any>(this.endpoint + 'api/listas/buscarLista',{seleccionada})
    .pipe(map(this.extractData));
  
  }
 /* removeList(req):Observable<any>{
    return this.http.delete<any>(this.endpoint + 'lists/deleteList', request)
    .pipe(map(this.extractData));
  }*/
  getBlacks(): Observable<any> {
    return this.http.get<any>(this.endpoint + 'api/blacks/getBlacks')
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
  addBlack(request): Observable<any> {
    return this.http.post<any>(this.endpoint + 'api/blacks/addBlack', request)
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
