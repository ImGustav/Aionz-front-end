import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RegisterProductModalComponent } from '../../../shared/components/register-product-modal/register-product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  public isLoading = true;
  public products: Product[] = [];
  public paginatedProducts: Product[] = [];

  public totalProducts: number = 0;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public pageSizeOptions = [5, 10, 25];

  public searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0;
      this.fetchProducts();
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;

    this.productService
      .getProducts(this.pageIndex, this.pageSize, this.searchTerm)
      .subscribe((response) => {
        this.paginatedProducts = response.data;
        this.totalProducts = response.total;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  /**
   * Chamado pelo (input) da barra de pesquisa.
   */
  onSearchInput(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim());
  }

  /**
   * Chamado quando o usuário clica nos botões do paginador.
   */
  handlePageEvent(event: PageEvent): void {
    // Atualiza o estado do componente
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.fetchProducts();
  }

  /**
   * Abre o modal de cadastro.
   */
  openRegisterModal(): void {
    const dialogRef = this.dialog.open(RegisterProductModalComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formData = new FormData();

        formData.append('category_id', result.category_id.toString());
        formData.append('name', result.name);
        formData.append('description', result.description);
        formData.append('price', result.price.toString());

        if (result.imageFile) {
          formData.append('image', result.imageFile, result.imageFile.name);
        }

        this.productService.postProduct(formData).subscribe(
          (newProduct) => {
            console.log('Produto salvo com sucesso!', newProduct);

            this.fetchProducts();
            this.notificationService.showSuccess('Produto criado com sucesso.');
          },
          (error) => {
            console.error('Erro ao salvar produto:', error);
            this.notificationService.showError('Erro ao criar um produto.');
          },
        );
      }
    });
  }

  handleProductUpdated(): void {
    this.fetchProducts();
  }

  handleProductDeleted(deletedProductId: number): void {
    if (this.paginatedProducts.length === 1 && this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
    }
    this.fetchProducts();
  }
}
