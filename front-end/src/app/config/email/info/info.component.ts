import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  emailForm: FormGroup;
  emailProtocolList: any;
  selectedProtocol: any = '';
  msg: any = "";
  msgStatus: any = "";
  currentUser: any;
  userId: number;

  constructor(private fb: FormBuilder, private loginService: LoginService, private commonService: CommonService, public dialog: MsgDialogService) { }

  ngOnInit() {
    this.setSessionUser();
    this.setEmailProtocolList();
    this.setForm();
    this.setEmailValue();
  }

  setForm() {
    this.emailForm = this.fb.group({
      protocol: this.fb.control('', [Validators.required]),
      email_from: this.fb.control('', [Validators.required]),
      host_name: this.fb.control('', [Validators.required]),
      smtp_port: this.fb.control('', [Validators.required]),
      smtp_user: this.fb.control('', [Validators.required]),
      smtp_password: this.fb.control('', [Validators.required]),
      created_by: this.fb.control(this.userId),
    })
  }

  setEmailValue() {
    this.commonService.getEmailDetails().subscribe(
      retData => {

        var dbData = retData.rep.data.list[0];
        this.selectedProtocol = dbData.protocol;
        if (this.selectedProtocol == 'smtp') {
          this.smtpForm(dbData);
        } else {
          this.sendemailForm(dbData);
        }
        this.emailForm.patchValue({
          protocol: dbData.protocol,
          email_from: dbData.email_from,
          host_name: dbData.host_name,
          smtp_port: dbData.smtp_port,
          smtp_user: dbData.smtp_user,
          smtp_password: dbData.smtp_password,
        })
      }
    )
  }

  setEmailProtocolList() {
    this.emailProtocolList = [
      { "code": "sendmail" },
      { "code": "smtp" },
    ]
  }

  generateForm(val) {
    var formData = this.emailForm.value;
    this.selectedProtocol = val;
    if (val != '' && val == 'smtp') {
      this.smtpForm(formData);
    } else if (val != '' && val == 'sendmail') {
      this.sendemailForm(formData);
    }
  }

  smtpForm(formData) {
    this.emailForm = this.fb.group({
      protocol: this.fb.control(formData.protocol, [Validators.required]),
      email_from: this.fb.control(formData.email_from, [Validators.required, Validators.email]),
      host_name: this.fb.control(formData.host_name, [Validators.required]),
      smtp_port: this.fb.control(formData.smtp_port, [Validators.required]),
      smtp_user: this.fb.control(formData.smtp_user, [Validators.required]),
      smtp_password: this.fb.control(formData.smtp_password, [Validators.required]),
      created_by: this.fb.control(this.userId),
    })
  }

  sendemailForm(formData) {
    this.emailForm = this.fb.group({
      protocol: this.fb.control(formData.protocol, [Validators.required]),
      email_from: this.fb.control(formData.email_from, [Validators.required, Validators.email]),
      host_name: this.fb.control(''),
      smtp_port: this.fb.control(''),
      smtp_user: this.fb.control(''),
      smtp_password: this.fb.control(''),
      created_by: this.fb.control(this.userId),
    })
  }

  onSubmit() {
    var table_name = "email_config";
    var data = this.emailForm.value;
    if (this.emailForm.status == 'VALID') {
      this.commonService.add(table_name, data).subscribe(
        retData => {
          this.msg = "Successfully updated the email configuration details!";
          this.msgStatus = "success";
          this.dialogOpen();
        })
    } else {
      this.msg = "Something went wrong!";
      this.msgStatus = "danger";
      this.dialogOpen();
    }
  }

  dialogOpen() {
    if (this.msg != '') {
      this.dialog.openInfoModal(this.msg, this.msgStatus);
    }
  }

  setSessionUser() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
    this.userId = this.currentUser.id;
  }

}
