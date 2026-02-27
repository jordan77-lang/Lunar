// ============================================================
// search.js — Google Places Autocomplete search box
//
// Exposes initEarthSearch(callbacks) which wires the #earth-search
// input to the Google Places Autocomplete API. When the user picks
// a suggestion the provided onPlaceSelected callback receives:
//   { lat, lng, name }
//
// The Google Maps JS API (with the "places" library) must be loaded
// before this module runs. We gate on window.google being available.
// ============================================================

import { state } from '../state.js';

let autocomplete = null;

/**
 * Wire up Places Autocomplete on the #earth-search input.
 *
 * @param {object}   callbacks
 * @param {function} callbacks.onPlaceSelected  — ({ lat, lng, name }) => void
 * @param {function} callbacks.onClear          — () => void (search cleared)
 */
export function initEarthSearch({ onPlaceSelected, onClear }) {
    const input = document.getElementById('earth-search');
    if (!input) return;

    // Retry until the Google Maps script has finished loading
    if (!window.google?.maps?.places) {
        setTimeout(() => initEarthSearch({ onPlaceSelected, onClear }), 300);
        return;
    }

    autocomplete = new window.google.maps.places.Autocomplete(input, {
        // Bias results toward cities / named locations
        types: ['geocode', 'establishment'],
        fields: ['geometry', 'name', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat  = place.geometry.location.lat();
        const lng  = place.geometry.location.lng();
        const name = place.formatted_address || place.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        state.earth.impactLocation = { lat, lng, name };
        onPlaceSelected({ lat, lng, name });
    });

    // Clear button
    const clearBtn = document.getElementById('earth-search-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            state.earth.impactLocation = { lat: null, lng: null, name: '' };
            onClear?.();
        });
    }
}

/**
 * Programmatically set the search box text (e.g. after a map click
 * that performs a reverse geocode).
 */
export function setSearchBoxValue(text) {
    const input = document.getElementById('earth-search');
    if (input) input.value = text;
}

/**
 * Reverse-geocode a lat/lng using the Google Geocoding API and
 * return a human-readable address string.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
export async function reverseGeocode(lat, lng, apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json`
                  + `?latlng=${lat},${lng}&key=${apiKey}`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0].formatted_address;
        }
    } catch (err) {
        console.warn('search: reverse geocode failed', err);
    }
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}
