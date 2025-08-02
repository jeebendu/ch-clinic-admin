package com.jee.clinichub.app.core.location;

import org.cloudinary.json.JSONArray;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.PlaceAutocompleteRequest;
import com.google.maps.PlaceAutocompleteRequest.SessionToken;
import com.google.maps.PlacesApi;
import com.google.maps.model.AutocompletePrediction;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.PlaceAutocompleteType;
import com.google.maps.model.PlaceDetails;
import com.google.maps.model.PlacesSearchResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/v1/public/place")
public class MapsController {

    private GeoApiContext geoApiContext;

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    @GetMapping("/autocomplete")
    public ResponseEntity<String> searchLocation(
            @RequestParam String locality,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String latlng) {
        if (city == null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (geoApiContext == null) {
            geoApiContext = new GeoApiContext.Builder()
                    .apiKey(googleMapsApiKey)
                    .build();
        }

        String input = city + " " + locality;
        JSONArray predictions = new JSONArray();

        try {
            SessionToken sessionToken = new SessionToken();
            PlaceAutocompleteRequest request = PlacesApi.placeAutocomplete(geoApiContext, input, sessionToken)
                    .types(PlaceAutocompleteType.GEOCODE);
            AutocompletePrediction[] autocompletePredictions = request.await();

            for (AutocompletePrediction prediction : autocompletePredictions) {
                JSONObject structuredFormatting = new JSONObject();
                structuredFormatting.put("mainText", prediction.structuredFormatting.mainText);
                structuredFormatting.put("secondaryText", prediction.structuredFormatting.secondaryText);

                JSONObject formattedPrediction = new JSONObject();
                formattedPrediction.put("placeId", prediction.placeId);
                formattedPrediction.put("description", prediction.description);
                formattedPrediction.put("structuredFormatting", structuredFormatting);
                formattedPrediction.put("city", city.toLowerCase());
                formattedPrediction.put("category", prediction.types[0].toString());

                predictions.put(formattedPrediction);
            }

            return ResponseEntity.ok(predictions.toString(2));

        } catch (Exception e) {
            log.error("Error during geocode request", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/detail/{placeId}")
    public ResponseEntity<String> getPlaceDetails(@PathVariable String placeId) {
        if (geoApiContext == null) {
            geoApiContext = new GeoApiContext.Builder()
                    .apiKey(googleMapsApiKey)
                    .build();
        }

        try {
            PlaceDetails placeDetails = PlacesApi.placeDetails(geoApiContext, placeId).await();

            JSONObject placeDetailsJson = new JSONObject();
            placeDetailsJson.put("placeId", placeDetails.placeId);
            placeDetailsJson.put("name", placeDetails.name);
            placeDetailsJson.put("address", placeDetails.formattedAddress);
            placeDetailsJson.put("latitude", placeDetails.geometry.location.lat);
            placeDetailsJson.put("longitude", placeDetails.geometry.location.lng);

            return ResponseEntity.ok(placeDetailsJson.toString(2));

        } catch (Exception e) {
            log.error("Error during place details request", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/autocomplete2")
    public ResponseEntity<PlacesSearchResponse> getPlaceAutocomplete2(
            @RequestParam String locality,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String latlng) {
        try {
            // If latlng is null, get latlng by city name
            if (latlng == null && city != null) {
                GeocodingResult[] geocodeResults = GeocodingApi.geocode(geoApiContext, city).await();
                if (geocodeResults.length > 0) {
                    latlng = geocodeResults[0].geometry.location.lat + "," + geocodeResults[0].geometry.location.lng;
                } else {
                    return ResponseEntity.status(404).body(null);
                }
            }

            if (latlng == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Split latlng into latitude and longitude
            String[] latLngParts = latlng.split(",");
            double lat = Double.parseDouble(latLngParts[0]);
            double lng = Double.parseDouble(latLngParts[1]);

            // Search for places using the latitude and longitude
            PlacesSearchResponse response = PlacesApi
                    .nearbySearchQuery(geoApiContext, new com.google.maps.model.LatLng(lat, lng))
                    .keyword(city + "," + locality)
                    .radius(50000) // 50 km radius
                    .await();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during autocomplete request", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/geocode")
    public ResponseEntity<GeocodingResult> getGeocode(@RequestParam String latlng) {
        try {

            if (geoApiContext == null) {
                geoApiContext = new GeoApiContext.Builder()
                        .apiKey(googleMapsApiKey)
                        .build();
            }

            String[] latLngParts = latlng.split(",");
            double lat = Double.parseDouble(latLngParts[0]);
            double lng = Double.parseDouble(latLngParts[1]);
            GeocodingResult[] results = GeocodingApi
                    .reverseGeocode(geoApiContext, new com.google.maps.model.LatLng(lat, lng)).await();
            return ResponseEntity.ok(results[0]);
        } catch (Exception e) {
            log.error("Error during geocode request", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/geocode/city")
    public ResponseEntity<GeocodingResult> getGeocodeByCity(@RequestParam String city) {
        try {
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, city).await();
            return ResponseEntity.ok(results[0]);
        } catch (Exception e) {
            log.error("Error during geocode by city request", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<PlacesSearchResponse> getNearbyPlaces(
            @RequestParam Number latitude,
            @RequestParam Number longitude,
            @RequestParam String type) {
        try {
            if (geoApiContext == null) {
                geoApiContext = new GeoApiContext.Builder()
                        .apiKey(googleMapsApiKey)
                        .build();
            }

            PlacesSearchResponse response = PlacesApi
                    .nearbySearchQuery(geoApiContext, new com.google.maps.model.LatLng(latitude.doubleValue(), longitude.doubleValue()))
                    .keyword(type)
                    .radius(5000) // 5 km radius
                    .await();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during nearby places request", e);
            return ResponseEntity.status(500).body(null);
        }
    }
}