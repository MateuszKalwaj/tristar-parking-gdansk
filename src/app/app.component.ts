import { Component } from '@angular/core';
import {ParkingDataService} from './services/parking-data/parking-data.service';
import {ParkingListComponent} from './components/parking-list/parking-list.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    ParkingListComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tristar-parking-gdansk';

  parkingData: any[] = [];

  constructor(private parkingDataService: ParkingDataService) {}
}
