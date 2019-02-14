import { Component, OnInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { LoginService } from 'src/app/services/login.service';
import { DashboardService } from 'src/app/services/customer/dashboard.service';
import { round } from '@amcharts/amcharts4/.internal/core/utils/Math';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  private chart: am4charts.XYChart;
  selected = '';
  currentUser;
  userId;
  customerId;
  consumptionDropdown:any;
  consumptionDropdownSelected:any ="1";
  consumptionTitle:any;
  consumptionUnitTitle:any;
  consumptionChartType:String = 'today';
  consumptionChartTagId:any = "";
  consumptionChartData:any = "";
  majorConsumptionDropdownSelected:any;
  majorConsumptionTitle:any = "";
  majorConsumptionUnitTitle:any;
  majorConsumptionChartType:String = 'today';
  resourceList;

  constructor(private zone: NgZone, private loginService: LoginService, private dashboardService : DashboardService) { 
    
  }
  
  ngOnInit() {
    this.setSessionData();
    this.setConsumptionDetails();
  }

  setConsumptionDetails(){
    this.setResourceConsumptionDropdown();
  }

  setResourceConsumptionDropdown(){
    this.dashboardService.getConsumptionResourceDropdown().subscribe(
      retData => {
        var listArr = {};
        if(retData.list.length > 0){
          var tempResId = 0;
          retData.list.forEach(element => {
            if(tempResId != element.p_resource_id){
              listArr[element.p_resource_id] = {};
              listArr[element.p_resource_id]['res_data'] = {
                id: element.p_resource_id,
                name: element.p_resource_name,
                disabled: false,
              };
              listArr[element.p_resource_id]['meter_data'] = {};
              tempResId = element.p_resource_id;
            }
            listArr[element.p_resource_id]['meter_data'][element.meter_id] = {
              id : element.meter_id,
              name : element.meter_name
            };
          });
          this.consumptionDropdownSelected = retData.list[0].meter_id;
          this.consumptionDropdown = listArr;
          this.consumptionTitle = this.majorConsumptionTitle = retData.list[0].p_resource_name;
          this.consumptionUnitTitle = this.majorConsumptionUnitTitle = retData.list[0].unit_name;
          this.consumptionChartTagId = retData.list[0].tag_id;
          this.majorConsumptionDropdownSelected = retData.list[0].p_resource_id;
          this.setChartConsumptionData();
          this.setChartMajorConsumptionData();
          //this.generateChartConsumption();
        } 
    });
  }

  changeConsumptionDropdown(meter_id){
    this.dashboardService.getConsumptionResourceUnitDetails(meter_id).subscribe(
      retData => {
          this.consumptionTitle = retData.list[0].resource_name;
          this.consumptionUnitTitle = retData.list[0].unit_name;
          this.consumptionChartTagId = retData.list[0].tag_id;
          this.setChartConsumptionData();
          //this.generateChartConsumption();
      }
    );
  }

  changeMajorConsumptionDropdown(resource_id){
    this.dashboardService.getMajorConsumptionResourceUnitDetails(resource_id).subscribe(
      retData => {
        this.majorConsumptionTitle = retData.list[0].p_resource_name;
        this.majorConsumptionUnitTitle = retData.list[0].unit_name;
        this.majorConsumptionDropdownSelected = retData.list[0].p_resource_id;
        this.setChartMajorConsumptionData();
      }
    );
  }

  setSessionData(){
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
    this.customerId = this.currentUser.customer_id;
  }

  ngAfterViewInit() {
    this.chartSlider();
    this.chartEnergyIntensity();
    this.chartPie();
    this.chartSlider2();
  }

  chartSlider(){
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("cus-elect-graph", am4charts.XYChart);
      chart.paddingRight = 20;
      // Add data
      chart.data = [ {
        "date": "2013-01-01",
        "value": 5,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-02",
        "value": 20,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-03",
        "value": 34,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-04",
        "value": 55,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-05",
        "value": 80,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-06",
        "value": 90,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-07",
        "value": 95,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-08",
        "value": 110,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-09",
        "value": 130,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-10",
        "value": 135,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-11",
        "value": 155,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-12",
        "value": 160,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-13",
        "value": 165,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-14",
        "value": 190,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-15",
        "value": 195,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-16",
        "value": 210,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-17",
        "value": 215,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-18",
        "value": 230,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-19",
        "value": 240,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-20",
        "value": 250,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-21",
        "value": 290,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-22",
        "value": 310,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-23",
        "value": 320,
        "fixed": 300,
        "dashLength": 4,
        "lineColor":"#FF8F1C",
      }, {
        "date": "2013-01-24",
        "value": 325,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-25",
        "value": 330,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-26",
        "value": 350,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-27",
        "value": 360,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-28",
        "value": 370,
        "fixed": 300,
        "dashLength":4,
      }, {
        "date": "2013-01-29",
        "value": 375,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-30",
        "value": 400,
        "fixed": 300,
        "dashLength": 4,
      }];

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      

      // Create series
      // Create series 1
      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "fixed";
      series1.dataFields.dateX = "date";
      series1.tooltipText = "{fixed}"
      series1.strokeWidth = 1;
      series1.minBulletDistance = 15;
      // Create series 2
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.tooltipText = "{value}"
      series.strokeWidth = 2;
      series.fillOpacity = 0.4;
      series.minBulletDistance = 15;
      series.propertyFields.stroke = "lineColor";
      series.propertyFields.strokeDasharray = "dashLength";
      series.propertyFields.fill = "lineColor";
    
    
      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 0;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#333333");

      var bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 2.2;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

      // Create vertical scrollbar and place it before the value axis
      // chart.scrollbarY = new am4core.Scrollbar();
      // chart.scrollbarY.parent = chart.leftAxesContainer;
      // chart.scrollbarY.toBack();

      // Create a horizontal scrollbar with previe and place it underneath the date axis
      // chart.scrollbarX = new am4charts.XYChartScrollbar();
      // chart.scrollbarX.series.push(series);
      // chart.scrollbarX.parent = chart.bottomAxesContainer;
      
    });
  }

  chartSlider2(){
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("cus-elect-graph3", am4charts.XYChart);
      chart.paddingRight = 20;
      // Add data
      chart.data = [ {
        "date": "2013-01-01",
        "value": 5,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-02",
        "value": 20,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-03",
        "value": 34,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-04",
        "value": 55,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-05",
        "value": 80,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-06",
        "value": 90,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-07",
        "value": 95,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-08",
        "value": 110,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-09",
        "value": 130,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-10",
        "value": 135,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-11",
        "value": 155,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-12",
        "value": 160,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-13",
        "value": 165,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-14",
        "value": 190,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-15",
        "value": 195,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-16",
        "value": 210,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-17",
        "value": 215,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-18",
        "value": 230,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-19",
        "value": 240,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-20",
        "value": 250,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-21",
        "value": 290,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-22",
        "value": 310,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-23",
        "value": 320,
        "fixed": 300,
        "dashLength": 4,
        "lineColor":"#FF8F1C",
      }, {
        "date": "2013-01-24",
        "value": 325,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-25",
        "value": 330,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-26",
        "value": 350,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-27",
        "value": 360,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-28",
        "value": 370,
        "fixed": 300,
        "dashLength":4,
      }, {
        "date": "2013-01-29",
        "value": 375,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-30",
        "value": 400,
        "fixed": 300,
        "dashLength": 4,
      }];

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      

      // Create series
      // Create series 1
      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "fixed";
      series1.dataFields.dateX = "date";
      series1.tooltipText = "{fixed}"
      series1.strokeWidth = 1;
      series1.minBulletDistance = 15;
      // Create series 2
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.tooltipText = "{value}"
      series.strokeWidth = 2;
      series.fillOpacity = 0.4;
      series.minBulletDistance = 15;
      series.propertyFields.stroke = "lineColor";
      series.propertyFields.strokeDasharray = "dashLength";
      series.propertyFields.fill = "lineColor";
    
    
      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 0;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#333333");

      var bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 2.2;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

      // Create vertical scrollbar and place it before the value axis
      // chart.scrollbarY = new am4core.Scrollbar();
      // chart.scrollbarY.parent = chart.leftAxesContainer;
      // chart.scrollbarY.toBack();

      // Create a horizontal scrollbar with previe and place it underneath the date axis
      // chart.scrollbarX = new am4charts.XYChartScrollbar();
      // chart.scrollbarX.series.push(series);
      // chart.scrollbarX.parent = chart.bottomAxesContainer;
      
    });
  }

  setChartConsumptionData(){
    this.dashboardService.getConsumptionTagData(this.consumptionChartTagId, this.consumptionChartType).subscribe(
      retData => {
        console.log(retData);
        this.consumptionChartData = retData.list;
        this.generateChartConsumption();
      }
    )
    
  }

  setChartMajorConsumptionData(){

  }

  consumDummyData(){
    this.consumptionChartData = [ {
      "date": "2013-01-01 00:00",
      "value": 5,
      "fixed": 430,
      "lineColor":"#0d8924",
    }, {
      "date": "2013-01-01 01:00",
      "value": 20,
      "fixed": 430,
      "lineColor":"#0d8924",
    }, {
      "date": "2013-01-01 02:00",
      "value": 34,
      "fixed": 430,
      "lineColor":"#0d8924",
    }, {
      "date": "2013-01-01 03:00",
      "value": 55,
      "fixed": 430,
      "lineColor":"#0d8924",
    }, {
      "date": "2013-01-01 04:00",
      "value": 80,
      "fixed": 430,
      "lineColor":"#0d8924",
    }, {
      "date": "2013-01-01 05:00",
      "value": 420,
      "fixed": 430,
      "dashLength": 4,
    }, {
      "date": "2013-01-01 06:00",
      "value": 460,
      "fixed": 430,
      "dashLength":4,
    }, {
      "date": "2013-01-01 07:00",
      "value": 470,
      "fixed": 430,
      "dashLength": 4,
    }, {
      "date": "2013-01-01 08:00",
      "value": 510,
      "fixed": 430,
      "dashLength": 4,
    }];
  }

  generateChartConsumption(){
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("cus-elect-graph-1", am4charts.XYChart);
      chart.paddingRight = 20;
      // Add data
      chart.data = this.consumptionChartData;
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.ticks.template.disabled = true;
      categoryAxis.renderer.line.opacity = 0;
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.dataFields.category = "date";
      categoryAxis.startLocation = 0.4;
      categoryAxis.endLocation = 0.6;
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      // Create series 1
      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "fixed";
      series1.dataFields.categoryX = "date";
      series1.tooltipText = "{fixed}"
      series1.strokeWidth = 1;
      series1.minBulletDistance = 15;
      // Create series 2
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "date";
      series.tooltipText = "{value}"
      series.strokeWidth = 1;
      series.fillOpacity = 0.4;
      series.minBulletDistance = 15;
      series.propertyFields.stroke = "lineColor";
      series.propertyFields.strokeDasharray = "dashLength";
      series.propertyFields.fill = "lineColor";
    
      
      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 0;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#333333");

      var bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 2.2;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = categoryAxis;
      chart.cursor.snapToSeries = series;
      
    });
  }

  

  chnageConsumptionPeriod(type:any='today'){
    this.consumptionChartType = type;
    this.setChartConsumptionData();
  }

  chnageMajorConsumptionPeriod(type:any='today'){
    this.majorConsumptionChartType = type;
  }

  chartEnergyIntensity(){
    
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("energyIntensityGraph", am4charts.XYChart);
      chart.paddingRight = 20;
      let data = [];
      let visits = 10;
      chart.data = [{
        "country": "Nov 01",
        "visits": 221
      }, {
        "country": "Nov 02",
        "visits": 226
      }, {
        "country": "Nov 03",
        "visits": 350
      }, {
        "country": "Nov 04",
        "visits": 450
      }, {
        "country": "Nov 05",
        "visits": 500
      }, {
        "country": "Nov 06",
        "visits": 492
      }, {
        "country": "Nov 07",
        "visits": 356
      }, {
        "country": "Nov 08",
        "visits": 256
      }, {
        "country": "Nov 09",
        "visits": 300
      }, {
        "country": "Nov 10",
        "visits": 480
      }, {
        "country": "Nov 11",
        "visits": 159
      }, {
        "country": "Nov 12",
        "visits": 441
      }, {
        "country": "Nov 13",
        "visits": 386
      }, {
        "country": "Nov 14",
        "visits": 386
      }, {
        "country": "Nov 15",
        "visits": 384
      }, {
        "country": "Nov 16",
        "visits": 500
      }, {
        "country": "Nov 17",
        "visits": 328
      }];
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.disabled = false;
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.labels.template.rotation = 315;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.tooltip.label.rotation = 270;
      categoryAxis.tooltip.label.horizontalCenter = "right";
      categoryAxis.tooltip.label.verticalCenter = "middle";

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = false;
      valueAxis.title.text = "Countries";
      valueAxis.title.fontWeight = "bold";

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.categoryX = "country";
      series.name = "Visits";
      series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.fill = am4core.color("#0D8924");
      
      //series.propertyFields.fill = "#000000";
      

      let columnTemplate = series.columns.template;
      columnTemplate.strokeOpacity = 0;
      //columnTemplate.strokeWidth = 2;
      //columnTemplate.strokeOpacity = 1;
      //columnTemplate.stroke = am4core.color("#000000");
      

      // columnTemplate.adapter.add("fill", (fill, target) => {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // columnTemplate.adapter.add("stroke", (stroke, target) => {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0.7;
      chart.cursor.lineY.strokeOpacity = 0.7;
      
    });
  }

  chartPie(){
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("pieChart", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      //chart.legend = new am4charts.Legend();

      chart.data = [
        {
          country: "Process",
          litres: 1000,
        },
        {
          country: "HVAC",
          litres: 600
        },
        {
          country: "Others",
          litres: 340
        },
        {
          country: "Lighting",
          litres: 300
        }
      ];

     

      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "litres";
      series.dataFields.category = "country";
      series.labels.template.fill = am4core.color("white");
      series.labels.template.radius = am4core.percent(-50);
      series.alignLabels = false;
      series.ticks.template.disabled = true;
      //series.labels.template.text = "{value.percent.formatNumber('#.0')}";
      series.labels.template.text = "{country}";
      series.colors.list = [
        am4core.color("#0D8924"),
        am4core.color("#0072CE"),
        am4core.color("#FF8F1C"),
        am4core.color("#77C5D5"),
      ];
    });
  }
  

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
    
  }

}
