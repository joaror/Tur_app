/* ==========================================================================
   tripsPageController.js – Controller for turlisten (startsiden)

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
    model.viewState.tripViewPage.tripId = trip.id;

    model.app.currentPage = "tripViewPage";
    updateView();
}

function startNewTrip() {
    const newTrip = model.viewState.newTripPage;

    newTrip.activityId = null;
    newTrip.title = "";
    newTrip.location = "";
    newTrip.date = null;
    newTrip.countyId = null;
    newTrip.description = "";
    newTrip.pictures = [];

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