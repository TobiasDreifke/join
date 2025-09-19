import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  notVisible = true;

  toggleUserMenu(){
    if(this.notVisible == true){
      this.notVisible = false;
    }else{
      this.notVisible = true;
    }
  }
}
