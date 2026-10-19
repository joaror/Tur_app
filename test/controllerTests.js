/* ==========================================================================
   controllerTests.js – QUnit-tester for loginPageController.js og
                        tripsPageController.js

   Vi tester controller-logikken ved å kontrollere hvordan modellen endres,
   slik retningslinjene sier. Viewet tegnes ikke i disse testene: updateView()
   er erstattet med en teller, slik at vi kan telle hvor mange ganger
   controlleren ber om ny HTML uten å være avhengig av de andre sidene.
   ========================================================================== */

/* Antall ganger updateView() har blitt kalt siden siste reset. */
let updateViewCallCount = 0;

/* Setter loginPage tilbake til utgangspunktet før hver test. */
function resetLoginTest() {
    model.app.currentPage = "loginPage";
    model.viewState.loginPage.userInput = "";
    model.viewState.loginPage.passwordInput = "";
    model.viewState.loginPage.isPasswordVisible = false;
    model.viewState.loginPage.errorMessage = "";
    updateViewCallCount = 0;
}

/* Kort hjelp: sett brukerens innskrevne data. */
function fillLoginTest(userInput, passwordInput) {
    model.viewState.loginPage.userInput = userInput;
    model.viewState.loginPage.passwordInput = passwordInput;
}

QUnit.module("handleLogin", function () {
    QUnit.test("tomt e-postfelt gir feilmelding", function (assert) {
        resetLoginTest();
        fillLoginTest("", "hemmelig");

        const result = handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "errorMessage er satt",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
        assert.equal(result, false, "skjemaet ble ikke sendt");
    });

    QUnit.test("tomt passordfelt gir feilmelding", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "");

        handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "errorMessage er satt",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });

    QUnit.test("kun mellomrom teller som tomt", function (assert) {
        resetLoginTest();
        fillLoginTest("   ", "hemmelig");

        handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "mellomrom er trimmet bort før sjekken",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });

    QUnit.test("begge felt fylt logger inn", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");

        const result = handleLogin();

        assert.equal(model.app.currentPage, "tripsPage", "vi går til turer");
        assert.equal(model.viewState.loginPage.errorMessage, "", "ingen feilmelding");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
        assert.equal(result, false, "skjemaet ble ikke sendt");
    });

    QUnit.test("innlogging nullstiller passord og øyevisning", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");
        model.viewState.loginPage.isPasswordVisible = true;

        handleLogin();

        assert.equal(model.viewState.loginPage.passwordInput, "", "passordet er tømt");
        assert.equal(model.viewState.loginPage.isPasswordVisible, false, "passordet er skjult");
        assert.equal(
            model.viewState.loginPage.userInput,
            "terje@example.no",
            "e-posten beholdes, så brukeren slipper skrive den igjen",
        );
    });

    QUnit.test("tidligere feilmelding fjernes ved vellykket innlogging", function (assert) {
        resetLoginTest();
        fillLoginTest("", "");
        handleLogin();
        assert.notEqual(model.viewState.loginPage.errorMessage, "", "først er det en feil");

        fillLoginTest("terje@example.no", "hemmelig");
        handleLogin();

        assert.equal(model.viewState.loginPage.errorMessage, "", "meldingen er borte");
    });
});

QUnit.module("togglePasswordVisibility", function () {
    QUnit.test("skjult passord blir synlig", function (assert) {
        resetLoginTest();

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            true,
            "isPasswordVisible er true",
        );
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("synlig passord blir skjult", function (assert) {
        resetLoginTest();
        model.viewState.loginPage.isPasswordVisible = true;

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            false,
            "isPasswordVisible er false",
        );
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("to trykk gir tilbake til start", function (assert) {
        resetLoginTest();

        togglePasswordVisibility();
        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            false,
            "isPasswordVisible er false igjen",
        );
        assert.equal(updateViewCallCount, 2, "updateView ble kalt to ganger");
    });

    QUnit.test("funksjonen endrer ikke passordet", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.passwordInput,
            "hemmelig",
            "passordet står uendret",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });
});

/* ==========================================================================
   Tester for tripsPageController.js

   Tur-controlleren endrer både domenedata (model.data.trips og
   model.data.images) og view state. Derfor tar resetTripTest() et
   bilde av utgangspunktet før første test, og legger alt tilbake
   før hver test. Slik kan testene regne med de samme fem turene
   og de samme elleve bildene hver gang, uansett hva de gjør.
   ========================================================================== */

let tripTestSnapshot = null;

/* Setter tursidene tilbake til utgangspunktet før hver test. */
function resetTripTest() {
    if (tripTestSnapshot === null) {
        tripTestSnapshot = {
            trips: JSON.parse(JSON.stringify(model.data.trips)),
            images: JSON.parse(JSON.stringify(model.data.images)),
            newTripPage: JSON.parse(JSON.stringify(model.viewState.newTripPage)),
            editTripPage: JSON.parse(JSON.stringify(model.viewState.editTripPage)),
            tripViewPage: JSON.parse(JSON.stringify(model.viewState.tripViewPage)),
            currentPage: model.app.currentPage,
        };
    }

    model.data.trips = JSON.parse(JSON.stringify(tripTestSnapshot.trips));
    model.data.images = JSON.parse(JSON.stringify(tripTestSnapshot.images));

    copyNewTripForm(model.viewState.newTripPage, tripTestSnapshot.newTripPage);
    copyEditTripForm(model.viewState.editTripPage, tripTestSnapshot.editTripPage);
    copyTripViewState(model.viewState.tripViewPage, tripTestSnapshot.tripViewPage);

    model.app.currentPage = tripTestSnapshot.currentPage;
    updateViewCallCount = 0;
}

/* Kopierer skjemaet for ny tur. Vi lister feltene eksplisitt, fordi
   Object.assign() ikke er en del av verktøykassen. */
function copyNewTripForm(form, values) {
    form.activityId = values.activityId;
    form.title = values.title;
    form.location = values.location;
    form.date = values.date;
    form.countyId = values.countyId;
    form.description = values.description;
    form.pictures = values.pictures;
    form.errorMessage = values.errorMessage;
}

/* Kopierer skjemaet for redigering. */
function copyEditTripForm(form, values) {
    form.tripId = values.tripId;
    form.activityId = values.activityId;
    form.title = values.title;
    form.location = values.location;
    form.date = values.date;
    form.countyId = values.countyId;
    form.description = values.description;
    form.pictures = values.pictures;
    form.errorMessage = values.errorMessage;
}

/* Kopierer view state for turvisningen. */
function copyTripViewState(viewState, values) {
    viewState.tripId = values.tripId;
    viewState.pageNumber = values.pageNumber;
    viewState.isMenuOpen = values.isMenuOpen;
    viewState.isDeleteDialogOpen = values.isDeleteDialogOpen;
}

/* En tur til å bruke i testene. Feltene kan overstyres. */
function createTestTrip(overrides) {
    const trip = {
        id: 900,
        activityId: 3,
        title: "Testtur",
        location: "Teststed",
        date: "2026-05-05",
        countyId: 2,
        pictures: [],
        description: "En tur laget av en test.",
    };

    if (!overrides) {
        return trip;
    }

    if (overrides.id !== undefined) { trip.id = overrides.id; }
    if (overrides.activityId !== undefined) { trip.activityId = overrides.activityId; }
    if (overrides.title !== undefined) { trip.title = overrides.title; }
    if (overrides.location !== undefined) { trip.location = overrides.location; }
    if (overrides.date !== undefined) { trip.date = overrides.date; }
    if (overrides.countyId !== undefined) { trip.countyId = overrides.countyId; }
    if (overrides.pictures !== undefined) { trip.pictures = overrides.pictures; }
    if (overrides.description !== undefined) { trip.description = overrides.description; }

    return trip;
}

/* Et bilde til å bruke i testene. Et bilde hører til en tur når
   turens pictures-liste inneholder bildets id. */
function createTestImage(id, templateId) {
    return { id: id, templateId: templateId };
}

/* Legger inn en tur i modellen og åpner den. */
function openTestTrip(overrides) {
    const trip = createTestTrip(overrides);

    model.data.trips.push(trip);
    updateViewCallCount = 0;
    openTrip(trip.id);

    return trip;
}

/* Standardverdiene for skjemaet for ny tur. */
const NEW_TRIP_FORM_VALUES = {
    activityId: 4,
    title: "Ny testtur",
    location: "Nytt teststed",
    date: "2026-06-01",
    countyId: 1,
    description: "Kort om turen.",
    pictures: [],
};

/* Standardverdiene for skjemaet for redigering av en tur. */
const EDIT_TRIP_FORM_VALUES = {
    tripId: 1,
    activityId: 4,
    title: "Endret tittel",
    location: "Endret sted",
    date: "2026-06-02",
    countyId: 3,
    description: "Endret beskrivelse.",
    pictures: [],
};

/* Legger verdier inn i et skjema. Bare feltene som er satt, blir
   endret. Vi lister feltene eksplisitt, fordi Object.assign() ikke
   er en del av verktøykassen. */
function setFormValues(form, values) {
    if (values.tripId !== undefined) { form.tripId = values.tripId; }
    if (values.activityId !== undefined) { form.activityId = values.activityId; }
    if (values.title !== undefined) { form.title = values.title; }
    if (values.location !== undefined) { form.location = values.location; }
    if (values.date !== undefined) { form.date = values.date; }
    if (values.countyId !== undefined) { form.countyId = values.countyId; }
    if (values.description !== undefined) { form.description = values.description; }
    if (values.pictures !== undefined) { form.pictures = values.pictures; }
}

/* Fyller inn skjemaet for ny tur. */
function fillNewTripForm(values) {
    setFormValues(model.viewState.newTripPage, NEW_TRIP_FORM_VALUES);
    setFormValues(model.viewState.newTripPage, values || {});
}

/* Fyller inn skjemaet for redigering av en tur. */
function fillEditTripForm(values) {
    setFormValues(model.viewState.editTripPage, EDIT_TRIP_FORM_VALUES);
    setFormValues(model.viewState.editTripPage, values || {});
}

QUnit.module("openTrip", function () {
    QUnit.test("åpner turen og nullstiller visningen", function (assert) {
        resetTripTest();
        openTrip(2);

        const tripView = model.viewState.tripViewPage;

        assert.equal(model.app.currentPage, "tripViewPage", "vi er i turvisningen");
        assert.equal(tripView.tripId, 2, "turen er åpnet");
        assert.equal(tripView.pageNumber, 0, "vi starter på første bildeside");
        assert.equal(tripView.isMenuOpen, false, "menyen er lukket");
        assert.equal(tripView.isDeleteDialogOpen, false, "slettedialogen er lukket");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("lukket meny og åpen dialog nullstilles", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.isMenuOpen = true;
        model.viewState.tripViewPage.isDeleteDialogOpen = true;
        model.viewState.tripViewPage.pageNumber = 2;

        openTrip(3);

        assert.equal(model.viewState.tripViewPage.isMenuOpen, false, "menyen er lukket");
        assert.equal(model.viewState.tripViewPage.isDeleteDialogOpen, false, "dialogen er lukket");
        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi er tilbake på første side");
    });

    QUnit.test("ukjent tur gir ingen endring", function (assert) {
        resetTripTest();
        model.app.currentPage = "tripsPage";

        openTrip(999);

        assert.equal(model.app.currentPage, "tripsPage", "vi blir på turlisten");
        assert.equal(model.viewState.tripViewPage.tripId, null, "ingen tur er åpnet");
        assert.equal(updateViewCallCount, 0, "updateView ble ikke kalt");
    });
});

QUnit.module("startNewTrip", function () {
    QUnit.test("går til skjemaet og tømmer det", function (assert) {
        resetTripTest();
        fillNewTripForm();

        startNewTrip();

        const form = model.viewState.newTripPage;

        assert.equal(model.app.currentPage, "newTripPage", "vi er i nytturskjemaet");
        assert.equal(form.title, "", "tittelen er tømt");
        assert.equal(form.date, "", "datoen er tømt");
        assert.equal(form.pictures.length, 0, "bildene er tømt");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("rører ikke turene", function (assert) {
        resetTripTest();
        const antallTurerFoer = model.data.trips.length;

        startNewTrip();

        assert.equal(model.data.trips.length, antallTurerFoer, "ingen tur ble laget");
    });
});

QUnit.module("goToPage", function () {
    QUnit.test("bytter side", function (assert) {
        resetTripTest();
        model.app.currentPage = "tripsPage";

        goToPage("notesPage");

        assert.equal(model.app.currentPage, "notesPage", "vi er på notatsiden");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("samme side tegner ikke på nytt", function (assert) {
        resetTripTest();
        model.app.currentPage = "tripsPage";

        goToPage("tripsPage");

        assert.equal(updateViewCallCount, 0, "updateView ble ikke kalt");
    });
});

QUnit.module("toggleTripMenu", function () {
    QUnit.test("lukket meny blir åpen", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.isMenuOpen = false;

        toggleTripMenu();

        assert.equal(model.viewState.tripViewPage.isMenuOpen, true, "menyen er åpen");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("to trykk gir tilbake til lukket", function (assert) {
        resetTripTest();

        toggleTripMenu();
        toggleTripMenu();

        assert.equal(model.viewState.tripViewPage.isMenuOpen, false, "menyen er lukket igjen");
        assert.equal(updateViewCallCount, 2, "updateView ble kalt to ganger");
    });
});

QUnit.module("askDeleteTrip", function () {
    QUnit.test("lukker menyen og viser dialogen", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.isMenuOpen = true;
        model.viewState.tripViewPage.isDeleteDialogOpen = false;

        askDeleteTrip();

        assert.equal(model.viewState.tripViewPage.isMenuOpen, false, "menyen er lukket");
        assert.equal(model.viewState.tripViewPage.isDeleteDialogOpen, true, "dialogen er åpen");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("turen beholdes", function (assert) {
        resetTripTest();
        const antallTurerFoer = model.data.trips.length;

        askDeleteTrip();

        assert.equal(model.data.trips.length, antallTurerFoer, "ingen tur ble slettet");
    });
});

QUnit.module("cancelDeleteTrip", function () {
    QUnit.test("lukker dialogen og beholder turen", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 2;
        model.viewState.tripViewPage.isDeleteDialogOpen = true;
        updateViewCallCount = 0;

        cancelDeleteTrip();

        assert.equal(model.viewState.tripViewPage.isDeleteDialogOpen, false, "dialogen er lukket");
        assert.notEqual(findObjectById(model.data.trips, 2), null, "turen finnes fortsatt");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });
});

QUnit.module("confirmDeleteTrip", function () {
    QUnit.test("sletter turen og bildene dens", function (assert) {
        resetTripTest();
        /* Tur 2 har bildene 4 og 5. Bildene 6, 7 og 8 hører til
           andre turer, og skal bli beholdt. */
        model.viewState.tripViewPage.tripId = 2;

        confirmDeleteTrip();

        assert.equal(findObjectById(model.data.trips, 2), null, "turen er borte");
        assert.equal(model.data.trips.length, 4, "fire turer igjen");
        assert.equal(findImageById(4), null, "bilde 4 er borte");
        assert.equal(findImageById(5), null, "bilde 5 er borte");
        assert.notEqual(findImageById(6), null, "bilde 6 til en annen tur er beholdt");
    });

    QUnit.test("går tilbake til turlisten", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 2;

        confirmDeleteTrip();

        assert.equal(model.app.currentPage, "tripsPage", "vi er på turlisten");
        assert.equal(model.viewState.tripViewPage.tripId, null, "ingen tur er åpen");
        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi er på første bildeside");
        assert.equal(model.viewState.tripViewPage.isDeleteDialogOpen, false, "dialogen er lukket");
    });

    QUnit.test("bilder til andre turer blir beholdt", function (assert) {
        resetTripTest();
        model.data.trips.push(createTestTrip({ id: 900, pictures: [90] }));
        model.data.trips.push(createTestTrip({ id: 901, pictures: [91] }));
        model.data.images.push(createTestImage(90, 1));
        model.data.images.push(createTestImage(91, 1));
        model.viewState.tripViewPage.tripId = 900;

        confirmDeleteTrip();

        assert.equal(findImageById(90), null, "bildet på turen er slettet");
        assert.notEqual(findImageById(91), null, "bildet til en annen tur er beholdt");
        assert.notEqual(findImageById(1), null, "de opprinnelige bildene er beholdt");
    });

    QUnit.test("bilder som ikke hører til turen blir beholdt", function (assert) {
        /* Tur 2 har bildene 4 og 5. Bildene 1 og 3 hører til tur 1,
           og skal bli beholdt når tur 2 slettes. */
        resetTripTest();
        model.viewState.tripViewPage.tripId = 2;

        confirmDeleteTrip();

        assert.notEqual(findImageById(1), null, "bilde 1 hører til tur 1");
        assert.notEqual(findImageById(3), null, "bilde 3 hører til tur 1");
    });

    QUnit.test("ukjent tur sletter ingenting", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 999;
        model.viewState.tripViewPage.isDeleteDialogOpen = true;

        confirmDeleteTrip();

        assert.equal(model.data.trips.length, 5, "alle turer er beholdt");
        assert.equal(model.viewState.tripViewPage.isDeleteDialogOpen, false, "dialogen er lukket");
    });
});

QUnit.module("duplicateTrip", function () {
    QUnit.test("lager en kopi med ny id", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 3;
        model.data.trips.push(createTestTrip({ id: 6 }));
        model.data.trips.push(createTestTrip({ id: 7 }));

        const antallTurerFoer = model.data.trips.length;
        const original = findObjectById(model.data.trips, 3);

        duplicateTrip();

        const kopi = findObjectById(model.data.trips, model.viewState.tripViewPage.tripId);

        assert.equal(model.data.trips.length, antallTurerFoer + 1, "én tur ble laget");
        assert.equal(kopi.id, 8, "kopien fikk neste ledige id");
        assert.equal(kopi.title, original.title + " (kopi)", "tittelen får (kopi)");
        assert.equal(kopi.activityId, original.activityId, "aktiviteten er kopiert");
        assert.equal(kopi.date, original.date, "datoen er kopiert");
        assert.equal(original.title, "Bærtur til Holtet", "originalen er ikke endret");
    });

    QUnit.test("kopien får egne bilder", function (assert) {
        resetTripTest();
        model.data.trips.push(createTestTrip({ id: 900, pictures: [90] }));
        model.data.images.push(createTestImage(90, 1));
        model.viewState.tripViewPage.tripId = 900;

        duplicateTrip();

        const kopi = findObjectById(model.data.trips, 901);

        assert.equal(kopi.pictures.length, 1, "kopien fikk ett bilde");
        assert.notEqual(kopi.pictures[0], 90, "kopien peker på et nytt bilde");
        assert.notEqual(findImageById(90), null, "originalens bilde er ikke flyttet");
        assert.notEqual(findImageById(kopi.pictures[0]), null, "kopien har sitt eget bilde");
        assert.equal(findImageById(kopi.pictures[0]).templateId, 1, "motivet er kopiert");
    });

    QUnit.test("kopien åpnes og visningen nullstilles", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 3;
        model.viewState.tripViewPage.isMenuOpen = true;
        model.viewState.tripViewPage.pageNumber = 1;

        duplicateTrip();

        assert.notEqual(model.viewState.tripViewPage.tripId, 3, "vi står på kopien");
        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi starter på første side");
        assert.equal(model.viewState.tripViewPage.isMenuOpen, false, "menyen er lukket");
    });

    QUnit.test("turer uten bilder kopieres uten bilder", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 5;

        duplicateTrip();

        const kopi = findObjectById(model.data.trips, model.viewState.tripViewPage.tripId);

        assert.equal(kopi.pictures.length, 0, "kopien har ingen bilder");
    });

    QUnit.test("ukjent tur lager ingen kopi", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 999;

        duplicateTrip();

        assert.equal(model.data.trips.length, 5, "alle turer er beholdt");
        assert.equal(updateViewCallCount, 0, "updateView ble ikke kalt");
    });
});

QUnit.module("editTrip", function () {
    QUnit.test("fyller skjemaet med verdiene fra turen", function (assert) {
        resetTripTest();

        editTrip(2);

        const form = model.viewState.editTripPage;

        assert.equal(model.app.currentPage, "editTripPage", "vi er i redigeringsskjemaet");
        assert.equal(form.tripId, 2, "skjemaet vet hvilken tur det er");
        assert.equal(form.activityId, 7, "aktiviteten er hentet");
        assert.equal(form.title, "Sykkeltur til Fjellheia", "tittelen er hentet");
        assert.equal(form.location, "Fjellheia", "stedet er hentet");
        assert.equal(form.date, "2026-10-01", "datoen er hentet");
        assert.equal(form.countyId, 5, "fylket er hentet");
    });

    QUnit.test("skjemaet får en egen liste av bildene", function (assert) {
        resetTripTest();

        editTrip(2);

        const form = model.viewState.editTripPage;
        const tur = findObjectById(model.data.trips, 2);

        assert.deepEqual(form.pictures, tur.pictures, "bildene er de samme i første omgang");
        assert.notStrictEqual(form.pictures, tur.pictures, "listen er en kopi, ikke samme objekt");
    });

    QUnit.test("menyen lukkes", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.isMenuOpen = true;

        editTrip(1);

        assert.equal(model.viewState.tripViewPage.isMenuOpen, false, "menyen er lukket");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("endringene i skjemaet rører ikke turen", function (assert) {
        resetTripTest();

        editTrip(2);
        model.viewState.editTripPage.title = "Tittel brukeren har endret";
        model.viewState.editTripPage.pictures = [];

        assert.equal(findObjectById(model.data.trips, 2).title, "Sykkeltur til Fjellheia", "turen er uendret");
        assert.equal(findObjectById(model.data.trips, 2).pictures.length, 2, "turen har fortsatt bildene sine");
    });

    QUnit.test("ukjent tur åpner ikke skjemaet", function (assert) {
        resetTripTest();
        model.app.currentPage = "tripsPage";

        editTrip(999);

        assert.equal(model.app.currentPage, "tripsPage", "vi blir på turlisten");
        assert.equal(model.viewState.editTripPage.tripId, null, "skjemaet har ingen tur");
        assert.equal(updateViewCallCount, 0, "updateView ble ikke kalt");
    });
});

QUnit.module("showNextPictures og showPreviousPictures", function () {
    /* Tur 4 har fem bilder, som blir delt i to sider med tre per side. */
    QUnit.test("neste side hopper én side fram", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 4;
        model.viewState.tripViewPage.pageNumber = 0;

        showNextPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 1, "vi er på side to");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("neste side stopper på siste side", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 4;
        model.viewState.tripViewPage.pageNumber = 1;

        showNextPictures();
        showNextPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 1, "vi blir på siste side");
    });

    QUnit.test("forrige side hopper én side tilbake", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 4;
        model.viewState.tripViewPage.pageNumber = 1;

        showPreviousPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi er på første side");
    });

    QUnit.test("forrige side stopper på første side", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 4;
        model.viewState.tripViewPage.pageNumber = 0;

        showPreviousPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi blir på første side");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt likevel");
    });

    QUnit.test("turer uten bilder har én tom side", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 5;

        showNextPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi blir på side 0");
    });

    QUnit.test("ukjent tur endrer ikke siden", function (assert) {
        resetTripTest();
        model.viewState.tripViewPage.tripId = 999;

        showNextPictures();
        showPreviousPictures();

        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "siden er uendret");
        assert.equal(updateViewCallCount, 0, "updateView ble ikke kalt");
    });
});

QUnit.module("saveNewTrip", function () {
    QUnit.test("manglende tittel gir feilmelding", function (assert) {
        resetTripTest();
        fillNewTripForm({ title: "   " });
        model.app.currentPage = "newTripPage";

        saveNewTrip();

        assert.equal(
            model.viewState.newTripPage.errorMessage,
            "Tittel og dato må være fyllt inn.",
            "errorMessage er satt",
        );
        assert.equal(model.data.trips.length, 5, "ingen tur ble laget");
        assert.equal(model.app.currentPage, "newTripPage", "vi blir i skjemaet");
    });

    QUnit.test("manglende dato gir feilmelding", function (assert) {
        resetTripTest();
        fillNewTripForm({ date: "" });

        saveNewTrip();

        assert.notEqual(model.viewState.newTripPage.errorMessage, "", "errorMessage er satt");
        assert.equal(model.data.trips.length, 5, "ingen tur ble laget");
    });

    QUnit.test("lager turen og åpner den", function (assert) {
        resetTripTest();
        fillNewTripForm();

        saveNewTrip();

        const tur = findObjectById(model.data.trips, model.viewState.tripViewPage.tripId);

        assert.equal(model.data.trips.length, 6, "én tur ble laget");
        assert.equal(tur.title, "Ny testtur", "tittelen er lagret");
        assert.equal(tur.activityId, 4, "aktiviteten er lagret");
        assert.equal(tur.countyId, 1, "fylket er lagret");
        assert.equal(model.app.currentPage, "tripViewPage", "den nye turen åpnes");
        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi starter på første bildeside");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("mellomrom i tittel og sted er bortfør", function (assert) {
        resetTripTest();
        fillNewTripForm({ title: "  Testtur  ", location: "  Teststed  " });

        saveNewTrip();

        const tur = findObjectById(model.data.trips, model.viewState.tripViewPage.tripId);

        assert.equal(tur.title, "Testtur", "tittelen er trimmet");
        assert.equal(tur.location, "Teststed", "stedet er trimmet");
    });

    QUnit.test("skjemaet tømmes etter lagring", function (assert) {
        resetTripTest();
        fillNewTripForm();

        saveNewTrip();

        const form = model.viewState.newTripPage;

        assert.equal(form.title, "", "tittelen er tømt");
        assert.equal(form.date, "", "datoen er tømt");
        assert.equal(form.pictures.length, 0, "bildene er tømt");
        assert.equal(form.errorMessage, "", "feilmeldingen er borte");
    });

    QUnit.test("bildene kobles til den nye turen", function (assert) {
        resetTripTest();
        fillNewTripForm();
        addPictureToNewTripForm();
        const bildeId = model.viewState.newTripPage.pictures[0];

        saveNewTrip();

        const tur = findObjectById(model.data.trips, model.viewState.tripViewPage.tripId);

        assert.deepEqual(tur.pictures, [bildeId], "turen har bildet");
        assert.notEqual(findImageById(bildeId), null, "bildet ligger i modellen");
        assert.equal(isImageUsedByTrip(bildeId), true, "bildet hører nå til turen");
    });
});

QUnit.module("saveEditedTrip", function () {
    QUnit.test("manglende tittel gir feilmelding", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2, title: "" });
        model.app.currentPage = "editTripPage";

        saveEditedTrip();

        assert.equal(
            model.viewState.editTripPage.errorMessage,
            "Tittel og dato må være fyllt inn.",
            "errorMessage er satt",
        );
        assert.equal(findObjectById(model.data.trips, 2).title, "Sykkeltur til Fjellheia", "turen er uendret");
        assert.equal(model.app.currentPage, "editTripPage", "vi blir i skjemaet");
    });

    QUnit.test("endrer den eksisterende turen", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2 });

        saveEditedTrip();

        const tur = findObjectById(model.data.trips, 2);

        assert.equal(model.data.trips.length, 5, "ingen ny tur ble laget");
        assert.equal(tur.title, "Endret tittel", "tittelen er endret");
        assert.equal(tur.location, "Endret sted", "stedet er endret");
        assert.equal(tur.date, "2026-06-02", "datoen er endret");
        assert.equal(tur.activityId, 4, "aktiviteten er endret");
        assert.equal(tur.countyId, 3, "fylket er endret");
    });

    QUnit.test("turen åpnes etter lagring", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2 });

        saveEditedTrip();

        assert.equal(model.app.currentPage, "tripViewPage", "vi er i turvisningen");
        assert.equal(model.viewState.tripViewPage.tripId, 2, "den endrede turen er åpen");
        assert.equal(model.viewState.tripViewPage.pageNumber, 0, "vi starter på første bildeside");
    });

    QUnit.test("skjemaet husker ikke turen etter lagring", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2 });

        saveEditedTrip();

        const form = model.viewState.editTripPage;

        assert.equal(form.tripId, null, "skjemaet har glemt turen");
        assert.equal(form.title, "", "tittelen er tømt");
        assert.equal(form.pictures.length, 0, "bildene er tømt");
    });

    QUnit.test("bilder som er fjernet fra skjemaet, slettes", function (assert) {
        resetTripTest();
        /* Tur 2 har bildene 4 og 5. Skjemaet tar med bare 4. */
        fillEditTripForm({ tripId: 2, pictures: [4] });

        saveEditedTrip();

        assert.notEqual(findImageById(4), null, "bilde 4 er beholdt");
        assert.equal(findImageById(5), null, "bilde 5 er slettet");
        assert.deepEqual(findObjectById(model.data.trips, 2).pictures, [4], "turen har bare bildet 4");
    });

    QUnit.test("nytt bilde i skjemaet kobles til turen", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 1, pictures: [] });
        addPictureToEditTripForm();
        const bildeId = model.viewState.editTripPage.pictures[0];

        saveEditedTrip();

        assert.notEqual(findImageById(bildeId), null, "bildet ligger i modellen");
        assert.deepEqual(findObjectById(model.data.trips, 1).pictures, [bildeId], "turen har bildet");
    });

    QUnit.test("ukjent tur går tilbake til turlisten", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 999 });

        saveEditedTrip();

        assert.equal(model.app.currentPage, "tripsPage", "vi er på turlisten");
        assert.equal(model.data.trips.length, 5, "ingen tur ble endret");
    });
});

QUnit.module("cancelNewTripForm", function () {
    QUnit.test("tømmer skjemaet og går til turlisten", function (assert) {
        resetTripTest();
        fillNewTripForm();
        addPictureToNewTripForm();
        updateViewCallCount = 0;

        cancelNewTripForm();

        const form = model.viewState.newTripPage;

        assert.equal(model.app.currentPage, "tripsPage", "vi er på turlisten");
        assert.equal(form.title, "", "tittelen er tømt");
        assert.equal(form.pictures.length, 0, "bildene er tømt");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("ubrukte bilder slettes fra modellen", function (assert) {
        resetTripTest();
        fillNewTripForm();
        addPictureToNewTripForm();
        const bildeId = model.viewState.newTripPage.pictures[0];
        updateViewCallCount = 0;

        cancelNewTripForm();

        assert.equal(findImageById(bildeId), null, "bildet ble slettet");
        assert.equal(model.data.images.length, 11, "vi har de opprinnelige bildene igjen");
    });

    QUnit.test("lagrede bilder beholdes", function (assert) {
        resetTripTest();
        fillNewTripForm({ pictures: [1] });

        cancelNewTripForm();

        assert.notEqual(findImageById(1), null, "bilde 1 til tur 1 er beholdt");
    });

    QUnit.test("ingen tur blir laget", function (assert) {
        resetTripTest();
        fillNewTripForm();

        cancelNewTripForm();

        assert.equal(model.data.trips.length, 5, "turetallet er uendret");
    });
});

QUnit.module("cancelEditTripForm", function () {
    QUnit.test("går tilbake til turen vi kom fra", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2, title: "Endret tittel" });
        model.app.currentPage = "editTripPage";

        cancelEditTripForm();

        assert.equal(model.app.currentPage, "tripViewPage", "vi er i turvisningen");
        assert.equal(model.viewState.tripViewPage.tripId, 2, "vi ser på tur 2");
        assert.equal(findObjectById(model.data.trips, 2).title, "Sykkeltur til Fjellheia", "turen er uendret");
    });

    QUnit.test("skjemaet tømmes", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2, title: "Endret tittel" });

        cancelEditTripForm();

        const form = model.viewState.editTripPage;

        assert.equal(form.title, "", "tittelen er tømt");
        assert.equal(form.date, "", "datoen er tømt");
        /* clearTripForm() rører ikke tripId, så skjemaet husker
           fortsatt turen til neste gang redigeringsskjemaet åpnes. */
        assert.equal(form.tripId, 2, "tripId står igjen, slik clearTripForm gjør det");
    });

    QUnit.test("ubrukte bilder slettes", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2, pictures: [] });
        addPictureToEditTripForm();
        const bildeId = model.viewState.editTripPage.pictures[0];

        cancelEditTripForm();

        assert.equal(findImageById(bildeId), null, "bildet ble slettet");
    });

    QUnit.test("lagrede bilder beholdes", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2, pictures: [4, 5] });

        cancelEditTripForm();

        assert.notEqual(findImageById(4), null, "bilde 4 er beholdt");
        assert.notEqual(findImageById(5), null, "bilde 5 er beholdt");
    });

    QUnit.test("turen er slettet, så vi går til turlisten", function (assert) {
        resetTripTest();
        fillEditTripForm({ tripId: 2 });
        const index = findIndexById(model.data.trips, 2);
        model.data.trips.splice(index, 1);

        cancelEditTripForm();

        assert.equal(model.app.currentPage, "tripsPage", "vi er på turlisten");
    });
});

QUnit.module("addPictureToForm", function () {
    QUnit.test("nytt bilde på nytturskjemaet", function (assert) {
        resetTripTest();
        model.viewState.newTripPage.pictures = [];
        const antallBilderFoer = model.data.images.length;

        addPictureToNewTripForm();

        const bildeId = model.viewState.newTripPage.pictures[0];

        assert.equal(model.data.images.length, antallBilderFoer + 1, "bildet ble lagret i modellen");
        assert.equal(isImageUsedByTrip(bildeId), false, "bildet hører ikke til en tur ennå");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("nytt bilde på redigeringsskjemaet", function (assert) {
        resetTripTest();
        model.viewState.editTripPage.pictures = [];

        addPictureToEditTripForm();

        const bildeId = model.viewState.editTripPage.pictures[0];

        assert.equal(model.viewState.editTripPage.pictures.length, 1, "skjemaet har ett bilde");
        assert.equal(isImageUsedByTrip(bildeId), false, "bildet hører ikke til en tur ennå");
    });

    QUnit.test("motivene går i runde", function (assert) {
        resetTripTest();
        model.viewState.newTripPage.pictures = [];

        for (let i = 0; i < 7; i++) {
            addPictureToNewTripForm();
        }

        const templateIds = [];

        for (const bildeId of model.viewState.newTripPage.pictures) {
            templateIds.push(findImageById(bildeId).templateId);
        }

        assert.deepEqual(templateIds, [1, 2, 3, 4, 5, 6, 1], "det sjuende bildet får motiv 1 igjen");
    });
});

QUnit.module("removePictureFromForm", function () {
    QUnit.test("ubrukt bilde slettes fra modellen", function (assert) {
        resetTripTest();
        model.viewState.newTripPage.pictures = [];
        addPictureToNewTripForm();
        const bildeId = model.viewState.newTripPage.pictures[0];
        updateViewCallCount = 0;

        removePictureFromNewTripForm(bildeId);

        assert.equal(model.viewState.newTripPage.pictures.length, 0, "skjemaet mistet bildet");
        assert.equal(findImageById(bildeId), null, "bildet ble slettet");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("lagret bilde beholdes i modellen", function (assert) {
        resetTripTest();
        model.viewState.editTripPage.pictures = [4];

        removePictureFromEditTripForm(4);

        assert.equal(model.viewState.editTripPage.pictures.length, 0, "skjemaet mistet bildet");
        assert.notEqual(findImageById(4), null, "bildet er fortsatt i modellen");
    });

    QUnit.test("ukjent bilde gjør ingen ting", function (assert) {
        resetTripTest();
        model.viewState.newTripPage.pictures = [1];

        removePictureFromNewTripForm(999);

        assert.deepEqual(model.viewState.newTripPage.pictures, [1], "listen er uendret");
        assert.notEqual(findImageById(1), null, "bildet er beholdt");
    });
});