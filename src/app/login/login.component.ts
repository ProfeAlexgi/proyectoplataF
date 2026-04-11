import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private http = inject(HttpClient);

  isLoading = false;
  loginError = '';
  loginSuccess = false;
  userName = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      usurio: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = '';
    this.loginSuccess = false;

    const { usurio, clave } = this.loginForm.value;
    const url = 'https://8d99e357-a84d-4131-8cba-14a770398524.mock.pstmn.io/Agencia/Clientes';

    this.http.get<any[]>(url).subscribe({
      next: (clients) => {
        this.isLoading = false;
        const validUser = clients.find(u => u.usurio === usurio && u.clave === clave);

        if (validUser) {
          this.loginSuccess = true;
          this.userName = `${validUser.name} ${validUser.apellido}`;
        } else {
          this.loginError = 'Usuario o clave incorrectos.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = 'Error de conexión con el servidor. Intente de nuevo más tarde.';
      }
    });
  }

  continueToApp() {
    this.router.navigate(['/cliente']);
  }
}
