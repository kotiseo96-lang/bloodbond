"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BloodBank, BloodStock } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface BloodBankMapProps {
  bloodBanks: BloodBank[];
  bloodStock: BloodStock[];
  onSelectBloodBank?: (bloodBank: BloodBank) => void;
  mapboxToken?: string;
}

const BloodBankMap: React.FC<BloodBankMapProps> = ({
  bloodBanks,
  bloodStock,
  onSelectBloodBank,
  mapboxToken,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(mapboxToken || '');
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);

  const getStockForBank = (bankId: string) => {
    return bloodStock.filter((s) => s.blood_bank_id === bankId);
  };

  const getTotalUnits = (bankId: string) => {
    return getStockForBank(bankId).reduce((sum, s) => sum + s.units_available, 0);
  };

  const getMarkerColor = (bankId: string) => {
    const total = getTotalUnits(bankId);
    if (total === 0) return '#ef4444'; // red
    if (total <= 10) return '#f59e0b'; // yellow
    if (total <= 30) return '#22c55e'; // green
    return '#3b82f6'; // blue
  };

  useEffect(() => {
    if (!mapContainer.current || !token || isMapReady) return;

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 4,
        center: [78.9629, 20.5937], // India center
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapReady(true);

        bloodBanks.forEach((bank) => {
          if (bank.latitude && bank.longitude) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundColor = getMarkerColor(bank.id);
            el.style.width = '24px';
            el.style.height = '24px';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            el.style.cursor = 'pointer';

            const marker = new mapboxgl.Marker(el)
              .setLngLat([bank.longitude, bank.latitude])
              .addTo(map.current!);

            el.addEventListener('click', () => {
              setSelectedBank(bank);
              if (onSelectBloodBank) {
                onSelectBloodBank(bank);
              }
            });
          }
        });
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [token, bloodBanks, bloodStock]);

  if (!token) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <h3 className="font-heading text-lg font-semibold">Map Integration</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Enter your Mapbox public token to enable the interactive map. 
            Get your token from{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setIsMapReady(false)}>
              Load Map
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />

      {selectedBank && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 p-4 bg-card/95 backdrop-blur-sm">
          <h3 className="font-heading font-semibold text-foreground mb-2">
            {selectedBank.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedBank.address}, {selectedBank.city}
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            {selectedBank.phone}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {getStockForBank(selectedBank.id).map((stock) => (
              <span
                key={stock.id}
                className="px-2 py-1 bg-muted rounded text-xs font-medium"
              >
                {stock.blood_group}: {stock.units_available}
              </span>
            ))}
          </div>
          {onSelectBloodBank && (
            <Button
              size="sm"
              className="w-full"
              onClick={() => onSelectBloodBank(selectedBank)}
            >
              Select Blood Bank
            </Button>
          )}
        </Card>
      )}

      {/* Legend */}
      <Card className="absolute top-4 right-4 p-3 bg-card/95 backdrop-blur-sm">
        <p className="text-xs font-medium text-foreground mb-2">Stock Levels</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <span className="text-xs text-muted-foreground">Critical (0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
            <span className="text-xs text-muted-foreground">Low (1-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
            <span className="text-xs text-muted-foreground">Adequate (11-30)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
            <span className="text-xs text-muted-foreground">Abundant (30+)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BloodBankMap;
