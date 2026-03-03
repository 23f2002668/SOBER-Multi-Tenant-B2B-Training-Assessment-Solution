import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo';

@Component({
  selector: 'app-header',
  imports: [RouterOutlet, LogoComponent, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

}
