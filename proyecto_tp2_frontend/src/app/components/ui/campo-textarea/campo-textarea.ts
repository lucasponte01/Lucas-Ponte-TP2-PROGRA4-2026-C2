import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-campo-textarea',
  styleUrl: './campo-textarea.css',
  templateUrl: './campo-textarea.html',
})
export class CampoTextarea {
  id = input('');
  label = input('');
  control = input<FormControl>();
  
}
