import { Component } from '@angular/core';
import {ParkingDataService} from './services/parking-data/parking-data.service';
import {ParkingListComponent} from './components/parking-list/parking-list.component';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    ParkingListComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tristar-parking-gdansk';

  parkingData: any[] = [];

  constructor(private parkingDataService: ParkingDataService) {}
}
