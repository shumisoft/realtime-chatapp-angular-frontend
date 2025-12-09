import { Component } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [UserComponent],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui {}
