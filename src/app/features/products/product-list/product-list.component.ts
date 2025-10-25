import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
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
    MatPaginatorModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  public isLoading = true
  public products: Product[] = []
  public paginatedProducts: Product[] = []

  // Configuração do Paginator (agora controlado pela API)
  public totalProducts = 0; // Total de produtos (vem da API)
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [5, 10, 25];

  // Lógica de Pesquisa
  public searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    // espera 400ms após o usuário parar de digitar
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0; // Reseta para a primeira página
      this.fetchProducts(); // Chama a API com a nova busca
    })
  }

  ngOnInit(): void {
    this.fetchProducts()
  }

  fetchProducts(): void {
    this.isLoading = true

    this.productService.getProducts(
      this.pageIndex,
      this.pageSize,
      this.searchTerm
    ).subscribe(response => {
      // Atualiza o componente com os dados da API
      this.paginatedProducts = response.data;
      this.totalProducts = response.total
      this.isLoading = false
      this.cdr.detectChanges()
    })
  }

  /**
   * Chamado pelo (input) da barra de pesquisa.
   * Apenas envia o valor para o 'Subject' (o debouncer cuida do resto).
   */
  onSearchInput(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.searchSubject.next(filterValue.trim());
  }

  /**
   * Chamado quando o usuário clica nos botões do paginador.
   */
  handlePageEvent(event: PageEvent): void {
    // Atualiza o estado do componente
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    
    // Chama a API para buscar a nova página
    this.fetchProducts();
  }
  
  /**
   * Abre o modal de cadastro.
   */
  openRegisterModal(): void {
    const dialogRef = this.dialog.open(RegisterProductModalComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        // 1. Criar o FormData
        const formData = new FormData();

        // 2. Adicionar os campos (EXATAMENTE como no seu Postman)
        //    (Assumindo que 'result' contém os valores do form)
        formData.append('category_id', result.category_id.toString());
        formData.append('name', result.name);
        formData.append('description', result.description);
        formData.append('price', result.price.toString());
        
        // 3. Adicionar o arquivo (chave 'image', como no seu Postman)
        //    (Assumindo que o modal passou o arquivo na prop 'imageFile')
        if (result.imageFile) {
          formData.append('image', result.imageFile, result.imageFile.name);
        }

        // 4. Chamar o service para salvar
        this.productService.postProduct(formData).subscribe(
          (newProduct) => {
            console.log('Produto salvo com sucesso!', newProduct);
            
            // 5. Atualizar a lista de produtos na tela
            this.fetchProducts(); 
            this.notificationService.showSuccess('Produto criado com sucesso.')
          },
          (error) => {
            console.error('Erro ao salvar produto:', error);
            this.notificationService.showError('Erro ao criar um produto.')
          }
        );
      }
    });
  }

  handleProductDeleted(deletedProductId: number): void {
    if (this.paginatedProducts.length === 1 && this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1; 
    }
    this.fetchProducts();
  }
}