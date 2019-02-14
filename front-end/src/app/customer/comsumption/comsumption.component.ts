import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumptionService } from '../../services/consumption/consumption.service';
import { LoginService } from '../../services/login.service';
import { ListingComponent } from 'src/app/config/resource/listing/listing.component';
@Component({
  selector: 'app-consumption',
  templateUrl: './comsumption.component.html',
  styleUrls: ['./comsumption.component.scss']
})

export class ComsumptionComponent implements OnInit {

  consumptionList;
  returnUrl: string;
  errorMsg;
  succMsg;
  childId;

  constructor(private consumptionService: ConsumptionService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService) { }

   currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
   userId = this.currentUser.id;
   customerId = this.currentUser.customer_id;

  title = 'Ngx-tree-dnd example';
  currentEvent: string = 'start do something';
  consumptionTree;
  config = {
      showActionButtons: true,
      showAddButtons: true,
      showRenameButtons: true,
      showDeleteButtons: true,
      enableExpandButtons: true,
      enableDragging: false,
      rootTitle: 'consumption',
      validationText: 'Enter valid consumptionTr',
      minCharacterLength: 1,
      setItemsAsLinks: false,
      setFontSize: 32,
      setIconSize: 16
  };
  ngOnInit() {
    this.listing();    
  }
  listing(){
    this.consumptionService.consumption_lists(this.customerId).subscribe(data => {
      this.consumptionList = data.list;  
      if(this.consumptionList.length > 0){
        var tree = [];
        for(var i = 0; i < this.consumptionList.length; i++){
          this.childId = 0;
          var tcId = this.childId;
          var childrens = this.createArray(this.consumptionList[i]);           
          tree.push({
            name: this.consumptionList[i].name,
            id: this.consumptionList[i].id,
            childrens : childrens,
            childId : tcId
          });        
        }
        this.consumptionTree = tree;
      }
      
    });
  }
  createArray(consumptionArr) { 
    var obj = [];
    this.childId = this.childId +1;
    var tcId = this.childId;
    if(consumptionArr.children && consumptionArr.children.length>0){
      for(var i = 0; i < consumptionArr.children.length; i++){
          obj.push({
          name: consumptionArr.children[i].name,
          id: consumptionArr.children[i].id,
          childrens : this.createArray(consumptionArr.children[i]),
          childId : tcId
          });
      }              
    }
    return obj;
  }
  onDragStart(event) {
     this.currentEvent = ' on drag start';
  }
  onDrop(event) {
    this.currentEvent = 'on drop';
  }
  onAllowDrop(event) {
    this.currentEvent = 'on allow drop';
  }
  onDragEnter(event) {
    this.currentEvent = 'on drag enter';
  }
  onDragLeave(event) {
    this.currentEvent = 'on drag leave';
  }
  onAddItem(event) {
    this.currentEvent = 'on start Add item';
  }
  onStartRenameItem(event) {
     this.currentEvent = 'on start edit item';
  }
  onFinishRenameItem(event) {
    
      var parent_id;
      var event_id;
      var event_name;
      if(event.parent == 'root'){
        event_id = event.element.id;
        event_name = event.element.name;
        parent_id = 0;
      }else{
        event_id = event.element.id;
        event_name = event.element.name;
        parent_id = event.parent.id;
      }    
      this.consumptionService.consumption_update(event_id,event_name,parent_id,this.userId,this.customerId).subscribe(data => {
        this.listing();    
        this.returnUrl = 'customer/consumption' ;
        this.router.navigate([this.returnUrl]);
      });
   
  }
  onDeleteItem(event) {
    
    if(event.element.childrens.length > 0){
      var msg = 'Are you sure to delete? If you delete all child will be deleted.';
    } else {
      var msg = 'Are you sure to delete?';
    }
    if(confirm(msg)) {
      var event_id = event.element.id;
      this.consumptionService.consumption_delete(event_id).subscribe(data => {
        this.listing(); 
        this.returnUrl = 'customer/consumption' ;
        this.router.navigate([this.returnUrl]);
      });
    } else {
      this.listing();    
      this.returnUrl = 'customer/consumption' ;
      this.router.navigate([this.returnUrl]);
    }
  }
}

