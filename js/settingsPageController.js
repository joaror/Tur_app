/* ==========================================================================
   settingsPageController.js – Controller for innstillingssiden.

   Controller håndterer brukerhandlinger og endrer modellen.
   Controller bygger ikke HTML. Etter hver endring kalles updateView().

   Aktiviteter, emneknagger og fylker ligger i modellen, og blir endret
   direkte der. En aktivitet eller et fylke som brukes av en tur, og en
   emneknagg som brukes av et notat, kan ikke slettes.

   Funksjoner:
     addActivity()      // Legger til en ny aktivitet
     removeActivity(id) // Sletter en aktivitet
     addTopic()         // Legger til en ny emneknagg
     removeTopic(id)    // Sletter en emneknagg
     addCounty()        // Legger til et nytt fylke
     removeCounty(id)   // Sletter et fylke

     getNewName(name, list, keyName, label) // sjekker navnet på det som skal legges til
     isNameAlreadyUsed(list, keyName, name) // sjekker om navnet finnes fra før
     isActivityInUse(activityId)            // sjekker om en tur bruker aktiviteten
     isTopicInUse(topicId)                  // sjekker om et notat bruker emneknaggen
     isCountyInUse(countyId)                // sjekker om en tur bruker fylket
   ========================================================================== */

function addActivity() {
  const settings = model.viewState.settingsPage;
  const name = getNewName(
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

function removeActivity(activityId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.activities, activityId);

  if (index === -1) {
    return;
  }

  /* En aktivitet som brukes av en tur, kan ikke slettes. Da ville turen
     stått igjen med en aktivitet som ikke finnes. */
  if (isActivityInUse(activityId)) {
    settings.errorMessage =
      "Aktiviteten er brukt av en tur, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.activities.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

function addTopic() {
  const settings = model.viewState.settingsPage;
  const name = getNewName(
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

function removeTopic(topicId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.topics, topicId);

  if (index === -1) {
    return;
  }

  /* En emneknagg som brukes av et notat, kan ikke slettes. */
  if (isTopicInUse(topicId)) {
    settings.errorMessage =
      "Emneknaggen er brukt av et notat, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.topics.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

function addCounty() {
  const settings = model.viewState.settingsPage;
  const name = getNewName(
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

function removeCounty(countyId) {
  const settings = model.viewState.settingsPage;
  const index = findIndexById(model.data.counties, countyId);

  if (index === -1) {
    return;
  }

  /* Et fylke som brukes av en tur, kan ikke slettes. */
  if (isCountyInUse(countyId)) {
    settings.errorMessage = "Fylket er brukt av en tur, og kan ikke slettes.";
    updateView();
    return;
  }

  model.data.counties.splice(index, 1);

  settings.errorMessage = "";

  updateView();
}

/* Sjekker navnet på det som skal legges til. Gir tilbake navnet hvis det
   er bra, eller null hvis navnet er tomt eller finnes fra før. */
function getNewName(name, list, keyName, label) {
  const settings = model.viewState.settingsPage;
  /* Feltet er null helt til brukeren skriver noe, så vi må tåle
     både null og en tom tekst. */
  const trimmedName = name ? name.trim() : "";

  if (trimmedName === "") {
    settings.errorMessage = "Navnet kan ikke være tomt.";
    return null;
  }

  if (isNameAlreadyUsed(list, keyName, trimmedName)) {
    settings.errorMessage = label + " «" + trimmedName + "» finnes allerede.";
    return null;
  }

  settings.errorMessage = "";

  return trimmedName;
}

/* Sjekker om navnet finnes i listen fra før. Vi ser etter likt navn,
   uansett store og små bokstaver. */
function isNameAlreadyUsed(list, keyName, name) {
  const lowerName = name.toLowerCase();

  for (const item of list) {
    if (item[keyName].toLowerCase() === lowerName) {
      return true;
    }
  }

  return false;
}

/* Sjekker om en tur bruker aktiviteten. */
function isActivityInUse(activityId) {
  for (const trip of model.data.trips) {
    if (trip.activityId === activityId) {
      return true;
    }
  }

  return false;
}

/* Sjekker om et notat bruker emneknaggen. */
function isTopicInUse(topicId) {
  for (const note of model.data.notes) {
    if (note.topics.includes(topicId)) {
      return true;
    }
  }

  return false;
}

/* Sjekker om en tur bruker fylket. */
function isCountyInUse(countyId) {
  for (const trip of model.data.trips) {
    if (trip.countyId === countyId) {
      return true;
    }
  }

  return false;
}
