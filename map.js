(function () {
  "use strict";

  /** Default map view (San Francisco Bay area — replace with your area). */
  const DEFAULT_CENTER = [37.77, -122.42];
  const DEFAULT_ZOOM = 11;

  /** GeoJSON files shipped with the site (paths relative to this page). */
  const STATIC_ROUTE_URLS = [
    "routes/sample-north.geojson",
    "routes/sample-south.geojson",
  ];

  const ROUTE_COLORS = [
    "#2563eb",
    "#15803d",
    "#c026d3",
    "#ea580c",
    "#0891b2",
    "#b45309",
  ];

  let colorIndex = 0;

  const map = L.map("map", {
    zoomControl: true,
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  /* OSM’s own tile server often blocks or errors on embedded sites; CARTO hosts OSM-derived tiles for Leaflet use. */
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    }
  ).addTo(map);

  const routeLayers = [];

  function nextColor() {
    const c = ROUTE_COLORS[colorIndex % ROUTE_COLORS.length];
    colorIndex += 1;
    return c;
  }

  function styleForFeature(feature, color) {
    const g = feature && feature.geometry && feature.geometry.type;
    if (g === "Polygon" || g === "MultiPolygon") {
      return {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.2,
      };
    }
    return { color, weight: 4, opacity: 0.9 };
  }

  function onEachFeature(feature, layer) {
    const name =
      (feature.properties && (feature.properties.name || feature.properties.title)) ||
      "Route";
    layer.bindPopup(String(name));
  }

  function addGeoJSON(data, label, options) {
    const opts = options || {};
    if (!data || (data.type !== "FeatureCollection" && data.type !== "Feature")) {
      console.warn("Skipping invalid GeoJSON:", label);
      return null;
    }
    const color = nextColor();
    const layer = L.geoJSON(data, {
      style: (feature) => styleForFeature(feature, color),
      onEachFeature,
    });
    layer.addTo(map);
    routeLayers.push(layer);
    if (opts.fitToLayer) {
      try {
        const b = layer.getBounds();
        if (b.isValid()) {
          map.fitBounds(b.pad(0.1));
        }
      } catch {
        /* ignore */
      }
    }
    return layer;
  }

  function fitAllRouteLayers() {
    const bounds = L.latLngBounds();
    routeLayers.forEach((layer) => {
      try {
        const b = layer.getBounds();
        if (b.isValid()) bounds.extend(b);
      } catch {
        /* ignore */
      }
    });
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.12));
    }
  }

  function loadStaticRoutes() {
    const jobs = STATIC_ROUTE_URLS.map((url) =>
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.json();
        })
        .then((data) => ({ ok: true, data, url }))
        .catch((err) => {
          console.warn("Could not load", url, err);
          return { ok: false };
        })
    );

    Promise.all(jobs).then((results) => {
      results.forEach((result) => {
        if (result.ok) {
          addGeoJSON(result.data, result.url, { fitToLayer: false });
        }
      });
      fitAllRouteLayers();
    });
  }

  const routeFilesInput = document.getElementById("route-files");
  if (routeFilesInput) {
    routeFilesInput.addEventListener("change", () => {
      const files = routeFilesInput.files;
      if (!files || !files.length) return;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            addGeoJSON(data, file.name, { fitToLayer: true });
          } catch (e) {
            console.warn("Invalid JSON in", file.name, e);
          }
        };
        reader.readAsText(file);
      });
      routeFilesInput.value = "";
    });
  }

  /** Nominatim: search on submit; minimum interval between requests. */
  const NOMINATIM = "https://nominatim.openstreetmap.org/search";
  let lastSearchAt = 0;
  const MIN_INTERVAL_MS = 1200;

  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchStatus = document.getElementById("search-status");

  function setStatus(msg) {
    if (searchStatus) searchStatus.textContent = msg || "";
  }

  async function runSearch(query) {
    const q = (query || "").trim();
    if (q.length < 2) {
      setStatus("Enter at least 2 characters.");
      return;
    }

    const now = Date.now();
    const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastSearchAt));
    await new Promise((r) => setTimeout(r, wait));
    lastSearchAt = Date.now();

    setStatus("Searching…");

    const url = new URL(NOMINATIM);
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5");

    let res;
    try {
      res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      setStatus("Search failed (network).");
      return;
    }

    if (!res.ok) {
      setStatus("Search failed.");
      return;
    }

    const results = await res.json();
    if (!results || !results.length) {
      setStatus("No results found.");
      return;
    }

    const first = results[0];
    const lat = parseFloat(first.lat);
    const lon = parseFloat(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setStatus("Unexpected result.");
      return;
    }

    map.flyTo([lat, lon], 14);
    setStatus(results[0].display_name || "Found.");
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runSearch(searchInput.value);
    });
  }

  loadStaticRoutes();
})();
