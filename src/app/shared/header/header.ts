import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  notVisible = false;

  toggleUserMenu(){
    if(this.notVisible == true){
      this.notVisible = false;
    }else{
      this.notVisible = true;
    }
  }
}
