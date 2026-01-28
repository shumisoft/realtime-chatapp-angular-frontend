import { EditUserRequest } from './../../../../core/models/user.models';
import { Component, inject, Input, OnInit } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { map, Observable } from 'rxjs';
import { UserDTOResponse, UserState } from '../../../../core/models/user.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updatePrincipalUser } from '../../../../core/store/user/user.actions';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  @Input() loading!: Observable<boolean>;
  @Input() userData!: Observable<UserDTOResponse | null>;
  @Input() isPrincipalUser!: boolean;

  form: any = {};
  editField: Record<string, boolean> = {};

  constructor() {}

  ngOnInit() {
    this.userData.pipe(
      map((data) => {
        if (!data) {
          this.toast.error('Something Went Wrong!');
          this.router.navigateByUrl('/');
        }
      }),
    );
  }

  startEdit(field: string, currentValue: string | null) {
    this.editField[field] = true;
    this.form[field] = currentValue;
  }

  saveEdit(field: string, originalValue: string | null) {
    if (this.form[field] !== originalValue) {
      this.store.dispatch(
        updatePrincipalUser({ payload: { [field]: this.form[field] } as EditUserRequest }),
      );

      console.log(`Updated ${field} to`, this.form[field]);
    }
    this.editField[field] = false;
  }
}
