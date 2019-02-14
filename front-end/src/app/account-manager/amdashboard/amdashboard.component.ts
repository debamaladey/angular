import { Component, OnInit, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-amdashboard',
  templateUrl: './amdashboard.component.html',
  styleUrls: ['./amdashboard.component.scss']
})
export class AmdashboardComponent implements OnInit {
  private chart: am4charts.XYChart;
  constructor(private zone: NgZone) { }
  selected = 'option1';
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.chartSlider();
    this.chartSlider2();
    this.loadprofile();
    this.charttopcustomers();
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
      let chart = am4core.create("cus-elect-graph2", am4charts.XYChart);
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

 
  loadprofile(){
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("load-profile-chart", am4charts.XYChart);
      chart.paddingRight = 20;
      // Add data
      chart.data = [ {
        "date": "2013-01-01",
        "value": 250,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-02",
        "value": 350,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-03",
        "value": 300,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-04",
        "value": 450,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-05",
        "value": 420,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-06",
        "value": 230,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-07",
        "value": 360,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-08",
        "value": 380,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-09",
        "value": 410,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-10",
        "value": 380,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-11",
        "value": 365,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-12",
        "value": 390,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-13",
        "value": 290,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-14",
        "value": 420,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-15",
        "value": 360,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-16",
        "value": 400,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-17",
        "value": 410,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-18",
        "value": 390,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-19",
        "value": 370,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-20",
        "value": 420,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-21",
        "value": 430,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-22",
        "value": 310,
        "fixed": 300,
        "lineColor":"#0d8924",
      }, {
        "date": "2013-01-23",
        "value": 360,
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
        "value": 420,
        "fixed": 300,
        "dashLength": 4,
      }, {
        "date": "2013-01-28",
        "value": 370,
        "fixed": 300,
        "dashLength":4,
      }, {
        "date": "2013-01-29",
        "value": 480,
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
      series.tensionX = 0.7;
    
    
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


  charttopcustomers(){
    
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("top-ele-customer", am4charts.XYChart);
      chart.paddingRight = 20;
      let data = [];
      let visits = 10;
      chart.data = [{
        "country": "Cus ID: 1284",
        "visits": 1000
      }, {
        "country": "Cus ID: 1524",
        "visits": 950
      }, {
        "country": "Cus ID: 2545",
        "visits": 920,
      }, {
        "country": "Cus ID: 3525",
        "visits": 750
      }, {
        "country": "Cus ID: 1112",
        "visits": 700
      }, {
        "country": "Cus ID: 5425",
        "visits": 680
      }, {
        "country": "Cus ID: 3652",
        "visits": 670
      }, {
        "country": "Cus ID: 4875",
        "visits": 620
      }, {
        "country": "Cus ID: 2144",
        "visits": 600
      }, {
        "country": "Cus ID: 9658",
        "visits": 580
      }];
      
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.renderer.labels.template.hideOversized = true;
      categoryAxis.renderer.opposite = true;
      categoryAxis.renderer.inside = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.tooltip.label.rotation = 270;
      categoryAxis.tooltip.label.horizontalCenter = "right";
      categoryAxis.tooltip.label.verticalCenter = "middle";
    

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      
      //valueAxis.title.text = "Countries";
      //valueAxis.title.fontWeight = "bold";
      

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.categoryX = "country";
      series.name = "Visits";
      series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.fill = am4core.color("#0D8924");
    
      series.propertyFields.fill = "#000000";
      

      let columnTemplate = series.columns.template;
      columnTemplate.strokeOpacity = 0;
      columnTemplate.column.cornerRadiusTopLeft = 100;
      columnTemplate.column.cornerRadiusTopRight = 100;
      columnTemplate.column.cornerRadiusBottomLeft = 100;
      columnTemplate.column.cornerRadiusBottomRight = 100;
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
 

  
  

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
    
  }

}
