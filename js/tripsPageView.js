/* ==========================================================================
   tripsPageView.js – View for turlisten (startsiden)

   View leser modellen og lager HTML. View endrer ikke modellen.
   Alle brukerhandlinger går via controller-funksjoner i tripsPageController.js:

     openTrip(tripId)             – trykk på en tur
     startNewTrip()               – den runde knappen
     goToPage(page)               – bunnnavigasjonen

   Modell-state som denne viewet forventer:
     model.app.currentPage = "tripsPage"
     model.data.trips             – turene, med activityId, countyId og pictures
     model.viewState.tripViewPage.tripId   – hvilken tur som er åpen

   Hva som er planlagt og hva som er gjort, regnes ut fra dagens dato.
   Det ligger derfor ikke i modellen, men beregnes her.
   ========================================================================== */

function updateViewTripsPage() {
  const plannedTrips = getTripsPlannedFromToday();
  const doneTrips = getTripsDoneBeforeToday();

  const html = /*HTML*/ `
        <div class="page-trips" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header">
                    <h1>Turer</h1>
                </header>

                <main class="content">
                    <h2 class="section-title">Planlagte turer</h2>
                    ${createTripListHtml(plannedTrips, "Ingen planlagte turer ennå.")}

                    <h2 class="section-title">Siste turer</h2>
                    ${createTripListHtml(doneTrips, "Ingen gjennomførte turer ennå.")}
                </main>

                ${createBottomNavHtml("tripsPage")}
                ${createFloatingActionHtml("startNewTrip();", "Ny tur")}
            </div>
        </div>
    `;

  document.getElementById("app").innerHTML = html;
}

/* Turene som ligger fram i tid. Beregnes, lagres ikke. */
function getTripsPlannedFromToday() {
  const trips = [];
  const today = new Date();

  for (const trip of model.data.trips) {
    const tripDate = new Date(trip.date);

    if (tripDate >= today) {
      trips.push(trip);
    }
  }

  return trips;
}

/* Turene som er gjennomført. Beregnes, lagres ikke. */
function getTripsDoneBeforeToday() {
  const trips = [];
  const today = new Date();

  for (const trip of model.data.trips) {
    const tripDate = new Date(trip.date);

    if (tripDate < today) {
      trips.push(trip);
    }
  }

  return trips;
}

/* Lager kortene for en liste av turer. */
function createTripListHtml(trips, emptyText) {
  if (trips.length === 0) {
    return /*HTML*/ `<p class="empty-text">${emptyText}</p>`;
  }

  let html = /*HTML*/ `<div class="trip-list">`;

  for (const trip of trips) {
    html += createTripCardHtml(trip);
  }

  html += "</div>";

  return html;
}

/* Ett turkort. Aktivitet, fylke og bilder hentes med id fra modellen,
   slik at turen ikke inneholder hele objektene. */
function createTripCardHtml(trip) {
  const activityName = getActivityName(trip.activityId);
  const countyName = getCountyName(trip.countyId);
  const dateText = formatDate(trip.date);
  const preview = createPreview(trip.description);

  return /*HTML*/ `
        <article class="trip-card" onclick="openTrip(${trip.id});">
            <div class="trip-card-header">
                <span class="trip-type">${activityName}</span>
                <span class="trip-date">${dateText}</span>
            </div>

            <h3>${trip.title}</h3>

            <p class="location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${trip.location}, ${countyName}
            </p>

            ${createTripImagesHtml(trip)}

            ${preview ? /*HTML*/ `<p class="trip-preview">${preview}</p>` : ""}
        </article>
    `;
}

/* Bildeplass-holderne under hvert turkort. Bildene ligger i
   model.data.images og kobles til turen med pictureId i trip.pictures. */
function createTripImagesHtml(trip) {
  if (trip.pictures.length === 0) {
    return "";
  }

  let html = /*HTML*/ `<div class="trip-images">`;

  for (const pictureId of trip.pictures) {
    const image = findImageById(pictureId);
    const label = image ? image.label : "Bilde";

    html += /*HTML*/ `<div class="img-placeholder">${label}</div>`;
  }

  html += "</div>";

  return html;
}

/* --- Turdetaljer --------------------------------------------------------- */

/* Midlertidig skall. Skjermbildet tur-detaljer.html følger.
   Innholdet fylles ut når turdetaljsiden er klar. */
function updateViewTripViewPage() {
  const trip = findObjectById(
    model.data.trips,
    model.viewState.tripViewPage.tripId,
  );
  const title = trip ? trip.title : "Fant ikke turen";

  const html = /*HTML*/ `
        <div class="page-trip-view" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header">
                    <h1>${title}</h1>
                </header>

                <main class="content">
                    <p class="empty-text">Turdetaljer er ikke laget ennå.</p>
                </main>

                ${createBottomNavHtml("tripsPage")}
            </div>
        </div>
    `;

  document.getElementById("app").innerHTML = html;
}

/* --- Ny tur -------------------------------------------------------------- */

/* Midlertidig skall. Skjermbildet registrer-tur.html følger. */
function updateViewNewTripPage() {
  const html = /*HTML*/ `
        <div class="page-new-trip" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header app-header--actions">
                    <a class="back-btn" onclick="goToPage('tripsPage');" href="#" title="Tilbake">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </a>
                    <h1>Ny tur</h1>
                </header>

                <main class="content">
                    <p class="empty-text">Skjemaet for ny tur er ikke laget ennå.</p>
                </main>

                ${createBottomNavHtml("tripsPage")}
            </div>
        </div>
    `;

  document.getElementById("app").innerHTML = html;
}
