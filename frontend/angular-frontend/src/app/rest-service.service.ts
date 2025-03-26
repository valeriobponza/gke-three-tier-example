import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  private apiUrl = 'http://localhost:3000'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  fetchData(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + "/users");
  }

}
