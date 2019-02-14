import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResouceService } from '../../services/resource/resouce.service';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})

export class ResourceComponent implements OnInit {

  resoucelist;
  returnUrl: string;
  errorMsg;
  succMsg;
  childId;

  constructor(private resouceService: ResouceService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService) { }

   currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
   userId = this.currentUser.id;
   customerId = this.currentUser.customer_id;

  title = 'Ngx-tree-dnd example';
  currentEvent: string = 'start do something';
  resourceTree;
  config = {
      showActionButtons: true,
      showAddButtons: true,
      showRenameButtons: true,
      showDeleteButtons: true,
      enableExpandButtons: true,
      enableDragging: false,
      rootTitle: 'Resources',
      validationText: 'Enter valid Resource',
      minCharacterLength: 1,
      setItemsAsLinks: false,
      setFontSize: 32,
      setIconSize: 16
  };
 
  ngOnInit() {
    this.listing();      
  }
  listing(){
    this.resouceService.resouce_lists(this.customerId).subscribe(data => {
      this.resoucelist = data.list;  
      if(this.resoucelist.length > 0){
        var tree = [];
        for(var i = 0; i < this.resoucelist.length; i++){
          this.childId = 0;
          var tcId = this.childId;
          var childrens = this.createArray(this.resoucelist[i]);  
          tree.push({
            name: this.resoucelist[i].name,
            id: this.resoucelist[i].id,
            childrens : childrens,
            childId : tcId
          });        
        }
        this.resourceTree = tree;
      }
      
    });
  }  
  createArray(resurceArr) { 
    var obj = [];
    this.childId = this.childId +1;
    var tcId = this.childId;
    
    if(resurceArr.children && resurceArr.children.length>0){
      for(var i = 0; i < resurceArr.children.length; i++){        
        obj.push({
        name: resurceArr.children[i].name,
        id: resurceArr.children[i].id,
        options: {
          showAddButtons: false
        },
        childrens : this.createArray(resurceArr.children[i]),
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
    
    var is_child = event.parent.childId;
    if(is_child == 2){
      alert('You cannot add more child');
      this.listing();    
      this.returnUrl = 'customer/resources' ;
      this.router.navigate([this.returnUrl]);
    }
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
      this.resouceService.resouce_update(event_id,event_name,parent_id,this.userId,this.customerId).subscribe(data => {
        this.listing();    
        this.returnUrl = 'customer/resources' ;
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
      this.resouceService.resouce_delete(event_id).subscribe(data => {
        this.listing();    
        this.returnUrl = 'customer/resources' ;
        this.router.navigate([this.returnUrl]);
      });
    } else {
      this.listing();    
      this.returnUrl = 'customer/resources' ;
      this.router.navigate([this.returnUrl]);
    }
  }
}
