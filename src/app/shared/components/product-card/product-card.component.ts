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

  public imageUrl = '';
  private readonly apiBaseUrl: string; // <-- 1. Apenas declare o tipo

  constructor(
    private productService: ProductService,
    public dialog: MatDialog, // 6. Injete o serviço de Diálogo
    private notificationService: NotificationService
  ) {
    // 2. Inicialize a variável DENTRO do construtor
    this.apiBaseUrl = this.productService.getApiBaseUrl();
  }

  ngOnInit(): void {
    this.imageUrl = `${this.apiBaseUrl}${this.product.image}`;
  }

  deleteProduct(productId: number): void {
    // 7. Abre o diálogo
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${this.product.name}"?`
      }
    });

    // 8. Ouve a resposta do diálogo
    dialogRef.afterClosed().subscribe(result => {
      // 9. Se o usuário clicou em "Confirmar" (result === true)
      if (result) {
        // (Assumindo que você tem um método 'deleteProduct' no seu service)
        this.productService.deleteProductById(productId).subscribe(
          () => {
            this.notificationService.showSuccess(`Produto excluído com sucesso`);
            console.log('Produto excluído com sucesso:', productId);
            // 10. Avisa o componente-pai que este produto foi excluído
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

  formatPrice(value: number) {
    const { formattedValue } = getCurrencyValues(value.toString());
    return formattedValue;
  }
}