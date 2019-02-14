import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MsgDialogComponent } from './msg-dialog/msg-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MsgDialogService {

  constructor(public dialog: MatDialog) { }

  openInfoModal(msg, msgStatus) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    dialogConfig.data = {
      msg: msg,
      msgStatus: msgStatus
    }
    if (msg != null) {
      this.dialog.open(MsgDialogComponent, dialogConfig);
    }

  }

  openConfirmModal(msg) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    dialogConfig.data = {
      msg: msg,
    }
    if (msg != null) {
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    }
  }

}
