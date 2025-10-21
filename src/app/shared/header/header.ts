import { NgClass } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  @Input() loggedIn!: boolean | null;
  notVisible = true;
  authService = inject(AuthService);

  toggleUserMenu(event: Event){
    this.notVisible = !this.notVisible;
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocClick(){
    this.notVisible = true;
  }

  logout(){
    this.authService.logout();
  }

  getUserInitials(displayName: string){
    return displayName
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
