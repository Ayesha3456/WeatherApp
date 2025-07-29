import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private base_url = 'https://api.openweathermap.org/data/2.5/weather?q=';
  private params = '&units=metric&APPID=eb03b1f5e5afb5f4a4edb40c1ef2f534';

  constructor(private http: HttpClient) {}

  getWeather(city: string) {
    const safeCity = encodeURIComponent(city.trim());
    return this.http.get(`${this.base_url}${safeCity}${this.params}`);
  }
}
