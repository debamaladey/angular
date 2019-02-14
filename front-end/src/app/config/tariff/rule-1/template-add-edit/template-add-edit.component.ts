import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { TodService } from '../tod.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-add-edit',
  templateUrl: './template-add-edit.component.html',
  styleUrls: ['./template-add-edit.component.scss']
})
export class TemplateAddEditComponent implements OnInit {
  selected = '';
  templateForm : FormGroup;
  msg: any = "";
  msgStatus: any = "";
  currentUser: any;
  userId: number;

  constructor(private fb: FormBuilder,private loginService: LoginService, private todService: TodService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.setTemplateForm();

  }

  setTemplateForm(){
    this.templateForm = this.fb.group({
      tm_id:[],
      temp_name : [],
      state_id : [],
      city_id : [],
      resource_id : [],
      rp_id : [], // resource parameter table
      ru_id : [], // resource parameter unit table
      table_id: [],
      // tables: this.fb.array([])
    })
  }

  get tables() {
    return this.templateForm.get('tables') as FormArray;
  }

  setSessionUser(){
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
  }

}
