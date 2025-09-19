import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HotToastService } from '@ngxpert/hot-toast';
import { login } from '../../../../core/store/auth/auth.actions';
import { selectAuthLoading } from '../../../../core/store/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  loginForm: FormGroup;

  store = inject(Store);

  $loading = this.store.select(selectAuthLoading);

  constructor(
    private readonly fb: FormBuilder,
    private readonly toast: HotToastService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.toast.loading('Logging in', { id: 'logging-in' });
      this.store.dispatch(login({ credentials: this.loginForm.value }));
    }
  }
}
