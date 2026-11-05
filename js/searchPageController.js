// Henter søkefeltene fra modellen
function getSearchState() {
    return model.viewState.searchPage;
}

// Oppdaterer søketeksten
function updateSearchStr(value) {
    getSearchState().searchStr = escapeHtml(value);
    updateViewSearchPage();
}

// Oppdaterer valgt aktivitet
function updateSearchActivity(value) {
    getSearchState().selectedActivity = value ? Number(value) : null;
    updateViewSearchPage();
}

// Oppdaterer valgt emneknagg
function updateSearchTopic(value) {
    getSearchState().selectedTopic = value ? Number(value) : null;
    updateViewSearchPage();
}

// Oppdaterer valgt sesong
function updateSearchSeason(value) {
    getSearchState().season = value ? Number(value) : null;
    updateViewSearchPage();
}

// Oppdaterer sortering
function updateSearchSort(value) {
    getSearchState().sortOrder = value;
    updateViewSearchPage();
}

// Nullstiller alle søkefiltre
function resetSearch() {
    model.viewState.searchPage = {
        searchStr: "",
        selectedActivity: null,
        selectedTopic: null,
        season: null,
        sortOrder: "dateDesc",
    };

    updateViewSearchPage();
}

// Kontrollerer om en tekst inneholder søkeordet
function matchesSearchText(text, searchText) {
    return String(text || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());
}

// Filtrerer turene
function getSearchTrips() {
    const state = getSearchState();
    const searchText = state.searchStr.trim().toLowerCase();

    let trips = [...model.data.trips];

    // Søker i tittel, sted, beskrivelse, aktivitet og fylke
    if (searchText) {
        trips = trips.filter(trip => {
            const activity = getActivityName(trip.activityId);
            const county = getCountyName(trip.countyId);

            return (
                matchesSearchText(trip.title, searchText) ||
                matchesSearchText(trip.location, searchText) ||
                matchesSearchText(trip.description, searchText) ||
                matchesSearchText(activity, searchText) ||
                matchesSearchText(county, searchText)
            );
        });
    }

    // Filtrerer etter aktivitet
    if (state.selectedActivity !== null) {
        trips = trips.filter(
            trip => trip.activityId === state.selectedActivity
        );
    }

    // Filtrerer etter sesong
    if (state.season !== null) {
        trips = trips.filter(
            trip => getSeasonId(trip.date) === state.season
        );
    }

    // Sorterer etter dato
    if (state.sortOrder === "dateAsc") {
        trips.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        trips.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return trips;
}

// Filtrerer notatene
function getSearchNotes() {
    const state = getSearchState();
    const searchText = state.searchStr.trim().toLowerCase();

    let notes = [...model.data.notes];

    // Søker i tittel, beskrivelse og emneknagger
    if (searchText) {
        notes = notes.filter(note => {
            const topicNames = note.topics.map(topicId => {
                const topic = findObjectById(model.data.topics, topicId);
                return topic ? topic.topic : "";
            }).join(" ");

            return (
                matchesSearchText(note.title, searchText) ||
                matchesSearchText(note.description, searchText) ||
                matchesSearchText(topicNames, searchText)
            );
        });
    }

    // Filtrerer etter emneknagg
    if (state.selectedTopic !== null) {
        notes = notes.filter(
            note => note.topics.includes(state.selectedTopic)
        );
    }

    // Sorterer etter dato
    if (state.sortOrder === "dateAsc") {
        notes.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        notes.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return notes;
}