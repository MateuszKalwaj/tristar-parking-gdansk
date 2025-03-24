import { Component } from '@angular/core';
import {ParkingDataService} from './services/parking-data/parking-data.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tristar-parking-gdansk';

  constructor(private parkingDataService: ParkingDataService) {}

  downloadFile() {
    this.parkingDataService.downloadParkingData();
  }
}
