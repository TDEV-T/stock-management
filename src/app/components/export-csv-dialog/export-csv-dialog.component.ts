import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-export-csv-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './export-csv-dialog.component.html'
})
export class ExportCsvDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ExportCsvDialogComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  exportForm: FormGroup;

  constructor() {
    this.exportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onExport(): void {
    if (this.exportForm.valid) {
      this.dialogRef.close(this.exportForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 