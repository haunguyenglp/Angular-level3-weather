import {CurrentConditions} from './current-conditions/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}

export interface ActionData {
    actionType: string;
    zipcode?: string;
    indexCondition?: number;
}

export const COOKIE = {
    CONDITIONS: 'conditions-',
    FORECAST: 'forecast-'
}