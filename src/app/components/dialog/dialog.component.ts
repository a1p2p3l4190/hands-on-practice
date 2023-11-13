import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, NgIf, MatFormFieldModule, FormsModule, MatButtonModule, CommonModule],
})

export class DialogComponent {
  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router) {
  }
  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {
      this.dialogRef.close();
    });

  }
}

