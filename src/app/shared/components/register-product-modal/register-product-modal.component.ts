import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { Product } from '../../../core/models/product.model';

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
    MatOptionModule,
  ],
  templateUrl: './register-product-modal.component.html',
  styleUrls: ['./register-product-modal.component.scss'],
})
export class RegisterProductModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  productForm: FormGroup;
  fileName = '';
  selectedFile: File | null = null;

  public isEditMode = false;
  public title = 'Cadastrar Novo Produto';
  public subtitle = 'Preencha os dados do produto';
  public categories$!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<RegisterProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
  ) {
    this.isEditMode = !!this.data;

    if (this.isEditMode) {
      this.title = 'Editar Produto';
      this.subtitle = 'Atualize os dados do produto';
    } else {
      this.title = 'Cadastrar Novo Produto';
      this.subtitle = 'Preencha os dados do produto';
    }

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      imageFile: [null as File | null, this.isEditMode ? null : Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.productForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        price: this.data.price,
        category_id: this.data.category.id,
      });

      this.fileName = this.data.image.split('/').pop() || 'Imagem existente';
    }

    this.categories$ = this.categoryService.getCategories();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.fileName = file.name;
      this.productForm.patchValue({ imageFile: file });
      this.productForm.get('imageFile')?.markAsTouched();
    }
  }

  removeFile(): void {
    this.fileName = this.isEditMode ? this.data?.image.split('/').pop() || 'Imagem existente' : '';
    this.productForm.patchValue({ imageFile: null });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  formatCurrency(event: any): void {
    const input = event.target;
    const { numericValue, formattedValue } = getCurrencyValues(input.value);

    this.productForm.get('price')?.setValue(numericValue, { emitEvent: false });

    input.value = formattedValue;
  }
}
