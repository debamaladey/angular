import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VirtualMeterService } from '../virtual-meter.service';
import { LoginService } from '../../../services/login.service';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	currentUser: any;
	userId: any;
	customerId: any;
	meters: any;
	errorMsg;
	succMsg;

	constructor(private virtualMeterService: VirtualMeterService, private route: ActivatedRoute,
		private router: Router, private loginService: LoginService) { }

	ngOnInit() {
		this.succMsg = localStorage.getItem('succMsg');
		this.errorMsg = localStorage.getItem('errorMsg');
		localStorage.setItem('succMsg', '');
		localStorage.setItem('errorMsg', '');

		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
		this.customerId = this.currentUser.customer_id;

		this.virtualMeterService.listMeter(this.customerId).subscribe(data => {
			this.meters = data.list;
		});

	}

	deleteMeter(id) {
		if (confirm("Are you sure to delete?")) {
			this.virtualMeterService.deleteMeter(id)
				.subscribe(data => {
					console.log(data);
					this.succMsg = data.msg;
					this.virtualMeterService.listMeter(this.customerId).subscribe(data => {
						this.meters = data.list;
					});
				},
					error => {
						this.errorMsg = error.error.message;
					});
		}
	}

	editMeter(id) {
		this.router.navigate(['/customer/virtual-meter/edit/', id]);
	}

}
