import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getToken(formData: any) {
    return this.httpClient.post('http://localhost:8000/token', formData);
  }

  tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  getUserInfo() {
    return this.httpClient.get('http://localhost:8000/users/me', {
      headers: new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('token')}`)
    });
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']).then();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !this.tokenExpired(localStorage.getItem('token')!);
  }
}