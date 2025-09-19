import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HotToastService } from '@ngxpert/hot-toast';
import { register } from '../../../../core/store/auth/auth.actions';
import { selectAuthLoading } from '../../../../core/store/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
})
export class RegisterPage {
  registerForm: FormGroup;

  store = inject(Store);

  $loading = this.store.select(selectAuthLoading);

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: (form: AbstractControl) => {
          const password = form.get('password')?.value;
          const confirmPassword = form.get('confirmPassword')?.value;
          return password === confirmPassword ? null : { passwordMismatch: true };
        },
      },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.toast.loading('Registering new user', { id: 'registering' });
      this.store.dispatch(register({ payload: this.registerForm.value }));
    }
  }
}
