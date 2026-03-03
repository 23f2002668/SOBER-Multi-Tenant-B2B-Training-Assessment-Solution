import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo';
import { HeaderComponent } from "../header/header";

@Component({
  selector: 'app-company-admin-dashboard',
  imports: [LogoComponent, HeaderComponent],
  templateUrl: './company-admin-dashboard.html',
  styleUrl: './company-admin-dashboard.css',
})
export class CompanyAdminDashboardComponent {

}
