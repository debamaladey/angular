import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-msg-dialog',
  templateUrl: './msg-dialog.component.html',
  styleUrls: ['./msg-dialog.component.scss']
})
export class MsgDialogComponent implements OnInit {
  msg:any;
  msgStatus:any;
  constructor(private dialogRef: MatDialogRef<MsgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.msg = data.msg;
      this.msgStatus = data.msgStatus
    }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

}
