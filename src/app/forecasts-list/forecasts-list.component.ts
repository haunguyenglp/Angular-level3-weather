import { Component, OnDestroy, OnInit } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import { COOKIE } from 'app/conditions-and-zip.type';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route : ActivatedRoute) {
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
    });
  }

  ngOnInit(): void {
    this.getListForecast(this.zipcode);
  }

  getListForecast(zipcode: string){
    // Split cookie string to find the key-value.
    const keyANDValueDataCookie = document.cookie.split('; ').find(item => item.startsWith(`${COOKIE.FORECAST}${zipcode}`))?.split("=");
    // keyANDValueDataCookie[0] is key, keyANDValueDataCookie[1] is value.
    if(keyANDValueDataCookie && keyANDValueDataCookie[0]?.split('-')[1] === zipcode){
      // Get data from srote.
      const data = JSON.parse(keyANDValueDataCookie[1]) as Forecast;
      this.forecast = data;
    } else {
      // Get data from api.
      this.weatherService.getForecast(zipcode)
      .pipe(takeUntil(this.destroy$)).subscribe(data => this.forecast = data);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
