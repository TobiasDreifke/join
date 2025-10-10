import { NgClass } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  @Input() loggedIn!: boolean;
  notVisible = true;

  toggleUserMenu(event: Event){
    this.notVisible = !this.notVisible;
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocClick(){
    this.notVisible = true;
  }

}
