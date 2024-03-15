import { Component } from '@angular/core';
import { WeatherService } from 'app/weather.service';
import {LocationService} from "../location.service";

export enum Mode {
  Normal = 'normal',
  Edit = 'Edit'
}

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css']
})
export class ZipcodeEntryComponent {
  Mode = Mode;
  // Storage time value.
  timesValue: string = '0';
  // Mode edit time or normal.
  mode: string = Mode.Normal;
  // Check error for storage time control.
  hasError: boolean = false;
  // Current storage time value.
  currentStorageTime: string;

  constructor(private service : LocationService, private weatherService: WeatherService) {
    this.timesValue = this.weatherService.storageTime;
    this.currentStorageTime = this.timesValue;
  }

  addLocation(zipcode : string){
    this.service.addLocation(zipcode);
  }

  // Set storage time.
  onSetTime(){
    this.weatherService.storageTime = this.timesValue;
    this.weatherService.setStorageTime();
    this.mode = Mode.Normal;
  }

  onEditTime(){
    this.mode = Mode.Edit;
  }

  timeChange(time: string){
    if(Number.isNaN(Number(time))){
      this.hasError = true;
    }else{
      this.timesValue = time;
      this.hasError = false;
    }
  }

  cancelEdit(){
    if(this.hasError || !this.timesValue){
      this.timesValue = this.currentStorageTime;
    }
    this.mode = Mode.Normal;
    this.hasError = false;
  }
}
