import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { getCurrencyValues } from '../../utils/formatters';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services/notification.service';
import { RegisterProductModalComponent } from '../register-product-modal/register-product-modal.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    MatIconModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() productDeleted = new EventEmitter<number>();
  @Output() productUpdate = new EventEmitter<void>();

  public imageUrl = '';
  private readonly apiBaseUrl: string; 

  constructor(
    private productService: ProductService,
    public dialog: MatDialog, 
    private notificationService: NotificationService
  ) {
    // 2. Inicialize a variável DENTRO do construtor
    this.apiBaseUrl = this.productService.getApiBaseUrl();
  }

  ngOnInit(): void {
    this.imageUrl = `${this.apiBaseUrl}${this.product.image}`;
  }

  deleteProduct(productId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${this.product.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProductById(productId).subscribe(
          () => {
            this.notificationService.showSuccess(`Produto excluído com sucesso`);
            console.log('Produto excluído com sucesso:', productId);
            this.productDeleted.emit(productId);
          },
          (error: any) => {
            console.error('Erro ao excluir produto:', error);
            this.notificationService.showError("Erro ao excluir o produto.")
          }
        );
      }
    });
  }

  openEditModal(): void {
    const dialogRef = this.dialog.open(RegisterProductModalComponent, {
      width: '500px',
      data: this.product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formData = new FormData();
        formData.append('category_id', result.category_id.toString());
        formData.append('name', result.name);
        formData.append('description', result.description);
        formData.append('price', result.price.toString());

        if (result.imageFile) {
          formData.append('image', result.imageFile, result.imageFile.name);
        }

        this.productService.updateProduct(this.product.id, formData).subscribe(
          () => {
            this.notificationService.showSuccess('Produto atualizado com sucesso!');
            this.productUpdate.emit(); 
          },
          (error) => {
            this.notificationService.showError('Erro ao atualizar o produto.');
            console.error('Erro ao atualizar produto:', error);
          }
        );
      }
    });
  }

  formatPrice(value: number) {
    const { formattedValue } = getCurrencyValues(value.toString());
    return formattedValue;
  }
}