import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration';
import { LoginComponent } from './login/login';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('business-operations-automation-system');
}

