import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { TodService } from '../tod.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tod-zone-add-edit',
  templateUrl: './tod-zone-add-edit.component.html',
  styleUrls: ['./tod-zone-add-edit.component.scss']
})
export class TodZoneAddEditComponent implements OnInit {
  currentUser: any;
  userId:number;
  selected = '';
  todForm: FormGroup;
  workingHours:Array<{id:number,val:string}>;
  msg: any = "";
  msgStatus: any = "";
  todListData;

  constructor(private fb: FormBuilder,private loginService: LoginService, private todService: TodService, private route: ActivatedRoute,
    private router: Router) {
    this.workingHours = [];
  }

  ngOnInit() {
    this.setTempMsgDetails();
    this.setSessionUser();
    this.setWorkingHour();
    this.todForm = this.fb.group({
      todItems: this.fb.array([])
    });
    this.getList();
    
  }

  getList(){
    this.todService.list().subscribe(retData => {
      this.todListData = retData.rep.data;
      if(this.todListData.length > 0){
        this.todListData.forEach(element => {
          this.updateTodConfigFields(element);
        });
      }else{
        this.addTodConfigFields(0);
      }
    });
    console.log(this.todForm);
  }

  get todItems() {
    return this.todForm.get('todItems') as FormArray;
  }

  updateTodConfigFields(data: any ) {
		const es = this.fb.group({
      tod_id: data.tzm_id,
      tod_name: [data.tod_name,[Validators.required]],
      sun_start: [data.sun_start,[Validators.required]],
      sun_end: [data.sun_end,[Validators.required]],
      mon_start: [data.mon_start,[Validators.required]],
      mon_end: [data.mon_end,[Validators.required]],
      tues_start: [data.tues_start,[Validators.required]],
      tues_end: [data.tues_end,[Validators.required]],
      wed_start: [data.wed_start,[Validators.required]],
      wed_end: [data.wed_end,[Validators.required]],
      thur_start: [data.thur_start,[Validators.required]],
      thur_end: [data.thur_end,[Validators.required]],
      fri_start: [data.fri_start,[Validators.required]],
      fri_end: [data.fri_end,[Validators.required]],
      sat_start: [data.sat_start,[Validators.required]],
      sat_end: [data.sat_end,[Validators.required]],
      created_by : this.userId,
    })
    const formarrr = this.todForm.get('todItems') as FormArray;
    formarrr.push(es);
	}
  
  addTodConfigFields(iloop: any = 0) {
		const es = this.fb.group({
      tod_id: 0,
      tod_name: ['',[Validators.required]],
      sun_start: ['',[Validators.required]],
      sun_end: ['',[Validators.required]],
      mon_start: ['',[Validators.required]],
      mon_end: ['',[Validators.required]],
      tues_start: ['',[Validators.required]],
      tues_end: ['',[Validators.required]],
      wed_start: ['',[Validators.required]],
      wed_end: ['',[Validators.required]],
      thur_start: ['',[Validators.required]],
      thur_end: ['',[Validators.required]],
      fri_start: ['',[Validators.required]],
      fri_end: ['',[Validators.required]],
      sat_start: ['',[Validators.required]],
      sat_end: ['',[Validators.required]],
      created_by : this.userId,
      
    })
    const formarr = this.todForm.get('todItems') as FormArray;
    formarr.push(es);
	}

  cloneForm(): void {
    this.addTodConfigFields(0);
  }

  setWorkingHour(){
    for (let i:number = 0; i < 25; i++) {
      if(i > 9){
        if(i == 24){
          this.workingHours.push({"id": i,"val": "00:00:00"});
        }else{
          this.workingHours.push({"id": i,"val": i+":00:00"});
        }
      }else{
        this.workingHours.push({"id": i,"val": "0"+i+":00:00"});
      }
    }
  }

  setSessionUser(){
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
  }

  firstChange(formVal){
    //console.log(formVal);
    this.addFirstTodConfigFields(formVal)
  }

  addFirstTodConfigFields(iloop: number = 0) {
		// const es = this.fb.group({
    //   tod_id: 0,
    //   tod_name: ['',[Validators.required]],
    //   sun_start: ['',[Validators.required]],
    //   sun_end: ['',[Validators.required]],
    //   mon_start: ['',[Validators.required]],
    //   mon_end: ['',[Validators.required]],
    //   tues_start: ['',[Validators.required]],
    //   tues_end: ['',[Validators.required]],
    //   wed_start: ['',[Validators.required]],
    //   wed_end: ['',[Validators.required]],
    //   thur_start: ['',[Validators.required]],
    //   thur_end: ['',[Validators.required]],
    //   fri_start: ['',[Validators.required]],
    //   fri_end: ['',[Validators.required]],
    //   sat_start: ['',[Validators.required]],
    //   sat_end: ['',[Validators.required]],
    // })
    // const formarr = this.todForm.get('todItems') as FormArray;
    // formarr.push(es);
	}

  endChange(formVal){
    //console.log(formVal);
  }

  onSubmit(){
    var formData = this.todForm.value;
    var error: number = 0;
    if(formData.todItems.length > 0){
      error = this.checkCustomValidation(formData.todItems);
      if(error == 0){
        //console.log(formData.todItems);
        this.saveData(formData.todItems);
      }else{
        this.msg = "Somthing went wrong.";
        this.msgStatus = "danger";
      }
    }
  }

  saveData(todItems: any){
    this.todService.saveTodZone(todItems).subscribe(
      retData => {
        this.msg = retData.rep.msg;
        this.msgStatus = retData.rep.status;
        if(this.msgStatus == 'success'){
          // localStorage.setItem('tempMsg', retData.rep.msg);
          // localStorage.setItem('tempMsgStatus', retData.rep.status);
          setTimeout(() => {
            this.todForm = this.fb.group({
              todItems: this.fb.array([])
            });
            this.getList();
          }, 1000);
        }
        //console.log(retData);
      },
      error => {
        this.msg = error.error.message;
        this.msgStatus = 'danger';
      }
    )
  }

  checkCustomValidation(todItems: any){
    var error: number = 0;
    todItems.forEach(element => {
      
    });
    return error;
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
  }
  

}

