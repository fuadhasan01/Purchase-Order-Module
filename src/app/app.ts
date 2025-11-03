import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/purchaseOrders').subscribe((data) => {
      console.log(data);
    });
  }
}
