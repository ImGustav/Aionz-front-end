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
    
    const apiPage = pageIndex + 1;

    let params = new HttpParams()
      .set('page', apiPage.toString())
      .set('limit', pageSize.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedProducts>(`${this.apiBaseUrl}/produtos`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/produtos/${id}`);
  }

  postProduct(formData: FormData): Observable<Product> {
    return this.http.post<any>(`${this.apiBaseUrl}/produtos`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.patch<any>(`${this.apiBaseUrl}/produtos/${id}`, formData);
  }

  deleteProductById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/produtos/${id}`);
  }
}