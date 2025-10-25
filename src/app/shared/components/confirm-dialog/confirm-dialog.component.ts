import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { 
  MatDialogModule, 
  MatDialogRef, 
  MAT_DIALOG_DATA 
} from '@angular/material/dialog';

// Interface para os dados que o diálogo receberá
export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  // Injetamos MAT_DIALOG_DATA para receber os dados (título, mensagem)
  // Injetamos MatDialogRef para poder fechar o diálogo
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    // Fecha o diálogo e não retorna nada (ou false)
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    // Fecha o diálogo e retorna true
    this.dialogRef.close(true);
  }
}