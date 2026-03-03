import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { HeaderComponent } from "../header/header";
import { FormsModule } from '@angular/forms';              // FormsModule enables template-driven forms in Angular. It provides: [(ngModel)], ngForm, ngModelChange
import { CommonModule } from '@angular/common';            // Required for *ngIf, *ngFor, etc.

@Component({
  selector: 'app-registration',
  standalone: true,  // Required
  imports: [RouterLink, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class RegistrationComponent {
    countries: string[] = ['C1', 'C2'];

    password = '';
    confirmPassword = '';
    passwordMismatch = false;

    constructor(private router: Router) {};

    verifyPassword() {
      if (this.password !== this.confirmPassword) {
        this.passwordMismatch = true;
        alert("Pasword & Confirm Password are different");
        return false;
      }
      
      this.passwordMismatch = false;
      this.router.navigate(["/admin-dashboard"]);
      return true;
    }
}
