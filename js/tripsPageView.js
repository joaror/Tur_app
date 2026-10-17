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

  // Lag en kopi av trips og sorter dato fra nyeste til eldste
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  let html = /*HTML*/ `<div class="trip-list">`;

  for (const trip of sortedTrips) {
    html += createTripCardHtml(trip);
  }

  html += "</div>";

  return html;
}

function isFutureDate(dateString) {
  const tripDate = new Date(dateString);

  // Check if the input string is actually a valid date
  if (isNaN(tripDate.getTime())) {
    console.error("Invalid date provided");
    return false;
  }

  const today = new Date();

  // Reset both to midnight to compare only the calendar day
  tripDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return tripDate > today;
}

/* Ett turkort. Aktivitet, fylke og bilder hentes med id fra modellen,
   slik at turen ikke inneholder hele objektene. */
function createTripCardHtml(trip) {
  const activityName = getActivityName(trip.activityId);
  const countyName = getCountyName(trip.countyId);
  const dateText = formatDate(trip.date);
  const preview = createPreview(trip.description);

  if (isFutureDate(trip.date)) {
    return /*HTML*/ `
            <article class="trip-card" onclick="openTrip(${trip.id});">
                <div class="trip-card-header">
                    <span class="trip-type">${activityName}</span>
                    <span class="trip-date">${dateText}</span>
                </div>
            </article>
        `;
  }

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
    html += /*HTML*/ `
            <div class="img-placeholder">
                ${createPictureSvgHtml(pictureId)}
                <span class="img-placeholder-label">${getPictureLabel(pictureId)}</span>
            </div>
        `;
  }

  html += "</div>";

  return html;
}

/* --- Turdetaljer --------------------------------------------------------- */

/* Skjermbildet tur-detaljer.html følger. Alle data hentes fra turen som
   ligger i model.data.trips. Viewet vet bare hvilken tur som er åpen:
   den id-en finnes i model.viewState.tripViewPage.tripId. */
function updateViewTripViewPage() {
  const viewState = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, viewState.tripId);

  if (!trip) {
    const notFoundHtml = /*HTML*/ `
        <div class="page-trip-detail" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header app-header--actions">
                    ${createBackButtonHtml()}
                    <h1>Turdetaljer</h1>
                </header>

                <div class="detail-content">
                    <div class="detail-section">
                        <p class="empty-text">Fant ikke turen.</p>
                    </div>
                </div>

                ${createBottomNavHtml("tripsPage")}
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = notFoundHtml;
    return;
  }

  const html = /*HTML*/ `
        <div class="page-trip-detail" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header app-header--actions">
                    ${createBackButtonHtml()}
                    <h1>Turdetaljer</h1>
                    <div class="header-actions">
                        <button class="icon-btn" type="button" title="Rediger" onclick="editTrip(${trip.id});">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>

                        <div class="menu-wrap">
                            <button class="icon-btn" type="button" title="Mer" onclick="toggleTripMenu();">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="19" cy="12" r="1"></circle>
                                    <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                            </button>

                            ${createTripMenuHtml(viewState.isMenuOpen)}
                        </div>
                    </div>
                </header>

                <div class="detail-content">
                    ${createHeroImageHtml(trip)}
                    ${createTripInfoSectionHtml(trip)}
                    ${createTripGallerySectionHtml(trip, viewState.pageNumber)}
                    ${createTripNotesSectionHtml(trip)}
                </div>

                ${createTripDeleteDialogHtml(trip, viewState.isDeleteDialogOpen)}
                ${createBottomNavHtml("tripsPage")}
            </div>
        </div>
    `;

  document.getElementById("app").innerHTML = html;
}

/* Hovedbildet er det første bildet på turen. */
function createHeroImageHtml(trip) {
  if (trip.pictures.length === 0) {
    return /*HTML*/ `<div class="hero-image">Ingen bilder</div>`;
  }

  const pictureId = trip.pictures[0];
  const svg = createPictureSvgHtml(pictureId);

  if (!svg) {
    return /*HTML*/ `<div class="hero-image">${getPictureLabel(pictureId)}</div>`;
  }

  return /*HTML*/ `
        <div class="hero-image">
            ${svg}
            <span class="hero-image-label">${getPictureLabel(pictureId)}</span>
        </div>
    `;
}

/* Aktivitet, dato, sesong og sted. */
function createTripInfoSectionHtml(trip) {
  const activityName = getActivityName(trip.activityId);
  const countyName = getCountyName(trip.countyId);
  const dateText = formatDate(trip.date);
  const seasonName = getSeasonName(trip.date);

  return /*HTML*/ `
        <div class="detail-section">
            <div class="trip-meta">
                <span class="meta-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 4v10.54a4 4 0 11-4 0V4a2 2 0 014 0z"></path>
                    </svg>
                    ${activityName}
                </span>

                <span class="meta-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${dateText}
                </span>

                <span class="meta-chip">${seasonName}</span>
            </div>

            <h2>${trip.title}</h2>

            <div class="location-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${trip.location}, ${countyName}
            </div>
        </div>
    `;
}

/* Bildene vises tre og tre. Hvilken side vi er på står i
   model.viewState.tripViewPage.pageNumber. */
function createTripGallerySectionHtml(trip, pageNumber) {
  if (trip.pictures.length === 0) {
    return /*HTML*/ `
            <div class="detail-section">
                <p class="empty-text">Ingen bilder på turen.</p>
            </div>
        `;
  }

  const picturesOnPage = getPicturesOnPage(trip, pageNumber);
  const numberOfPages = countPicturePages(trip);

  let html = /*HTML*/ `
        <div class="detail-section">
            <div class="image-gallery">
    `;

  for (const pictureId of picturesOnPage) {
    html += /*HTML*/ `
                <div class="gallery-img" title="${getPictureLabel(pictureId)}">
                    ${createPictureSvgHtml(pictureId)}
                </div>
        `;
  }

  html += /*HTML*/ `
            </div>

            <div class="gallery-nav">
                <button class="btn btn-secondary" type="button" onclick="showPreviousPictures();">
                    Forrige
                </button>

                <span class="gallery-count">Side ${pageNumber + 1} av ${numberOfPages}</span>

                <button class="btn btn-secondary" type="button" onclick="showNextPictures();">
                    Neste
                </button>
            </div>
        </div>
    `;

  return html;
}

/* Bildene er delt i sider med tre bilder per side. */
const PICTURES_PER_PAGE = 3;

/* Hvor mange sider bildene er delt i. */
function countPicturePages(trip) {
  return Math.ceil(trip.pictures.length / PICTURES_PER_PAGE);
}

/* Bildene på den valgte siden. */
function getPicturesOnPage(trip, pageNumber) {
  const pictures = [];
  const startIndex = pageNumber * PICTURES_PER_PAGE;

  for (let i = startIndex; i < startIndex + PICTURES_PER_PAGE; i++) {
    if (i < trip.pictures.length) {
      pictures.push(trip.pictures[i]);
    }
  }

  return pictures;
}

/* Notatene er delt i avsnitt med en tom linje mellom. */
function createTripNotesSectionHtml(trip) {
  if (!trip.description) {
    return /*HTML*/ `
            <div class="detail-section">
                <p class="empty-text">Ingen notater.</p>
            </div>
        `;
  }

  const paragraphs = trip.description.split("\n\n");
  let html = /*HTML*/ `<div class="detail-section">`;

  for (const paragraph of paragraphs) {
    const text = paragraph.trim();

    if (text !== "") {
      html += /*HTML*/ `<p class="notes-text" style="margin-bottom: 12px;">${text}</p>`;
    }
  }

  html += "</div>";

  return html;
}

/* Overleggsmenyen med Dupliser og Slett. Den er lukket
   med hidden-attributtet, som CSS-en allerede håndterer. */
function createTripMenuHtml(isMenuOpen) {
  return /*HTML*/ `
        <div class="menu" ${isMenuOpen ? "" : "hidden"}>
            <button class="menu-item" type="button" onclick="duplicateTrip();">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                </svg>
                Dupliser tur
            </button>

            <div class="menu-divider"></div>

            <button class="menu-item danger" type="button" onclick="askDeleteTrip();">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                </svg>
                Slett tur
            </button>
        </div>
    `;
}

/* Bekreftelsesdialogen. Den tegnes bare når controlleren har slått den på. */
function createTripDeleteDialogHtml(trip, isDeleteDialogOpen) {
  if (!isDeleteDialogOpen) {
    return /*HTML*/ `<div class="dialog-backdrop" hidden></div>`;
  }

  return /*HTML*/ `
        <div class="dialog-backdrop">
            <div class="dialog">
                <h2 class="dialog-title">Slette turen?</h2>
                <p class="dialog-text">
                    «${trip.title}» og alle bilder blir permanent slettet.
                    Dette kan ikke angres.
                </p>
                <div class="dialog-actions">
                    <button class="dialog-btn" type="button" onclick="cancelDeleteTrip();">
                        Avbryt
                    </button>
                    <button class="dialog-btn danger" type="button" onclick="confirmDeleteTrip();">
                        Slett tur
                    </button>
                </div>
            </div>
        </div>
    `;
}
/* --- Turskjema ------------------------------------------------------------ */

/* Samme skjema brukes til ny tur og til redigering. Forskjellen er
   bare hvilket view state vi henter verdiene fra, og hva knappen
   og toppteksten sier. */
function updateViewNewTripPage() {
  updateViewTripForm(model.viewState.newTripPage, "newTripPage", false);
}

function updateViewEditTripsPage() {
  updateViewTripForm(model.viewState.editTripPage, "editTripPage", true);
}

function updateViewTripForm(form, pageName, isEdit) {
  const cancelCall = isEdit ? "cancelEditTripForm();" : "cancelNewTripForm();";
  const saveCall = isEdit ? "saveEditedTrip();" : "saveNewTrip();";
  const heading = isEdit ? "Rediger tur" : "Ny tur";
  const saveText = isEdit ? "Lagre endring" : "Lagre tur";

  const html = /*HTML*/ `
        <div class="page-trip-form" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header app-header--actions">
                    ${createBackButtonHtml()}
                    <h1>${heading}</h1>
                </header>

                <div class="form-content">
                    <div class="form-group">
                        <label for="aktivitet">Aktivitet</label>
                        <select
                            class="select"
                            id="aktivitet"
                            onchange="model.viewState.${pageName}.activityId = this.value ? Number(this.value) : null;"
                        >
                            ${createOptionsHtml(model.data.activities, "activity", form.activityId, "Velg aktivitet")}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="tittel">Tittel</label>
                        <input
                            class="input"
                            type="text"
                            id="tittel"
                            placeholder="f.eks. Skitur til Prekestolen"
                            value="${form.title}"
                            oninput="model.viewState.${pageName}.title = this.value;"
                        />
                    </div>

                    <div class="form-group">
                        <label for="sted">Sted</label>
                        <input
                            class="input"
                            type="text"
                            id="sted"
                            placeholder="f.eks. Prekestolen, Ryfylke"
                            value="${form.location}"
                            oninput="model.viewState.${pageName}.location = this.value;"
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="dato">Dato</label>
                            <input
                                class="input"
                                type="date"
                                id="dato"
                                value="${form.date ? form.date : ""}"
                                onchange="model.viewState.${pageName}.date = this.value;"
                            />
                        </div>

                        <div class="form-group">
                            <label for="fylke">Fylke</label>
                            <select
                                class="select"
                                id="fylke"
                                onchange="model.viewState.${pageName}.countyId = this.value ? Number(this.value) : null;"
                            >
                                ${createOptionsHtml(model.data.counties, "county", form.countyId, "Velg fylke")}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Bilder</label>
                        ${createTripFormPicturesHtml(form, pageName, isEdit)}
                    </div>

                    <div class="form-group">
                        <label for="logg">Logg</label>
                        <textarea
                            class="textarea"
                            id="logg"
                            rows="5"
                            placeholder="Skriv refleksjoner, observasjoner eller minner fra turen..."
                            oninput="model.viewState.${pageName}.description = this.value;"
                        >${form.description}</textarea>
                    </div>

                    ${form.errorMessage ? /*HTML*/ `<p class="login-error">${form.errorMessage}</p>` : ""}
                </div>

                <div class="btn-group">
                    <button class="btn btn-secondary" type="button" onclick="${cancelCall}">
                        Avbryt
                    </button>
                    <button class="btn btn-primary" type="button" onclick="${saveCall}">
                        ${saveText}
                    </button>
                </div>
            </div>
        </div>
    `;

  document.getElementById("app").innerHTML = html;
}

/* Dropdownene hentes fra modellen, slik at vi ikke skriver
   inn listen over aktiviteter og fylker to steder. */
function createOptionsHtml(list, keyName, selectedId, emptyText) {
  let html = createOptionHtml("", emptyText, "");

  for (const item of list) {
    const value = item.id;
    const text = item[keyName];

    html += createOptionHtml(value, text, selectedId);
  }

  return html;
}

/* Bildene på turen, pluss en knapp som legger til et nytt bilde.
   Opplastingen er simulert: vi velger et ferdig motiv fra
   model.data.imageTemplates, så ingenting lagres på disk. */
function createTripFormPicturesHtml(form, pageName, isEdit) {
  const addCall = isEdit
    ? "addPictureToEditTripForm();"
    : "addPictureToNewTripForm();";
  const removeCall = isEdit
    ? "removePictureFromEditTripForm"
    : "removePictureFromNewTripForm";

  let html = /*HTML*/ `<div class="image-gallery">`;

  for (const pictureId of form.pictures) {
    html += /*HTML*/ `
            <div class="gallery-img" title="${getPictureLabel(pictureId)}">
                ${createPictureSvgHtml(pictureId)}
                <button
                    class="gallery-img-remove"
                    type="button"
                    title="Fjern bildet"
                    onclick="${removeCall}(${pictureId});"
                >
                    &times;
                </button>
            </div>
        `;
  }

  html += /*HTML*/ `
            <button class="gallery-add" type="button" onclick="${addCall}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Legg til bilde</span>
            </button>
        </div>
    `;

  return html;
}
