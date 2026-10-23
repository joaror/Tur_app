/* ==========================================================================
   desktopPageController.js – Controller for desktop-utgaven av Min friluft.

   Controller håndterer brukerhandlinger og endrer modellen.
   Controller bygger ikke HTML. Etter hver endring kalles updateView().

   Her ligger ALLE controller-funksjoner for desktop, slik at man kan se
   hele desktop-appen samlet.

   Funksjoner:
     desktopHandleLogin()                  // logger inn
     desktopTogglePasswordVisibility()     // viser/skjuler passordet

     desktopOpenTrip(tripId)               // åpner en eksisterende tur
     desktopStartNewTrip()                 // starter et nytt tur-skjema
     desktopEditTrip(tripId)               // åpner et eksisterende tur-skjema
     desktopSaveNewTrip()                  // lagrer ny tur
     desktopSaveEditedTrip()               // lagrer endringer på tur
     desktopCancelTripForm(pageName)       // avbryter et tur-skjema
     desktopToggleTripMenu()               // viser/skjuler menyen på turvisning
     desktopAskDeleteTrip()                // viser dialog for å slette tur
     desktopCancelDeleteTrip()             // skjuler dialog for å slette tur
     desktopConfirmDeleteTrip()            // sletter tur og bilder som hører til
     desktopDuplicateTrip()                // lager en kopi av turen
     desktopAddPictureToTripForm(pageName) // legger til et bilde i et tur-skjema
     desktopRemovePictureFromTripForm(pictureId, pageName) // fjerner et bilde

     desktopOpenNote(noteId)               // åpner et notat
     desktopSaveNewNote()                  // lagrer et nytt notat
     desktopSaveEditedNote()               // lagrer endringer på et notat
     desktopCancelNoteForm(pageName)       // avbryter et notat-skjema
     desktopToggleNoteMenu()               // viser/skjuler menyen på notatvisning
     desktopAskDeleteNote()                // viser dialog for å slette notat
     desktopCancelDeleteNote()             // skjuler dialog for å slette notat
     desktopConfirmDeleteNote()            // sletter notatet
     desktopDuplicateNote()                // lager en kopi av notatet
     desktopToggleTopic(topicId, pageName) // slår en emneknagg av og på

     desktopRunSearch()                    // henter treffene på nytt
     desktopSetSearchFilter(fieldName, value) // endrer et filter i søket
     desktopSetSortOrder(sortOrder)        // endrer sorteringen i søket

     desktopAddActivity()                  // legger til en ny aktivitet
     desktopRemoveActivity(id)             // sletter en aktivitet
     desktopAddTopic()                     // legger til en ny emneknagg
     desktopRemoveTopic(id)                // sletter en emneknagg
     desktopAddCounty()                    // legger til et nytt fylke
     desktopRemoveCounty(id)               // sletter et fylke

     desktopIsTripFormValid(form)          // sjekker om skjemaet er gyldig
     desktopClearTripForm(form)            // tømmer et skjema
     desktopAddPictureToForm(form)         // legger til et bilde i skjemaet
     desktopRemovePictureFromForm(form, pictureId) // fjerner et bilde fra skjemaet
     desktopLinkPicturesToTrip(pictureIds, tripId)  // knytter bildene til turen
     desktopDeleteUnsavedPictures(form)    // sletter bilder som aldri ble lagret
     desktopDeleteImagesForTrip(trip)      // sletter bildene som hører til en tur
     desktopDuplicateImagesForTrip(trip)   // lager nye bildeobjekter for kopien
     desktopIsImageUsedByTrip(pictureId)   // sjekker om et bilde hører til en tur
     desktopRemoveImageById(pictureId)     // sletter ett bilde fra modellen
     desktopGetNextTemplateId(count)       // henter neste motiv for et bilde
     desktopIsActivityInUse(activityId)    // sjekker om en tur bruker aktiviteten
     desktopIsTopicInUse(topicId)          // sjekker om et notat bruker emneknaggen
     desktopIsCountyInUse(countyId)        // sjekker om en tur bruker fylket
     desktopGetNewName(name, list, keyName, label) // sjekker navnet på det som skal legges til
     desktopIsNameAlreadyUsed(list, keyName, name) // sjekker om navnet finnes fra før
   ========================================================================== */

/* ==========================================================================
   Innlogging
   ========================================================================== */

/* Dette er en ren frontend uten backend, så vi "logger inn" uten å sjekke
   mot en server: er begge feltene fylt, regnes brukeren som innlogget. */
function desktopHandleLogin() {
  const login = model.viewState.loginPage;

  const userInput = login.userInput.trim();
  const passwordInput = login.passwordInput.trim();

  if (userInput === "" || passwordInput === "") {
    login.errorMessage = "Fyll inn både e-post og passord.";
    updateView();
    return false;
  }

  login.errorMessage = "";
  login.passwordInput = "";
  login.isPasswordVisible = false;

  /* På desktop starter vi på tursiden. */
  model.app.currentPage = "tripsPage";
  updateView();

  return false;
}

function desktopTogglePasswordVisibility() {
  const login = model.viewState.loginPage;

  login.isPasswordVisible = !login.isPasswordVisible;
  updateView();
}

/* ==========================================================================
   Turer
   ========================================================================== */

function desktopOpenTrip(tripId) {
  const trip = findObjectById(model.data.trips, tripId);

  if (!trip) {
    return;
  }

  /* Vi lagrer bare id-en av turen i view state. Selve turen
     ligger allerede i model.data.trips. */
  const tripView = model.viewState.tripViewPage;

  tripView.tripId = trip.id;
  tripView.isMenuOpen = false;
  tripView.isDeleteDialogOpen = false;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function desktopStartNewTrip() {
  desktopDeleteUnsavedPictures(model.viewState.newTripPage);
  desktopClearTripForm(model.viewState.newTripPage);

  model.app.currentPage = "newTripPage";
  updateView();
}

function desktopEditTrip(tripId) {
  const trip = findObjectById(model.data.trips, tripId);

  if (!trip) {
    return;
  }

  /* Skjemaet er et arbeidsutkast, så vi fyller det med verdiene fra turen,
     ikke med turen selv. */
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

function desktopSaveNewTrip() {
  const form = model.viewState.newTripPage;

  if (!desktopIsTripFormValid(form)) {
    form.errorMessage = "Tittel og dato må være fyllt inn.";
    updateView();
    return;
  }

  /* Vi lager et nytt objekt. View state skal ikke bli liggende som
     domenedata, så vi kopierer feltene over i et nytt tur-objekt. */
  const newTripId = getNextId(model.data.trips);
  const newTrip = {
    id: newTripId,
    activityId: form.activityId,
    title: form.title.trim(),
    location: form.location.trim(),
    date: form.date,
    countyId: form.countyId,
    description: form.description,
    pictures: [],
    updatedAt: getTimestamp(),
  };

  model.data.trips.push(newTrip);

  /* Turen må finnes i modellen før bildene kan knyttes til den. */
  desktopLinkPicturesToTrip(form.pictures, newTrip.id);

  desktopClearTripForm(model.viewState.newTripPage);

  /* Vi åpner den nye turen, slik at brukeren ser resultatet. */
  model.viewState.tripViewPage.tripId = newTrip.id;
  model.viewState.tripViewPage.isMenuOpen = false;
  model.viewState.tripViewPage.isDeleteDialogOpen = false;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function desktopSaveEditedTrip() {
  const form = model.viewState.editTripPage;

  if (!desktopIsTripFormValid(form)) {
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

  /* Her endrer vi den eksisterende turen. Vanlig mutasjon er greit, fordi
     turen allerede er et domenobjekt. */
  trip.activityId = form.activityId;
  trip.title = form.title.trim();
  trip.location = form.location.trim();
  trip.date = form.date;
  trip.countyId = form.countyId;
  trip.description = form.description;
  trip.updatedAt = getTimestamp();

  /* Turens pictures-liste følger skjemaet, og bilder som ble fjernet fra
     skjemaet, blir slettet. */
  desktopLinkPicturesToTrip(form.pictures, trip.id);

  desktopClearTripForm(model.viewState.editTripPage);

  /* Skjemaet skal ikke huske en tur etter lagring. */
  model.viewState.editTripPage.tripId = null;

  model.viewState.tripViewPage.tripId = trip.id;

  model.app.currentPage = "tripViewPage";
  updateView();
}

function desktopCancelTripForm(pageName) {
  const form = model.viewState[pageName];

  desktopDeleteUnsavedPictures(form);
  desktopClearTripForm(form);

  if (pageName === "editTripPage") {
    /* Vi blir stående på turen vi kom fra, hvis den fortsatt finnes. */
    if (findObjectById(model.data.trips, form.tripId)) {
      model.viewState.tripViewPage.tripId = form.tripId;
      model.app.currentPage = "tripViewPage";
    } else {
      model.app.currentPage = "tripsPage";
    }
  } else {
    model.app.currentPage = "tripsPage";
  }

  updateView();
}

function desktopToggleTripMenu() {
  const tripView = model.viewState.tripViewPage;

  tripView.isMenuOpen = !tripView.isMenuOpen;
  updateView();
}

function desktopAskDeleteTrip() {
  const tripView = model.viewState.tripViewPage;

  tripView.isMenuOpen = false;
  tripView.isDeleteDialogOpen = true;
  updateView();
}

function desktopCancelDeleteTrip() {
  const tripView = model.viewState.tripViewPage;

  tripView.isDeleteDialogOpen = false;
  updateView();
}

function desktopConfirmDeleteTrip() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    tripView.isDeleteDialogOpen = false;
    updateView();
    return;
  }

  /* Turen tas bort før bildene slettes. Da ser vi ikke lenger turen når vi
     sjekker om et bilde brukes av noen annen tur. */
  const index = findIndexById(model.data.trips, trip.id);

  if (index !== -1) {
    model.data.trips.splice(index, 1);
  }

  desktopDeleteImagesForTrip(trip);

  tripView.tripId = null;
  tripView.isDeleteDialogOpen = false;

  model.app.currentPage = "tripsPage";
  updateView();
}

function desktopDuplicateTrip() {
  const tripView = model.viewState.tripViewPage;
  const trip = findObjectById(model.data.trips, tripView.tripId);

  if (!trip) {
    return;
  }

  /* Vi lager et nytt objekt. Vi skyver ikke inn view state i domenedata,
     og kopien deler ikke objekt med originalen. */
  const newTripId = getNextId(model.data.trips);
  const newTrip = {
    id: newTripId,
    activityId: trip.activityId,
    title: trip.title + " (kopi)",
    location: trip.location,
    date: trip.date,
    countyId: trip.countyId,
    description: trip.description,
    pictures: desktopDuplicateImagesForTrip(trip),
    updatedAt: getTimestamp(),
  };

  model.data.trips.push(newTrip);

  tripView.tripId = newTrip.id;
  tripView.isMenuOpen = false;

  updateView();
}

function desktopAddPictureToTripForm(pageName) {
  desktopAddPictureToForm(model.viewState[pageName]);
  updateView();
}

function desktopRemovePictureFromTripForm(pictureId, pageName) {
  desktopRemovePictureFromForm(model.viewState[pageName], pictureId);
  updateView();
}

/* ==========================================================================
   Notater
   ========================================================================== */

function desktopOpenNote(noteId) {
  const note = findObjectById(model.data.notes, noteId);

  if (!note) {
    return;
  }

  const noteView = model.viewState.noteViewPage;

  noteView.noteId = note.id;
  noteView.isMenuOpen = false;
  noteView.isDeleteDialogOpen = false;

  model.app.currentPage = "noteViewPage";
  updateView();
}

function desktopSaveNewNote() {
  const form = model.viewState.newNotePage;

  if (!desktopIsNoteFormValid(form)) {
    form.errorMessage = "Tittel og dato må være fyllt inn.";
    updateView();
    return;
  }

  const newNoteId = getNextId(model.data.notes);
  const newNote = {
    id: newNoteId,
    title: form.title.trim(),
    date: form.date,
    description: form.description,
    topics: form.topics.slice(),
    updatedAt: getTimestamp(),
  };

  model.data.notes.push(newNote);

  /* Vi lager et nytt view state, så at det ikke blir liggende igjen. */
  model.viewState.newNotePage = {
    title: "",
    date: "",
    description: "",
    topics: [],
    errorMessage: "",
  };

  model.viewState.noteViewPage.noteId = newNote.id;
  model.viewState.noteViewPage.isMenuOpen = false;
  model.viewState.noteViewPage.isDeleteDialogOpen = false;

  model.app.currentPage = "noteViewPage";
  updateView();
}

function desktopSaveEditedNote() {
  const form = model.viewState.editNotePage;

  if (!desktopIsNoteFormValid(form)) {
    form.errorMessage = "Tittel og dato må være fyllt inn.";
    updateView();
    return;
  }

  const note = findObjectById(model.data.notes, form.noteId);

  if (!note) {
    model.app.currentPage = "notesPage";
    updateView();
    return;
  }

  note.title = form.title.trim();
  note.date = form.date;
  note.description = form.description;
  note.topics = form.topics.slice();
  note.updatedAt = getTimestamp();

  desktopClearNoteForm(model.viewState.editNotePage);
  model.viewState.editNotePage.noteId = null;

  model.viewState.noteViewPage.noteId = note.id;

  model.app.currentPage = "noteViewPage";
  updateView();
}

function desktopCancelNoteForm(pageName) {
  const form = model.viewState[pageName];

  desktopClearNoteForm(form);

  if (pageName === "editNotePage") {
    /* Vi blir stående på notatet vi kom fra, hvis det fortsatt finnes. */
    if (findObjectById(model.data.notes, form.noteId)) {
      model.viewState.noteViewPage.noteId = form.noteId;
      model.app.currentPage = "noteViewPage";
    } else {
      model.app.currentPage = "notesPage";
    }
  } else {
    model.app.currentPage = "notesPage";
  }

  updateView();
}

function desktopEditNote(noteId) {
  const note = findObjectById(model.data.notes, noteId);

  if (!note) {
    return;
  }

  const editNotePage = model.viewState.editNotePage;

  editNotePage.noteId = note.id;
  editNotePage.title = note.title;
  editNotePage.date = note.date;
  editNotePage.description = note.description;
  editNotePage.topics = note.topics.slice();

  model.viewState.noteViewPage.isMenuOpen = false;

  model.app.currentPage = "editNotePage";
  updateView();
}

function desktopToggleNoteMenu() {
  const noteView = model.viewState.noteViewPage;

  noteView.isMenuOpen = !noteView.isMenuOpen;
  updateView();
}

function desktopAskDeleteNote() {
  const noteView = model.viewState.noteViewPage;

  noteView.isMenuOpen = false;
  noteView.isDeleteDialogOpen = true;
  updateView();
}

function desktopCancelDeleteNote() {
  const noteView = model.viewState.noteViewPage;

  noteView.isDeleteDialogOpen = false;
  updateView();
}

function desktopConfirmDeleteNote() {
  const noteView = model.viewState.noteViewPage;
  const note = findObjectById(model.data.notes, noteView.noteId);

  if (!note) {
    noteView.isDeleteDialogOpen = false;
    updateView();
    return;
  }

  const index = findIndexById(model.data.notes, note.id);

  if (index !== -1) {
    model.data.notes.splice(index, 1);
  }

  noteView.noteId = null;
  noteView.isDeleteDialogOpen = false;

  model.app.currentPage = "notesPage";
  updateView();
}

function desktopDuplicateNote() {
  const noteView = model.viewState.noteViewPage;
  const note = findObjectById(model.data.notes, noteView.noteId);

  if (!note) {
    return;
  }

  const newNoteId = getNextId(model.data.notes);
  const newNote = {
    id: newNoteId,
    title: note.title + " (kopi)",
    date: note.date,
    description: note.description,
    topics: note.topics.slice(),
    updatedAt: getTimestamp(),
  };

  model.data.notes.push(newNote);

  noteView.noteId = newNote.id;
  noteView.isMenuOpen = false;

  updateView();
}

/* Slår en emneknagg av og på i det skjemaet vi står i. */
function desktopToggleTopic(topicId, pageName) {
  const topics = model.viewState[pageName].topics;

  for (let i = 0; i < topics.length; i++) {
    if (topics[i] === topicId) {
      topics.splice(i, 1);
      updateView();
      return;
    }
  }

  topics.push(topicId);
  updateView();
}

/* ==========================================================================
   Søk
   ========================================================================== */

/* Treffene regnes ut når siden tegnes, så vi trenger bare å tegne siden
   på nytt når filteret er endret. */
function desktopRunSearch() {
  updateView();
}

/* Endrer et filter i søket. Aktivitet og emneknagg er id-er, sesong er
   navnet på sesongen. */
function desktopSetSearchFilter(fieldName, value) {
  const search = model.viewState.searchPage;

  if (fieldName === "season") {
    search.season = value ? value : null;
  } else {
    search[fieldName] = value ? Number(value) : null;
  }

  desktopRunSearch();
}

function desktopSetSortOrder(sortOrder) {
  model.viewState.searchPage.sortOrder = sortOrder;

  desktopRunSearch();
}

/* ==========================================================================
   Innstillinger
   ========================================================================== */

/* Aktiviteter, emneknagger og fylker ligger i modellen, og blir endret
   direkte der. En aktivitet eller et fylke som brukes av en tur, og en
   emneknagg som brukes av et notat, kan ikke slettes. */
function desktopAddActivity() {
  const settings = model.viewState.settingsPage;
  const name = desktopGetNewName(
    settings.newActivity,
    model.data.activities,
    "activity",
    "Aktiviteten",
  );

  if (name === null) {
    updateView();
    return;
  }

  model.data.activities.push({
    id: getNextId(model.data.activities),
    activity: name,
  });

  settings.newActivity = "";
  settings.errorMessage = "";

  updateView();
}

function desktopRemoveActivity(activityId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.activities, activityId);

  if (index === -1) {
    return;
  }

  /* En aktivitet som brukes av en tur, kan ikke slettes. Da ville turen
     stått igjen med en aktivitet som ikke finnes. */
  if (desktopIsActivityInUse(activityId)) {
    settings.errorMessage =
      "Aktiviteten er brukt av en tur, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.activities.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

function desktopAddTopic() {
  const settings = model.viewState.settingsPage;
  const name = desktopGetNewName(
    settings.newTopic,
    model.data.topics,
    "topic",
    "Emneknaggen",
  );

  if (name === null) {
    updateView();
    return;
  }

  model.data.topics.push({
    id: getNextId(model.data.topics),
    topic: name,
  });

  settings.newTopic = "";
  settings.errorMessage = "";

  updateView();
}

function desktopRemoveTopic(topicId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.topics, topicId);

  if (index === -1) {
    return;
  }

  /* En emneknagg som brukes av et notat, kan ikke slettes. */
  if (desktopIsTopicInUse(topicId)) {
    settings.errorMessage =
      "Emneknaggen er brukt av et notat, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.topics.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

function desktopAddCounty() {
  const settings = model.viewState.settingsPage;
  const name = desktopGetNewName(
    settings.newCounty,
    model.data.counties,
    "county",
    "Fylket",
  );

  if (name === null) {
    updateView();
    return;
  }

  model.data.counties.push({
    id: getNextId(model.data.counties),
    county: name,
  });

  settings.newCounty = "";
  settings.errorMessage = "";

  updateView();
}

function desktopRemoveCounty(countyId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.counties, countyId);

  if (index === -1) {
    return;
  }

  /* Et fylke som brukes av en tur, kan ikke slettes. */
  if (desktopIsCountyInUse(countyId)) {
    settings.errorMessage = "Fylket er brukt av en tur, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.counties.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

/* ==========================================================================
   Hjelpere
   ========================================================================== */

/* Et tur-skjema er gyldig når tittel og dato er fyllt inn. */
function desktopIsTripFormValid(form) {
  return form.title.trim() !== "" && form.date !== "" && form.date !== null;
}

/* Et notat-skjema er gyldig når tittel og dato er fyllt inn. */
function desktopIsNoteFormValid(form) {
  return form.title.trim() !== "" && form.date !== "" && form.date !== null;
}

/* Tømmer et tur-skjema, slik at et halvutfylt skjema ikke ligger igjen
   neste gang siden åpnes. */
function desktopClearTripForm(form) {
  form.activityId = null;
  form.title = "";
  form.location = "";
  form.date = "";
  form.countyId = null;
  form.description = "";
  form.pictures = [];
  form.errorMessage = "";
}

/* Tømmer et notat-skjema. */
function desktopClearNoteForm(form) {
  form.title = "";
  form.date = "";
  form.description = "";
  form.topics = [];
  form.errorMessage = "";
}

/* Legger til et bilde i skjemaet. Bildet ligger i model.data.images, men det
   står ikke i noen tur sin pictures-liste ennå. */
function desktopAddPictureToForm(form) {
  const pictureId = getNextId(model.data.images);

  model.data.images.push({
    id: pictureId,
    templateId: desktopGetNextTemplateId(form.pictures.length),
  });

  form.pictures.push(pictureId);
}

/* Motivene går i runde, slik at en tur ikke får samme motiv to ganger på rad. */
function desktopGetNextTemplateId(pictureCount) {
  const templates = model.data.imageTemplates;

  return templates[pictureCount % templates.length].id;
}

/* Fjerner ett bilde fra skjemaet. Et bilde som ikke hører til noen tur,
   slettes også, slik at vi ikke lar ubrukte bilder ligge i modellen. */
function desktopRemovePictureFromForm(form, pictureId) {
  const index = form.pictures.indexOf(pictureId);

  if (index !== -1) {
    form.pictures.splice(index, 1);
  }

  if (!desktopIsImageUsedByTrip(pictureId)) {
    desktopRemoveImageById(pictureId);
  }
}

/* Knytter bildene i skjemaet til turen, og sletter bilder som hørte til turen,
   men som ikke er med i skjemaet lenger. */
function desktopLinkPicturesToTrip(pictureIds, tripId) {
  const trip = findObjectById(model.data.trips, tripId);

  if (!trip) {
    return;
  }

  const oldPictureIds = trip.pictures.slice();

  trip.pictures = pictureIds.slice();

  for (const pictureId of oldPictureIds) {
    if (pictureIds.includes(pictureId)) {
      continue;
    }

    if (!desktopIsImageUsedByTrip(pictureId)) {
      desktopRemoveImageById(pictureId);
    }
  }
}

/* Sletter bilder som ble lagt til i skjemaet, men som aldri ble lagret.
   Kalles når brukeren avbryter. */
function desktopDeleteUnsavedPictures(form) {
  for (const pictureId of form.pictures) {
    if (!desktopIsImageUsedByTrip(pictureId)) {
      desktopRemoveImageById(pictureId);
    }
  }
}

/* Sletter bildene som hører til en tur. Turen skal være fjernet fra modellen
   først, slik at vi ikke teller turen selv. Et bilde som også brukes av en
   annen tur, blir beholdt. */
function desktopDeleteImagesForTrip(trip) {
  for (const pictureId of trip.pictures) {
    if (!desktopIsImageUsedByTrip(pictureId)) {
      desktopRemoveImageById(pictureId);
    }
  }
}

/* Lager nye bildeobjekter for kopien, og gir turen de nye id-ene. Bildene
   kopieres ikke, slik at originalen og kopien kan endres hver for seg. */
function desktopDuplicateImagesForTrip(trip) {
  const pictureIds = [];

  for (const pictureId of trip.pictures) {
    const image = findObjectById(model.data.images, pictureId);

    if (!image) {
      continue;
    }

    const newImage = {
      id: getNextId(model.data.images),
      templateId: image.templateId,
    };

    model.data.images.push(newImage);
    pictureIds.push(newImage.id);
  }

  return pictureIds;
}

/* Sjekker om et bilde hører til noen tur. Bildene på en tur står i turens
   pictures-liste, så det er den som sier hvem som hører til hverandre. */
function desktopIsImageUsedByTrip(pictureId) {
  for (const trip of model.data.trips) {
    if (trip.pictures.includes(pictureId)) {
      return true;
    }
  }

  return false;
}

/* Sletter ett bilde fra model.data.images. */
function desktopRemoveImageById(pictureId) {
  const index = findIndexById(model.data.images, pictureId);

  if (index !== -1) {
    model.data.images.splice(index, 1);
  }
}

/* Sjekker navnet på det som skal legges til. Gir tilbake navnet hvis det er
   bra, eller null hvis navnet er tomt eller finnes fra før. */
function desktopGetNewName(name, list, keyName, label) {
  const settings = model.viewState.settingsPage;
  /* Feltet er null helt til brukeren skriver noe, så vi må tåle både null
     og en tom tekst. */
  const trimmedName = name ? name.trim() : "";

  if (trimmedName === "") {
    settings.errorMessage = "Navnet kan ikke være tomt.";
    return null;
  }

  if (desktopIsNameAlreadyUsed(list, keyName, trimmedName)) {
    settings.errorMessage = label + " «" + trimmedName + "» finnes allerede.";
    return null;
  }

  settings.errorMessage = "";

  return trimmedName;
}

/* Sjekker om navnet finnes i listen fra før. Vi ser etter likt navn,
   uansett store og små bokstaver. */
function desktopIsNameAlreadyUsed(list, keyName, name) {
  const lowerName = name.toLowerCase();

  for (const item of list) {
    if (item[keyName].toLowerCase() === lowerName) {
      return true;
    }
  }

  return false;
}

/* Sjekker om en tur bruker aktiviteten. */
function desktopIsActivityInUse(activityId) {
  for (const trip of model.data.trips) {
    if (trip.activityId === activityId) {
      return true;
    }
  }

  return false;
}

/* Sjekker om et notat bruker emneknaggen. */
function desktopIsTopicInUse(topicId) {
  for (const note of model.data.notes) {
    if (note.topics.includes(topicId)) {
      return true;
    }
  }

  return false;
}

/* Sjekker om en tur bruker fylket. */
function desktopIsCountyInUse(countyId) {
  for (const trip of model.data.trips) {
    if (trip.countyId === countyId) {
      return true;
    }
  }

  return false;
}
