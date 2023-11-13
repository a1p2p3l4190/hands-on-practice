import { Component, EventEmitter, Input, Output } from '@angular/core';
import { userInfo } from '../interfaces/userInfo';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  @Input() userList: userInfo[] = [];
  @Output() isModifying = new EventEmitter<number>();
  selectedIndex!: number;

  modify(user: any, index: number) {
    console.log("i want to modify data");
    this.selectedIndex = index;
    console.log( this.selectedIndex);
    this.isModifying.emit(this.selectedIndex);
  }
}
