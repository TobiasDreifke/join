import { NgClass } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

/**
 * Header component responsible for displaying the app header and user menu.
 * 
 * Features:
 * - Shows user initials
 * - Toggles user menu
 * - Handles logout
 */
@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  /** Input property to determine if the user is logged in */
  @Input() loggedIn!: boolean | null;

  /** Tracks visibility state of the user menu */
  notVisible = true;

  /** AuthService instance for handling authentication */
  authService = inject(AuthService);

  /**
   * Toggles the user menu visibility.
   * Stops the click event from propagating to document listeners.
   * @param event Mouse click event
   */
  toggleUserMenu(event: Event) {
    this.notVisible = !this.notVisible;
    event.stopPropagation();
  }

  /**
   * Host listener that closes the user menu when clicking outside.
   */
  @HostListener('document:click')
  onDocClick() {
    this.notVisible = true;
  }

  /**
   * Logs out the current user via AuthService.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Returns the initials of a given display name.
   * @param displayName Full name of the user
   * @returns String of initials (e.g., "John Doe" -> "JD")
   */
  getUserInitials(displayName: string) {
    return displayName
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
