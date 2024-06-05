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
export class AppComponent implements OnInit{
  title = 'nistantriTech-task';

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;


  addDataForm!: FormGroup
  maxDate: Date = new Date();



  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this._dataService.dateTimeData,
    datasets: [
      { data: [...this._dataService.temperatureData] }
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
    
    this.createForm()
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
      labels: [...this._dataService.dateTimeData],
      datasets: [
        { data: [...this._dataService.temperatureData], label: 'Temperature' }
      ]
    };
    this.cdr.detectChanges(); // Trigger change detection manually

  }
  

  

  onFormSubmit(){
    // create service and store that data in that and then get that data and show in chart
    this.addDataForm.markAllAsTouched()

    if(this.addDataForm.valid){
      

      this._dataService.dateTimeData.push(this._dataService.formattedDateAndTime(this.addDataForm.value.dateTime))
      this._dataService.temperatureData.push(this.addDataForm.value.temperature)

      this.addDataForm.reset()
      
      this.tabGroup.selectedIndex = 1;

      this.addDataForm.markAsPristine();
      this.addDataForm.markAsUntouched();
    }
    
  }
}
