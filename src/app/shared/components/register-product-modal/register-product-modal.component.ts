import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { getCurrencyValues } from '../../utils/formatters';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-register-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule
  ],
  templateUrl: './register-product-modal.component.html',
  styleUrls: ['./register-product-modal.component.scss']
})
export class RegisterProductModalComponent {
  
  productForm: FormGroup
  fileName = ""
  selectedFile: File | null = null

  public categories$!: Observable<Category[]> 
  
  constructor(
    private fb: FormBuilder, // Injetamos o FormBuilder
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<RegisterProductModalComponent>, // Referência ao próprio modal
    @Inject(MAT_DIALOG_DATA) public data: any // Para receber dados (não usado agora)
  ) {   
      this.productForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      price: ["", [Validators.required, Validators.min(0)]],
      category_id: ["", Validators.required],
    })
    this.data = this.dialogRef["_containerInstance"]._config.data
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      this.fileName = this.selectedFile.name
    }
  }

  removeFile(): void {
    this.selectedFile = null
    this.fileName = ""
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSave(): void {
    if (this.productForm.valid) {
      const formData = {
        ...this.productForm.value,
        imageFile: this.selectedFile,
      }
      this.dialogRef.close(formData)
    }
  }

  formatCurrency(event: any): void {
    const input = event.target;
    const { numericValue, formattedValue } = getCurrencyValues(input.value);
    
    this.productForm.get('price')?.setValue(numericValue, { emitEvent: false });
    
    // b) Atualiza o input (a "visão") com a string formatada
    input.value = formattedValue;
  }
}

