import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // 'root' faz dele um singleton (um só para o app todo)
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Exibe uma mensagem de sucesso (verde).
   * @param message A mensagem a ser exibida.
   */
  showSuccess(message: string): void {
    this._snackBar.open(message, 'Fechar', {
      panelClass: ['success-snackbar'] // Classe CSS global
    });
  }

  /**
   * Exibe uma mensagem de erro (vermelha).
   * @param message A mensagem a ser exibida.
   */
  showError(message: string): void {
    this._snackBar.open(message, 'Fechar', {
      panelClass: ['error-snackbar'] // Classe CSS global
    });
  }

  /**
   * Exibe uma mensagem de informação (padrão).
   * @param message A mensagem a ser exibida.
   */
  showInfo(message: string): void {
    this._snackBar.open(message, 'Fechar', {
      // Sem 'panelClass', ele usará o estilo padrão
    });
  }
}