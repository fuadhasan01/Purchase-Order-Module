import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isActive(route: string): boolean {
    return window.location.pathname === route;
  }
}
