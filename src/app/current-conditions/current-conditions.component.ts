import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {WeatherService} from "../weather.service";
import {ACTION_TYPE, LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip, COOKIE} from '../conditions-and-zip.type';
import { TabItemComponent } from 'app/components/tab-item/tab-item.component';
import { browser } from 'protractor';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: ConditionsAndZip[] = this.weatherService.getCurrentConditions();
  private destroy$ = new Subject();

  ngOnInit(){
    if(this.locationService.locations.length){
      for (let loc of this.locationService.locations){
        this.addCondition(loc);
      }
    }
    this.locationService.actionSubject$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if(res.actionType === ACTION_TYPE.CREATE){
        this.addCondition(res.zipcode);
      }else{
        this.weatherService.removeCurrentConditions(res.indexCondition);
      }
    });
    this.weatherService.listenRemoveZipcode$.pipe(takeUntil(this.destroy$)).subscribe((zipcode) => {
      this.locationService.removeZipcodeInLocalStorage(zipcode);
    })
  }

  addCondition(zipcode: string){
    // Split cookie string to find the key-value.
    const keyANDValueDataCookie = document.cookie.split('; ').find(item => item.startsWith(`${COOKIE.CONDITIONS}${zipcode}`))?.split("=");
    // keyANDValueDataCookie[0] is key, keyANDValueDataCookie[1] is value.
    if(keyANDValueDataCookie && keyANDValueDataCookie[0]?.split('-')[1] === zipcode){
      // Get data from store.
      const data = JSON.parse(keyANDValueDataCookie[1]) as ConditionsAndZip;
      this.weatherService.addItemIntoConditionsArray(data);
    }else{
      // Get data from api.
      this.weatherService.addCurrentConditions(zipcode);
    }
  }

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  closeTab(index: number){
    this.locationService.removeLocation(index);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.weatherService.destroyApi$.next(null);
    this.weatherService.destroyApi$.complete();
    this.weatherService.clearConditions();
  }
}
