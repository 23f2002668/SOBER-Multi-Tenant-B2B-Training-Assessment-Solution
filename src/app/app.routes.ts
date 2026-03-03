import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { RegistrationComponent } from './registration/registration';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions';
import { LoginComponent } from './login/login';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { CompanyAdminDashboardComponent } from './company-admin-dashboard/company-admin-dashboard';


export const routes: Routes = [
    { path: '', component: HomeComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'terms-conditions', component: TermsConditionsComponent, title: 'Terms and Conditions - NET JRF Coaching'},
    {path: 'login', component: LoginComponent},
    {path: 'admin-dashboard', component: AdminDashboardComponent},
    {path: 'company-admin-dashboard', component: CompanyAdminDashboardComponent},
    { path: '**', redirectTo: 'login' }
];
