import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { userInfo } from '../interfaces/userInfo';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  constructor(public fb: FormBuilder, public dialog: MatDialog) { }
  isAdding = false;
  isModifying = false;
  selectedFile!: any;
  userList: userInfo[] = [];
  modifyUserInfo: userInfo[] = [];
  modifyIndex!: number;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/[\S]/)]],
    age: [0, Validators.required],
    photo: ['']
  })

  startAdding() {
    console.log("i'm going to add info");
    this.clearInput();
    this.isAdding = !this.isAdding;
    //若在修改中按下關閉後，就不再對其作修改
    if (this.isAdding === false) {
      this.isModifying = false;
    }
  }

  onPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      // 讀取檔案為 Data URL
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFile = reader.result;
      };
      console.log(this.selectedFile);
    }
  }

  add() {
    console.log(this.form);
    if (this.form.valid) {
      console.log("input is valid");

      const userInfo: userInfo = {
        username: this.form.controls.username.value!,
        age: this.form.controls.age.value!,
        photo: this.selectedFile || null,
      }
      try {
        //將送出的userInfo存進userList
        this.userList.push(userInfo);
        console.log(this.userList);
      } catch (error) {
        //新增失敗dialog
        this.dialog.open(DialogComponent, {
          data: { dialogMode: 'createFailedDialog' }
        });
      }
      //新增成功dialog
      this.dialog.open(DialogComponent, {
        data: { dialogMode: 'createSuccessDialog' }
      });
      this.clearInput();

    } else {
      console.log("input is invalid");
      this.dialog.open(DialogComponent, {
        //輸入不合規定dialog
        data: { dialogMode: 'invalidInputDialog' }
      });
    }
  }

  modifying(index: number) {
    console.log(index + "是欲修改index");
    this.isModifying = true;
    // 將表單設定為欲修改的使用者資訊
    this.form.setValue({
      username: this.userList[index].username,
      age: this.userList[index].age,
      photo: ''
    });
    this.selectedFile = this.userList[index].photo;
    console.log(this.selectedFile);
    this.modifyIndex = index;
    //this.isAdding = false;
  }

  //刪除資料
  delete() {
    console.log("delete");
    try {
      this.userList.splice(this.modifyIndex, 1);
    } catch (error) {
      //刪除失敗dialog
      this.dialog.open(DialogComponent, {
        data: { dialogMode: 'deleteFailedDialog' }
      });
    }
    //刪除成功dialog
    this.dialog.open(DialogComponent, {
      data: { dialogMode: 'deleteSuccessDialog' }
    });
    this.clearInput();
  }

  //更新資料
  modify() {
    console.log("modify");
    const userInfo: userInfo = {
      username: this.form.controls.username.value!,
      age: this.form.controls.age.value!,
      photo: this.selectedFile || null,
    }
    try {
      this.userList[this.modifyIndex] = userInfo;
    } catch (error) {
      //更新失敗dialog
      this.dialog.open(DialogComponent, {
        data: { dialogMode: 'updateFailedDialog' }
      });
    }
    //更新成功dialog
    this.dialog.open(DialogComponent, {
      data: { dialogMode: 'updateSuccessDialog' }
    });
    this.clearInput();
  }

  //匯出csv
  export() {
    try {
      // 將userList轉換成CSV字串
      const csvContent = this.convertToCSV(this.userList);
      // 創建包含 CSV 數據的 Blob
      // 使用 Blob 為了將文本數據轉換為二進位數據，以便進行檔案下載等操作
      const blob = new Blob([csvContent], { type: 'text/csv' });
      // 創建超連結以觸發下載
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'userList.csv';
      link.click();
    } catch (error) {
      // 匯出成功 dialog
      this.dialog.open(DialogComponent, {
        data: { dialogMode: 'exportFailedDialog' }
      });
    }
    // 匯出失敗 dialog
    this.dialog.open(DialogComponent, {
      data: { dialogMode: 'exportSuccessDialog' }
    });
    this.clearInput();
  }


  // 將陣列物件轉換為 CSV 字串的函數
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(user => Object.values(user).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  //清空輸入框
  clearInput() {
    this.selectedFile = undefined;
    this.isModifying = false;
    this.form.setValue({
      username: '',
      age: null,
      photo: null
    });
  }
}
