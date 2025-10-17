import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  /**
   * @param router - Angular Router service for navigation
   */
  constructor(private router: Router) {}

  /**
   * @param keyword - Search keyword from input field
   * @returns {void}
   */
  basicSearch(keyword: string) {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      this.router.navigate(['/search'], { queryParams: { q: trimmedKeyword } });
    }
  }
}