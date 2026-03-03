import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { HeaderComponent } from "../header/header";

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  goTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
