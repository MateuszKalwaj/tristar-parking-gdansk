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
      const parkingCoordinates: [number, number] = [
        Number(parking.location.longitude),
        Number(parking.location.latitude)
      ];

      const originalFetch = window.fetch;
      window.fetch = function(url: RequestInfo | URL, options?: RequestInit) {
        const urlString = url instanceof Request ? url.url : url.toString();
        if (urlString.includes('events.mapbox.com')) {
          return Promise.resolve(new Response());
        }
        return originalFetch(url, options);
      };

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 15,
        doubleClickZoom: false,
        center: parkingCoordinates,
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.scrollZoom.disable();

      new mapboxgl.Marker()
        .setLngLat(parkingCoordinates)
        .addTo(map);
      const mapContainer = document.getElementById('map');

      if (mapContainer) {
        mapContainer.addEventListener('wheel', (event) => {
          event.preventDefault();
          const zoomDirection = event.deltaY < 0 ? 1 : -1;
          const zoomDelta = 0.2 * zoomDirection;
          const currentZoom = map.getZoom();
          const newZoom = currentZoom + zoomDelta * 5;
          map.easeTo({
            center: parkingCoordinates,
            zoom: newZoom,
            duration: 250
          });
        });

        mapContainer.addEventListener('dblclick', (event) => {
          event.preventDefault();
          const currentZoom = map.getZoom();
          const newZoom = currentZoom + 1;
          map.easeTo({
            center: parkingCoordinates,
            zoom: newZoom,
            duration: 250
          });
        });
      }
    }, 100);
  }

  closeModal() {
    this.isMapModalOpen = false;
  }
}
