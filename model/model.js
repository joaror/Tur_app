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
            tripId: null,
            activityId: null,
            title: "",
            location: "",
            date: null,
            countyId: null,
            pictures: [],
            description: "",
            // audioInput: null
        },

        editTripPage: {
            tripId: null,
            title: "",
            date: null,
            description: "",
            pictures: [],
            topics: [],
        },

        // Turliste
        tripViewPage: {
            tripId: null,
            pageNumber: null, // paging
        },

        // Nytt notat
        newNotePage: {
            noteId: null,
            title: "",
            date: null,
            description: "",
            topics: [],
            // audioInput: null,
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
            searchStr: null,
            selectedActivity: "",
            selectedTopic: "",
            season: "",
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
            { id: 1, name: "Skitur" },
            { id: 2, name: "Båttur" },
            { id: 3, name: "Gåtur" },
            { id: 4, name: "Fisketur" },
            { id: 5, name: "Bærtur" },
            { id: 6, name: "Sykkeltur" },
            { id: 7, name: "Klatring" },
        ],
        topics: [
            { id: 1, name: "Planlegging" },
            { id: 2, name: "Utstyr" },
            { id: 3, name: "Refleksjon" },
            { id: 4, name: "Mål" },
            { id: 5, name: "Tips" },
            { id: 6, name: "Høst" },
            { id: 7, name: "Sommer" },
        ],

        counties: [
            { id: 1, name: "Oslo" },
            { id: 2, name: "Innlandet" },
            { id: 3, name: "Rogaland" },
            { id: 4, name: "Nordland" },
            { id: 5, name: "Vestfold" },
        ],
        // Turer
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
