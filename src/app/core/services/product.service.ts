import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { PaginatedProducts } from '../models/paginated-products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  getProducts(
    pageIndex: number, 
    pageSize: number, 
    searchTerm: string = ''
  ): Observable<PaginatedProducts> {
    
    // MatPaginator é 0-based, a maioria das APIs é 1-based.
    const apiPage = pageIndex + 1;

    // Constrói os query params
    let params = new HttpParams()
      .set('page', apiPage.toString())
      .set('limit', pageSize.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    // A chamada agora espera o novo formato PaginatedProducts
    return this.http.get<PaginatedProducts>(`${this.apiBaseUrl}/produtos`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/produtos/${id}`);
  }

  postProduct(formData: FormData): Observable<Product> {
    return this.http.post<any>(`${this.apiBaseUrl}/produtos`, formData);
  }

  deleteProductById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/produtos/${id}`);
  }
}