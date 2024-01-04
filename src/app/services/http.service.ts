import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../constants/http/urls';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post(url: string, data: {}): Observable<any> {
    return this.http.post(url, data, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): {} {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
  }
}
