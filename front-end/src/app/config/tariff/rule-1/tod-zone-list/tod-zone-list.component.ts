import { Component, OnInit } from '@angular/core';
declare var $ : any;

@Component({
  selector: 'app-tod-zone-list',
  templateUrl: './tod-zone-list.component.html',
  styleUrls: ['./tod-zone-list.component.scss']
})
export class TodZoneListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function() {
      $('#todlist').DataTable({
        columnDefs: [
          { targets: 'no-sort', orderable: false }
        ]
      });
    });
  }

}
