import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  city: string = '';
  citySuggestions: string[] = [];
  weather: any = null;
  loading: boolean = false;
  bgImageUrl: { [key: string]: string } = {};
  isDarkBackground: boolean = false;

  constructor(private weatherService: WeatherService) {}

  onCityInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.city = input;

    if (!input.trim()) {
      this.citySuggestions = [];
      this.weather = null;
      this.bgImageUrl = {};
      return;
    }

    const cities = ['Chennai', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata'];
    this.citySuggestions = cities.filter(c => c.toLowerCase().startsWith(input.toLowerCase()));
  }

  getWeather() {
    if (!this.city.trim()) {
      this.weather = null;
      this.bgImageUrl = {};
      return;
    }

    this.loading = true;

    this.weatherService.getWeather(this.city).subscribe({
      next: (data: any) => {
        const main = data.main;
        const weather = data.weather[0];

        this.weather = {
          city: data.name,
          country: data.sys.country,
          temp: main.temp,
          feelsLike: main.feels_like,
          humidity: main.humidity,
          windSpeed: data.wind.speed,
          description: weather.description,
          icon: `https://openweathermap.org/img/w/${weather.icon}.png`,
        };

        this.setBackgroundImage(weather.description);
        this.loading = false;
      },
      error: (err) => {
        console.error('Weather fetch failed', err);
        this.weather = null;
        this.bgImageUrl = {};
        this.loading = false;
      }
    });
  }

  getWeatherClass(): string {
    const desc = this.weather?.description?.toLowerCase() || '';
    const temp = this.weather?.temp || 0;

    if (desc.includes('sun')) return 'sunny';
    if (desc.includes('cloud')) return 'cloudy';
    if (desc.includes('rain')) return 'rainy';
    if (desc.includes('snow')) return 'snowy';
    if (desc.includes('storm') || desc.includes('thunder')) return 'stormy';

    if (temp > 40) return 'very-hot';
    if (temp > 30) return 'hot';
    if (temp > 20) return 'warm';
    if (temp > 10) return 'cool';
    if (temp <= 10) return 'cold';

    return 'default-weather';
  }

  setBackgroundImage(description: string) {
    const desc = description.toLowerCase();
    let bg = '';
  
    if (desc.includes('clear')) {
      bg = 'linear-gradient(to right, #fceabb, #f8b500)';
      this.isDarkBackground = false;
    } else if (desc.includes('cloud')) {
      bg = 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      this.isDarkBackground = true;
    } else if (desc.includes('rain')) {
      bg = 'linear-gradient(to right, #00c6ff, #0072ff)';
      this.isDarkBackground = true;
    } else if (desc.includes('snow')) {
      bg = 'linear-gradient(to right, #e0eafc, #cfdef3)';
      this.isDarkBackground = false;
    } else if (desc.includes('storm') || desc.includes('thunder')) {
      bg = 'linear-gradient(to right, #1e3c72, #2a5298)';
      this.isDarkBackground = true;
    } else {
      bg = 'linear-gradient(to right, #434343, #000000)';
      this.isDarkBackground = true;
    }
  
    this.bgImageUrl = { 'background-image': bg };
  }
}
