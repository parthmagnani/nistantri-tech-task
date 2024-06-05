import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // dateTimeData = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ]
  // temperatureData = [ 65, 59, 70, 75, 56, 55, 40 ]
  
  temperatureData = new Subject()
  dateTimeData = new Subject()

  constructor() { }


  formattedDateAndTime(dateValue: any){
    const date = new Date(dateValue);


    const month = date.toLocaleString('default', { month: 'short' }); 
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }
}
