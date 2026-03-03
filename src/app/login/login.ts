import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HeaderComponent } from "../header/header";

interface LoginResponse {
    message: string,
    username: string,
    usertype: string,
    token: string
}

// Component Decorators
// We can think of decorators as metadata added to our code. When we use @Component on the HelloWorld class, we are “decorating” HelloWorld as a Component.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {
    protected readonly title = signal("Login Page");  // Signals are functions in Angular 21, so we need to call it to get the value

    username: string = "";
    usertype: string = "";
    token: string = "";
    password: string = "";
    responseMessage = signal("");                                 // Signals are functions in Angular 21, so we need to call it to get the value

    constructor(private http: HttpClient, private router: Router) {}

    getPlaceholder(): String{
        switch (this.usertype) {
            case "Admin":
                return "Admin ID";
            case "Company Admin":
                return "Company's Admin ID";
            case "Employee":
                return "Employee ID / Employee Email";
            default:
                return "Username / Email"
        }
    }

    login() {
        const userDetails = {
            username: this.username,
            usertype: this.usertype,
            password: this.password
        }

        this.http.post<LoginResponse>("http://localhost:8000/login", userDetails).subscribe({        // { withCredentials: true }
            next: (response) => {
                this.responseMessage.set(response.message);
                if (this.responseMessage()!=="Success") {
                    alert(this.responseMessage());
                }
                else {
                    // Storing token
                    localStorage.setItem("username", response.username);
                    localStorage.setItem("usertype", response.usertype);
                    localStorage.setItem("token", response.token);
                    if (response.usertype==="Company Admin") {
                        this.router.navigate(["/admin-dashboard"]);
                    }
                }
            },
            error: (error)=> {
                alert("Login Failed ! Please try again some time.");
            }
        });
    }
}
