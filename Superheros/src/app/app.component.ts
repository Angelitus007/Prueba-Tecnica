import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/components/footer/footer.component";
import { AlertComponent } from "./components/components/alert/alert.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Superheros';
}
