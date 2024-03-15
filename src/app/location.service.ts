import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionData } from './conditions-and-zip.type';

export const LOCATIONS : string = "locations";
export const ACTION_TYPE = {
  CREATE: 'create',
  REMOVE: 'remove',
}

@Injectable()
export class LocationService {

  locations : string[] = [];
  // Handle add or remove condition.
  actionSubject$ = new Subject<ActionData>();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locations = JSON.parse(locString);
  }

  addLocation(zipcode : string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.actionSubject$.next({actionType: ACTION_TYPE.CREATE, zipcode});
  }

  removeLocation(index: number) {
    this.actionSubject$.next({actionType: ACTION_TYPE.REMOVE, indexCondition: index});
  }

  removeZipcodeInLocalStorage(zipcode: string){
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
