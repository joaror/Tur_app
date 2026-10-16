const model = {
    app: {
        currentPage: "login",
    },

    viewState: {
        // Login
        loginPage: {
            userInput: "",
            passwordInput: "",
        },

        // Ny tur
        newTripPage: {
            activityId: null,
            title: "",
            location: "",
            date: null,
            countyId: null,
            description: "",
            pictures: [],
        },

        editTripPage: {
            tripId: null,
            activityId: null,
            title: "",
            location: "",
            date: null,
            countyId: null,
            description: "",
            pictures: [],
        },

        // Turliste
        tripViewPage: {
            tripId: null,
            pageNumber: null, // paging
        },

        // Nytt notat
        newNotePage: {
            title: "",
            date: null,
            description: "",
            topics: [],
        },

        editNotePage: {
            noteId: null,
            title: "",
            date: null,
            description: "",
            topics: [],
        },

        // Notatdetaljer
        noteViewPage: {
            noteId: null,
        },

        // Søk
        // Bør vi ha alle filterne i ett array her?
        searchPage: {
            searchStr: "",
            selectedActivity: null,
            selectedTopic: null,
            season: null,
            searchHits: [],
        },

        // Innstillinger
        settingsPage: {
            newActivity: null,
            newTopic: null,
            newCounty: null,
        },
    },

    data: {
        activities: [
            { id: 1, activity: "Skitur" },
            { id: 2, activity: "Båttur" },
            { id: 3, activity: "Gåtur" },
            { id: 4, activity: "Fisketur" },
            { id: 5, activity: "Bærtur" },
            { id: 6, activity: "Sykkeltur" },
            { id: 7, activity: "Klatring" },
        ],

        topics: [
            { id: 1, topic: "Planlegging" },
            { id: 2, topic: "Utstyr" },
            { id: 3, topic: "Refleksjon" },
            { id: 4, topic: "Mål" },
            { id: 5, topic: "Tips" },
        ],

        counties: [
            { id: 1, county: "Oslo" },
            { id: 2, county: "Innlandet" },
            { id: 3, county: "Rogaland" },
            { id: 4, county: "Nordland" },
            { id: 5, county: "Vestfold" },
        ],

        seasons: [
            { id: 1, season: "Vår" },
            { id: 2, season: "Sommer" },
            { id: 3, season: "Høst" },
            { id: 4, season: "Vinter" },
            { id: 5, season: "Alle" },
        ],
        trips: [
            {
                id: 1,
                activityId: 4,
                title: "Fisketur til Hammervatnet",
                location: "Hammervatnet",
                date: "2026-10-30",
                countyId: 4,
                pictures: [1, 2, 3],
                description: "",
                updatedAt: "2026-10-06T19:24",
            },
        ],

        images: [
            { id: 1, tripId: 3, label: "Bilde 1" },
            { id: 2, tripId: 3, label: "Bilde 2" },
            { id: 3, tripId: 3, label: "Bilde 3" },
            { id: 4, tripId: 4, label: "Bilde 1" },
            { id: 5, tripId: 4, label: "Bilde 2" },
        ],

        // Notater
        notes: [
            {
                id: 1,
                title: "Sesongplanlegging høst 2026",
                date: "2026-10-05",
                description:
                    "Bør prioritere turer i september–oktober før snøen legger seg i høyden.",
                topics: [1, 2, 6],
                updatedAt: "2026-10-06T19:24",
            },
        ],
    },
};
