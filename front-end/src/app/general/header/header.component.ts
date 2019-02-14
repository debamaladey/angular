import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	now: Date;
	currentUser;
	userID;
	customerID;
	roleID;
	userType;
	roleName;

	constructor(private loginService: LoginService) { }

	ngOnInit() {
		this.now = new Date()
		// Create an Observable that will publish a value on an interval
		const secondsCounter = interval(60000);
		// Subscribe to begin publishing values
		secondsCounter.subscribe(n => this.now = new Date());
		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userID = this.currentUser.id;
		this.customerID = this.currentUser.customer_id;
		this.roleID = this.currentUser.role_id;
		this.userType = this.currentUser.role_user_type;
		this.roleName = this.currentUser.role_name;
	}

}
