import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {
  clienteForm: FormGroup;
  private http = inject(HttpClient);
  isSubmitting = false;
  successMessage = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    const backendUrl = 'http://localhost:3000/api/clientes';
    this.http.post(backendUrl, this.clienteForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Hubo un error al conectar con el servidor MySQL local: ' + (err.error?.error || err.message));
      }
    });
  }

  onReset() {
    this.clienteForm.reset();
    this.successMessage = false;
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
