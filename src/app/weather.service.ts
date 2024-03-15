import {Injectable, Signal, signal} from '@angular/core';
import {Observable, of, Subject, timer} from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip, COOKIE} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';

export const STORAGE_TIME: string = 'storageTime';

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: ConditionsAndZip[] = [];
  listenRemoveZipcode$ = new Subject<string>();
  // The storage time default is 7200 seconds (2hours).
  storageTime: string = '7200';
  destroyApi$ = new Subject();

  constructor(private http: HttpClient) {
    let storageTime = localStorage.getItem(STORAGE_TIME);
    if (storageTime)
      this.storageTime = storageTime;
  }

  addCurrentConditions(zipcode: string): void {
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
    .pipe(takeUntil(this.destroyApi$)).subscribe(data => {
      this.addItemIntoConditionsArray({zip: zipcode, data});
      const conditionsValue = JSON.stringify({zip: zipcode, data});
      document.cookie = `${COOKIE.CONDITIONS}${zipcode}=${conditionsValue}; max-age=${this.storageTime}; path=/`;
    });
  }

  removeCurrentConditions(index: number) {
    const zipcode = this.currentConditions[index]?.zip;
    if(zipcode){
      this.listenRemoveZipcode$.next(zipcode);
    }
  }

  getCurrentConditions(): ConditionsAndZip[] {
    return this.currentConditions;
  }

  clearConditions(){
    this.currentConditions = [];
  }

  addItemIntoConditionsArray(data: ConditionsAndZip){
    this.currentConditions.push(data);
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
    .pipe(tap((data) => {
      const forecaseValue = JSON.stringify(data);
      document.cookie = `${COOKIE.FORECAST}${zipcode}=${forecaseValue}; max-age=${this.storageTime}; path=/`;
    }));
  }

  setStorageTime(){
    localStorage.setItem(STORAGE_TIME, this.storageTime);
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
