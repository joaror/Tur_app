/* ==========================================================================
   tripsPageController.js – Controller for turene

   Controller håndterer brukerhandlinger og endrer modellen.
   Controller bygger ikke HTML. Etter hver endring kalles updateView().

   Brukerhandlinger:
     openTrip(tripId)   – åpne en tur, blir vist i viewState
     startNewTrip()     – gå til skjemaet for ny tur
     goToPage(page)     – bytte side fra bunnnavigasjonen
   ========================================================================== */

function openTrip(tripId) {
  const trip = findObjectById(model.data.trips, tripId);

  if (!trip) {
    return;
  }

  /* Vi lagrer bare id-en av turen i view state. Selve turen
       ligger allerede i model.data.trips. */
  const tripView = model.viewState.tripViewPage;

  tripView.tripId = trip.id;
  tripView.pageNumber = 0;
  tripView.isMenuOpen = false;
  tripView.isDeleteDialogOpen = false;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function startNewTrip() {
  clearTripForm(model.viewState.newTripPage);

  model.app.currentPage = "newTripPage";
  updateView();
}

function goToPage(page) {
  if (model.app.currentPage === page) {
    return;
  }

  model.app.currentPage = page;
  updateView();
}

/* ==========================================================================
   Turdetaljer

   Brukerhandlinger:
     toggleTripMenu()      – åpne og lukke overleggsmenyen
     askDeleteTrip()       – vis bekreftelsesdialogen
     cancelDeleteTrip()    – lukke dialogen, turen beholdes
     confirmDeleteTrip()   – slette turen og bildene
     duplicateTrip()       – lage en kopi av turen
     editTrip(tripId)      – fylle ut skjemaet for redigering
     showPreviousPictures()– forrige side i bildene
     showNextPictures()    – neste side i bildene
   ========================================================================== */

function toggleTripMenu() {
  const tripView = model.viewState.tripViewPage;

  tripView.isMenuOpen = !tripView.isMenuOpen;
  updateView();
}

function askDeleteTrip() {
  const tripView = model.viewState.tripViewPage;

  tripView.isMenuOpen = false;
  tripView.isDeleteDialogOpen = true;
  updateView();
}

function cancelDeleteTrip() {
  const tripView = model.viewState.tripViewPage;

  tripView.isDeleteDialogOpen = false;
  updateView();
}

function confirmDeleteTrip() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    tripView.isDeleteDialogOpen = false;
    updateView();
    return;
  }

  deleteImagesForTrip(trip);

  const index = findIndexById(model.data.trips, trip.id);

  if (index !== -1) {
    model.data.trips.splice(index, 1);
  }

  tripView.tripId = null;
  tripView.pageNumber = 0;
  tripView.isDeleteDialogOpen = false;

  model.app.currentPage = "tripsPage";
  updateView();
}

function duplicateTrip() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    return;
  }

  /* Vi lager et nytt objekt. Vi skyver ikke inn view state
       i domenedata, og kopien deler ikke objekt med originalen. */
  const newTripId = getNextId(model.data.trips);
  const newTrip = {
    id: newTripId,
    activityId: trip.activityId,
    title: trip.title + " (kopi)",
    location: trip.location,
    date: trip.date,
    countyId: trip.countyId,
    description: trip.description,
    pictures: duplicateImagesForTrip(newTripId, trip),
    updatedAt: trip.updatedAt,
  };

  model.data.trips.push(newTrip);

  tripView.tripId = newTrip.id;
  tripView.pageNumber = 0;
  tripView.isMenuOpen = false;

  updateView();
}

function editTrip(tripId) {
  const trip = findObjectById(model.data.trips, tripId);

  if (!trip) {
    return;
  }

  /* Skjemaet er et arbeidsutkast, så vi fyller det med
       verdiene fra turen, ikke med turen selv. */
  const editTripPage = model.viewState.editTripPage;

  editTripPage.tripId = trip.id;
  editTripPage.activityId = trip.activityId;
  editTripPage.title = trip.title;
  editTripPage.location = trip.location;
  editTripPage.date = trip.date;
  editTripPage.countyId = trip.countyId;
  editTripPage.description = trip.description;
  editTripPage.pictures = trip.pictures.slice();

  model.viewState.tripViewPage.isMenuOpen = false;

  model.app.currentPage = "editTripPage";
  updateView();
}

function showPreviousPictures() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    return;
  }

  const numberOfPages = countPicturePages(trip);

  if (tripView.pageNumber > 0) {
    tripView.pageNumber = tripView.pageNumber - 1;
  }

  /* Holder oss innenfor siste side, selv om noen har
       trykket forrige flere ganger. */
  if (tripView.pageNumber > numberOfPages - 1) {
    tripView.pageNumber = numberOfPages - 1;
  }

  updateView();
}

function showNextPictures() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    return;
  }

  const numberOfPages = countPicturePages(trip);

  if (tripView.pageNumber < numberOfPages - 1) {
    tripView.pageNumber = tripView.pageNumber + 1;
  }

  updateView();
}

/* ==========================================================================
   Turskjema

   Brukerhandlinger:
     saveNewTrip()                        – lagre en ny tur
     saveEditedTrip()                     – lagre endringene på en tur
     cancelNewTripForm()                  – avbryte ny tur
     cancelEditTripForm()                 – avbryte redigering
     addPictureToNewTripForm()            – legge til bilde på ny tur
     addPictureToEditTripForm()           – legge til bilde på en tur
     removePictureFromNewTripForm(id)     – fjerne bilde fra ny tur
     removePictureFromEditTripForm(id)    – fjerne bilde fra en tur
   ========================================================================== */

function saveNewTrip() {
  const form = model.viewState.newTripPage;

  if (!isTripFormValid(form)) {
    form.errorMessage = "Tittel og dato må være fyllt inn.";
    updateView();
    return;
  }

  /* Vi lager et nytt objekt. View state skal ikke bli liggende
       som domenedata, så vi kopierer feltene over i et nytt tur-objekt. */
  const newTripId = getNextId(model.data.trips);
  const newTrip = {
    id: newTripId,
    activityId: form.activityId,
    title: form.title.trim(),
    location: form.location.trim(),
    date: form.date,
    countyId: form.countyId,
    description: form.description,
    pictures: form.pictures.slice(),
    updatedAt: getTimestamp(),
  };

  linkPicturesToTrip(form.pictures, newTripId);
  model.data.trips.push(newTrip);

  clearTripForm(model.viewState.newTripPage);

  /* Vi åpner den nye turen, slik at brukeren ser resultatet. */
  model.viewState.tripViewPage.tripId = newTrip.id;
  model.viewState.tripViewPage.pageNumber = 0;
  model.viewState.tripViewPage.isMenuOpen = false;
  model.viewState.tripViewPage.isDeleteDialogOpen = false;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function saveEditedTrip() {
  const form = model.viewState.editTripPage;

  if (!isTripFormValid(form)) {
    form.errorMessage = "Tittel og dato må være fyllt inn.";
    updateView();
    return;
  }

  const trip = findObjectById(model.data.trips, form.tripId);

  if (!trip) {
    model.app.currentPage = "tripsPage";
    updateView();
    return;
  }

  /* Her endrer vi den eksisterende turen. Vanlig mutasjon er greit,
       fordi turen allerede er et domenobjekt. */
  trip.activityId = form.activityId;
  trip.title = form.title.trim();
  trip.location = form.location.trim();
  trip.date = form.date;
  trip.countyId = form.countyId;
  trip.description = form.description;
  trip.pictures = form.pictures.slice();
  trip.updatedAt = getTimestamp();

  linkPicturesToTrip(form.pictures, trip.id);

  clearTripForm(model.viewState.editTripPage);

  /* Skjemaet skal ikke huske en tur etter lagring. */
  model.viewState.editTripPage.tripId = null;

  model.viewState.tripViewPage.tripId = trip.id;
  model.viewState.tripViewPage.pageNumber = 0;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function cancelNewTripForm() {
  deleteUnsavedPictures(model.viewState.newTripPage);
  clearTripForm(model.viewState.newTripPage);

  model.app.currentPage = "tripsPage";
  updateView();
}

function cancelEditTripForm() {
  const tripId = model.viewState.editTripPage.tripId;

  deleteUnsavedPictures(model.viewState.editTripPage);
  clearTripForm(model.viewState.editTripPage);

  /* Vi blir stående på turen vi kom fra, hvis den fortsatt finnes. */
  if (findObjectById(model.data.trips, tripId)) {
    model.viewState.tripViewPage.tripId = tripId;
    model.app.currentPage = "tripViewPage";
  } else {
    model.app.currentPage = "tripsPage";
  }

  updateView();
}

function addPictureToNewTripForm() {
  addPictureToForm(model.viewState.newTripPage);
  updateView();
}

function addPictureToEditTripForm() {
  addPictureToForm(model.viewState.editTripPage);
  updateView();
}

function removePictureFromNewTripForm(pictureId) {
  removePictureFromForm(model.viewState.newTripPage, pictureId);
  updateView();
}

function removePictureFromEditTripForm(pictureId) {
  removePictureFromForm(model.viewState.editTripPage, pictureId);
  updateView();
}

/* --- Hjelpefunksjoner ----------------------------------------------------- */

/* Et skjema er gyldig når tittel og dato er fyllt inn. */
function isTripFormValid(form) {
  return form.title.trim() !== "" && form.date !== "" && form.date !== null;
}

/* Tømmer et skjemafelt, slik at et halvutfylt skjema
   ikke ligger igjen neste gang siden åpnes. */
function clearTripForm(form) {
  form.activityId = null;
  form.title = "";
  form.location = "";
  form.date = "";
  form.countyId = null;
  form.description = "";
  form.pictures = [];
  form.errorMessage = "";
}

/* Legger til et bilde i skjemaet. Vi lager et bildeobjekt med
   tripId = null, som betyr at det ikke hører til en tur ennå. */
function addPictureToForm(form) {
  const pictureId = getNextId(model.data.images);

  model.data.images.push({
    id: pictureId,
    tripId: null,
    label: "Bilde",
    templateId: getNextTemplateId(form.pictures.length),
  });

  form.pictures.push(pictureId);
}

/* Motivene går i runde, slik at en tur ikke får samme motiv to ganger på rad. */
function getNextTemplateId(pictureCount) {
  const templates = model.data.imageTemplates;

  return templates[pictureCount % templates.length].id;
}

/* Fjerner ett bilde fra skjemaet. Et bilde som aldri har blitt lagret på en tur, 
   slettes også, slik at vi ikke lar ubrukte bilder ligge i modellen. */
function removePictureFromForm(form, pictureId) {
  const index = form.pictures.indexOf(pictureId);

  if (index !== -1) {
    form.pictures.splice(index, 1);
  }

  const image = findObjectById(model.data.images, pictureId);

  if (image && image.tripId === null) {
    const imageIndex = findIndexById(model.data.images, pictureId);

    if (imageIndex !== -1) {
      model.data.images.splice(imageIndex, 1);
    }
  }
}

/* Knytter bildene i skjemaet til turen, og sletter bilder som hører til turen, 
   men som ikke er med i skjemaet lenger. */
function linkPicturesToTrip(pictureIds, tripId) {
  for (const pictureId of pictureIds) {
    const image = findObjectById(model.data.images, pictureId);

    if (image) {
      image.tripId = tripId;
    }
  }

  for (let i = model.data.images.length - 1; i >= 0; i--) {
    const image = model.data.images[i];

    if (image.tripId === tripId && !pictureIds.includes(image.id)) {
      model.data.images.splice(i, 1);
    }
  }
}

/* Sletter bilder som ble lagt til i skjemaet, men som aldri
   ble lagret. Kalles når brukeren avbryter. */
function deleteUnsavedPictures(form) {
  for (const pictureId of form.pictures) {
    const image = findObjectById(model.data.images, pictureId);

    if (image && image.tripId === null) {
      const imageIndex = findIndexById(model.data.images, pictureId);

      if (imageIndex !== -1) {
        model.data.images.splice(imageIndex, 1);
      }
    }
  }
}

/* Sletter bildene som hører til en tur. Vi ser både etter bilder som
   peker på turen, og etter bildene som står i turens pictures-liste. */
function deleteImagesForTrip(trip) {
  for (let i = model.data.images.length - 1; i >= 0; i--) {
    const image = model.data.images[i];

    if (image.tripId === trip.id || trip.pictures.includes(image.id)) {
      model.data.images.splice(i, 1);
    }
  }
}

/* Lager nye bildeobjekter for kopien, og gir turen de nye id-ene.
   Bildene kopieres ikke, slik at originalen og kopien kan endres
   hver for seg. */
function duplicateImagesForTrip(newTripId, trip) {
  const pictureIds = [];

  for (const pictureId of trip.pictures) {
    const image = findObjectById(model.data.images, pictureId);

    if (!image) {
      continue;
    }

    const newImage = {
      id: getNextId(model.data.images),
      tripId: newTripId,
      label: image.label,
      templateId: image.templateId,
    };

    model.data.images.push(newImage);
    pictureIds.push(newImage.id);
  }

  return pictureIds;
}
