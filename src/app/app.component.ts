import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { DataService } from './services/data.service';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nistantriTech-task';

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  private dateTimeSubscription!: Subscription;
  private temperatureSubscription!: Subscription;

  addDataForm!: FormGroup
  maxDate: Date = new Date();

  dateTimeArr: string[] = []
  temperatureArr: number[] = []


  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.dateTimeArr,
    datasets: [
      { data: [...this.temperatureArr] }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(
    private fb: FormBuilder,
    private _dataService: DataService,
    private cdr: ChangeDetectorRef){

  }

  ngOnInit(): void {

    this._dataService.dateTimeData.subscribe((data: any) => {
      console.log("Data of date", data)
      this.dateTimeArr.push(data)
      // this.updateChart();
    })

    this._dataService.temperatureData.subscribe((data: any) => {
      console.log("Data of temperature", data)
      this.temperatureArr.push(data)
      // this.updateChart();
    })
    
    this.createForm()
  }

  ngOnDestroy(): void {
    if (this.dateTimeSubscription) {
      this.dateTimeSubscription.unsubscribe();
    }
    if (this.temperatureSubscription) {
      this.temperatureSubscription.unsubscribe();
    }
  }

  tabChange(event: any){
    this.updateChart();

  }

  

  createForm(){
    this.addDataForm = this.fb.group({
      dateTime: ['', [Validators.required]],
      temperature: ['', [Validators.required]]
    })
  }

  updateChart(): void {
    this.barChartData = {
      labels: [...this.dateTimeArr],
      datasets: [
        { data: [...this.temperatureArr], label: 'Temperature' }
      ]
    };
    this.cdr.detectChanges(); // Trigger change detection manually

  }
  

  

  onFormSubmit(){
    // create service and store that data in that and then get that data and show in chart
    this.addDataForm.markAllAsTouched()

    if(this.addDataForm.valid){
      console.log("this.temperatureArr", this.temperatureArr)
      console.log("this.dateTimeArr", this.dateTimeArr)

      this._dataService.dateTimeData.next(this._dataService.formattedDateAndTime(this.addDataForm.value.dateTime))
      this._dataService.temperatureData.next(this.addDataForm.value.temperature)

      this.addDataForm.reset()
      
      this.tabGroup.selectedIndex = 1;

      // Reset form state
      this.addDataForm.markAsPristine();
      this.addDataForm.markAsUntouched();
    }
    
  }
}
