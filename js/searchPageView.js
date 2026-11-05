function updateViewSearchPage() {
    const state = model.viewState.searchPage;

    const html = /*HTML*/ `
        <div class="page-search" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}

                <header class="app-header">
                    <h1>Søk</h1>
                </header>

                <main class="content">

                    <div class="field">
                        <label for="searchInput">Søk etter turer og notater</label>
                        <input
                            id="searchInput"
                            type="search"
                            placeholder="Søk etter tittel, sted eller tekst..."
                            value="${escapeHtml(state.searchStr)}"
                            onchange="updateSearchStr(this.value)"
                        />
                    </div>

                    <div class="search-filters">

                        <div class="field">
                            <label for="activityFilter">Aktivitet</label>
                            <select
                                id="activityFilter"
                                onchange="updateSearchActivity(this.value)"
                            >
                                <option value="">Alle aktiviteter</option>
                                ${model.data.activities.map(activity =>
                                    createOptionHtml(
                                        activity.id,
                                        activity.activity,
                                        state.selectedActivity
                                    )
                                ).join("")}
                            </select>
                        </div>

                        <div class="field">
                            <label for="seasonFilter">Sesong</label>
                            <select
                                id="seasonFilter"
                                onchange="updateSearchSeason(this.value)"
                            >
                                <option value="">Alle sesonger</option>
                                ${model.data.seasons
                                    .filter(season => season.id !== 5)
                                    .map(season =>
                                        createOptionHtml(
                                            season.id,
                                            season.season,
                                            state.season
                                        )
                                    ).join("")}
                            </select>
                        </div>

                        <div class="field">
                            <label for="topicFilter">Emneknagg</label>
                            <select
                                id="topicFilter"
                                onchange="updateSearchTopic(this.value)"
                            >
                                <option value="">Alle emneknagger</option>
                                ${model.data.topics.map(topic =>
                                    createOptionHtml(
                                        topic.id,
                                        topic.topic,
                                        state.selectedTopic
                                    )
                                ).join("")}
                            </select>
                        </div>

                        <div class="field">
                            <label for="sortFilter">Sorter etter dato</label>
                            <select
                                id="sortFilter"
                                onchange="updateSearchSort(this.value)"
                            >
                                <option value="dateDesc"
                                    ${state.sortOrder === "dateDesc" ? "selected" : ""}>
                                    Nyeste først
                                </option>
                                <option value="dateAsc"
                                    ${state.sortOrder === "dateAsc" ? "selected" : ""}>
                                    Eldste først
                                </option>
                            </select>
                        </div>

                    </div>

                    <button
                        class="btn btn-secondary"
                        type="button"
                        onclick="resetSearch()"
                    >
                        Nullstill filtre
                    </button>

                    ${getSearchResultsHtml()}

                </main>

                ${createBottomNavHtml("searchPage")}
            </div>
        </div>
    `;

    document.getElementById("app").innerHTML = html;
}


// Lager resultatlisten
function getSearchResultsHtml() {
    const trips = getSearchTrips();
    const notes = getSearchNotes();

    let html = /*HTML*/ `
        <section class="search-results">

            <h2>Turer (${trips.length})</h2>
    `;

    if (trips.length === 0) {
        html += `<p>Ingen turer funnet.</p>`;
    } else {
        for (const trip of trips) {
            html += createSearchTripHtml(trip);
        }
    }

    html += /*HTML*/ `
            <h2>Notater (${notes.length})</h2>
    `;

    if (notes.length === 0) {
        html += `<p>Ingen notater funnet.</p>`;
    } else {
        for (const note of notes) {
            html += createSearchNoteHtml(note);
        }
    }

    html += `</section>`;

    return html;
}


// Lager et søkeresultat for en tur
function createSearchTripHtml(trip) {
    return /*HTML*/ `
        <div
            class="trip-card"
            onclick="openTrip(${trip.id})"
            style="cursor: pointer;"
        >
            <div class="note-card-header">
                <span class="note-date">${formatDate(trip.date)}</span>
            </div>

            <h2>${escapeHtml(trip.title)}</h2>

            <p>
                ${escapeHtml(getActivityName(trip.activityId))}
                · ${escapeHtml(trip.location)}
            </p>

            <p>${escapeHtml(createPreview(trip.description))}</p>

            <span class="meta-chip">
                ${escapeHtml(getCountyName(trip.countyId))}
            </span>
        </div>
    `;
}


// Lager et søkeresultat for et notat
function createSearchNoteHtml(note) {
    const topicNames = note.topics.map(topicId => {
        const topic = findObjectById(model.data.topics, topicId);
        return topic ? topic.topic : "";
    }).filter(Boolean);

    return /*HTML*/ `
        <div
            class="note-card"
            onclick="openNote(${note.id})"
            style="cursor: pointer;"
        >
            <div class="note-card-header">
                <span class="note-date">${formatDate(note.date)}</span>
            </div>

            <h2>${escapeHtml(note.title)}</h2>

            <p>${escapeHtml(createPreview(note.description))}</p>

            <div class="tags">
                ${topicNames.map(topic =>
                    `<span class="tag">${escapeHtml(topic)}</span>`
                ).join("")}
            </div>
        </div>
    `;
}