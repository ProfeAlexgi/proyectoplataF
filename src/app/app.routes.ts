import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cliente', component: ClienteFormComponent },
  { path: '**', redirectTo: 'login' }
];
