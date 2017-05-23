import { Component, Input, Output, EventEmitter, AfterViewInit, AfterViewChecked, OnInit} from '@angular/core';

@Component({
    selector: 'my-chart',
    templateUrl: './chart.base.component.html',
    // providers: [ReportService]

})
export class BasicChartReport implements AfterViewInit, AfterViewChecked, OnInit {
    @Input() ChartTitle: string;
    @Input() desc: string="This is small example of todo list";
    @Input() ChartData: any;
    @Output() yearChanged = new EventEmitter();

    @Input() HideCustom: boolean = true;
    @Output() customChanged = new EventEmitter();
    @Output() yearChangedForOrder = new EventEmitter();

    @Input() ActiveClientList: any;
    SelectedYear: number;
    // lineChart
    public lineChartData: any[];
    public lineChartLabels: Array<any>;
    public lineChartType: string = 'line';
    public legend: boolean = true;

    // YearArrary
    public Years: Array<any> = [];
    public CurrentYear: any;
    public DefaultYear: any;
    CurrentDate: Number = Date.now();
    public randomizeType(): void {

        this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    }

    public chartClicked(e: any): void {
        
    }

    public chartHovered(e: any): void {
       
    }

    constructor() {
        this.ChartData = { data: [{ data: [], label: 2016 }, { data: [], label: 2016 }], label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
        this.lineChartLabels = this.ChartData.label;
        this.lineChartData = this.ChartData.data;
        this.CurrentYear = new Date().getFullYear();
        this.DefaultYear = new Date().getFullYear();
        this.Years = [];
        this.ActiveClientList = [];

    }
    ngOnInit() {
        this.getAllActiveClient();
        this.createRange();
    }

    createRange() {
        for (var i = this.CurrentYear; i >= 2016; i--) {
            this.Years.push(i);
        }
        return this.Years;
    }
    getAllActiveClient() {
          
    }
    ngAfterViewInit() {
        if (this.ChartData != null) {
            //this.lineChartLabels = this.ChartData.label;
            //this.lineChartData = this.ChartData.data;
        }
    }
    ngAfterViewChecked() {
        if (this.ChartData != null) {
            //console.log("Chart Data", this.ChartData.data);
            this.lineChartLabels = this.ChartData.label;
            this.lineChartData = this.ChartData.data;
        }
    }

    public onYearChange(event) {
        this.yearChanged.emit(event);
        this.yearChangedForOrder.emit(event);
    }
    public onClientChange(event) {
        this.customChanged.emit(event);
    }
    
}
