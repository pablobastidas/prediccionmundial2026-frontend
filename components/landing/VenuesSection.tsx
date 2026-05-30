"use client";
import { MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface Venue {
  id: number;
  name: string;
  city: string;
  country_emoji: string;
  capacity: number;
  image_url: string;
}

export default function VenuesSection() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tournaments/current/venues')
      .then(res => {
        if (Array.isArray(res.data)) setVenues(res.data);
        else setVenues([]);
      })
      .catch(err => console.error("Error fetching venues:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && venues.length === 0) return null;

  return (
    <section id="venues" className="py-24 bg-wc-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-wc-sky text-xs font-black tracking-[0.3em] uppercase mb-3">Infraestructura de Élite</p>
          <h2 className="font-display font-800 text-wc-white text-4xl sm:text-6xl leading-tight">
            Sedes <span className="text-transparent bg-clip-text bg-gold-gradient">Legendarias</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="group rounded-[2rem] overflow-hidden border border-wc-border hover:border-wc-sky/40 transition-all duration-500 hover:shadow-card-hover bg-wc-card/30"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={venue.image_url}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wc-dark via-wc-dark/20 to-transparent" />
                <div className="absolute top-4 right-4 text-3xl drop-shadow-lg">{venue.country_emoji}</div>
              </div>
              <div className="bg-card-gradient px-6 py-5">
                <div className="font-display font-700 text-wc-white text-xl mb-2 tracking-wide">{venue.name}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-wc-white/60 text-sm">
                    <MapPin size={14} className="text-wc-sky" />
                    <span>{venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-wc-white/60 text-sm">
                    <Users size={14} className="text-wc-gold" />
                    <span className="font-mono">{venue.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
