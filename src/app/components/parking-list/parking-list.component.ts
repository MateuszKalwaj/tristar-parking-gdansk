import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../../services/parking-data/parking-data.service';
import mapboxgl from 'mapbox-gl';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.css']
})
export class ParkingListComponent implements OnInit {
  parkingData: any[] = [];
  availableParking: any[] = [];
  unavailableParking: any[] = [];
  selectedMapParking: any = null;
  isMapModalOpen = false;


  constructor(private parkingDataService: ParkingDataService) {
  }

  ngOnInit(): void {
    this.parkingDataService.getParkingList().subscribe(parkingData => {
      this.parkingDataService.getParkingAvailability().subscribe(availabilityData => {
        const combinedData = this.parkingDataService.combineParkingData(parkingData, availabilityData);
        this.parkingData = combinedData;
        this.splitParkingData(combinedData);
      });
    });
  }

  private splitParkingData(parkingData: any[]): void {
    this.availableParking = parkingData.filter(p => p.availableSpots > 0)
      .sort((a, b) => b.availableSpots - a.availableSpots);
    this.unavailableParking = parkingData.filter(p => p.availableSpots === 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  openMapModal(parking: any) {
    this.selectedMapParking = parking;
    this.isMapModalOpen = true;

    setTimeout(() => {
      mapboxgl.accessToken = environment.apiKey;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [parking.location.longitude, parking.location.latitude],
        zoom: 14,
        attributionControl: false
      });
      new mapboxgl.Marker()
        .setLngLat([parking.location.longitude, parking.location.latitude])
        .addTo(map);
    }, 100);
  }

  closeModal() {
    this.isMapModalOpen = false;
  }
}
