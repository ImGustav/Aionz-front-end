import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Observable, tap } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { Title, Meta } from '@angular/platform-browser'; 
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  public product$!: Observable<Product>;
  public readonly apiBaseUrl: string; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private titleService: Title, 
    private metaService: Meta    
  ) {
    this.apiBaseUrl = this.productService.getApiBaseUrl();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.product$ = this.productService.getProductById(id).pipe(
      // 3. (Extra SEO) Usa o 'tap' para atualizar as meta tags
      tap(product => {
        if (product) {
          const imageUrl = `${this.apiBaseUrl}${product.image}`;

          // Define o Título da Página
          this.titleService.setTitle(`${product.name} - Loja AIONZ`);
          
          // Define as Meta Tags (descrição, OpenGraph para redes sociais)
          this.metaService.updateTag({ name: 'description', content: product.description });
          this.metaService.updateTag({ property: 'og:title', content: product.name });
          this.metaService.updateTag({ property: 'og:description', content: product.description });
          this.metaService.updateTag({ property: 'og:image', content: imageUrl });
        }
      })
    );
  }
}