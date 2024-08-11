import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders({
  "Content-Type": "application/json"
})

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient) { }

  get(url: string): Observable<any> {
    return this.http.get<any>(url, {headers: headers});
  }

  post(url: string, payload: any): Observable<any> {
    return this.http.post<any>(url, payload, {headers: headers})
  }

  put(url: string, payload: any): Observable<any> {
    return this.http.put<any>(url, payload, {headers: headers})
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(url, {headers: headers});
  }

}
