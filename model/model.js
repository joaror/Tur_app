// const model = {
//     app: {
//         currentPage: '',
//     },
//     viewState: {
//         page1: {

//         },
//         page2: {

//         },
//         page3: {

//         },
//         page4: {

//         },
//     },
//     trips: [],
//     notes: [],
//     stats: [],
// }

const model = {
    app: {
        currentPage: "home"
    },
    
    viewState: {
        visibility: 'default',

        // Hjem
        isHome: {
            filter: 'recent',
        },
        page2: {
            // Trip details
            tripId: null,
            isFavorite: false,
            bookmarked: false,
        },
        page3: {
            // User profile
            showEditProfile: false,
            notificationsCount: 0,
        },

        // Nytt notat
        isNewNote: {
            title: '',
            topic: [],
            date: null,
            noteLog: '',
            audioInput: null,
        },

        // Notatdetaljer
        isNoteView: {
            id:null
        },

        // Turdetaljer
        isTripView: {
            id:null,
        },
        
        // Ny tur
        isNewTrip: {
            activity: null, // Bør vi ha emneknagger her? Kanksje i tillegg? F.eks. 'blåbær', 'tyttebær', 'fisk', 'bålplass'...
            title: '',
            area: '',
            date: null,
            areaState: null,
            pictures: [],
            tripLog: '',
            audioInput: null
        },

        // Søk
        isSearch: {
            searchStr: null,
            activeFilters: [],
            searchHits: [],
        },

        // Innstillinger
        isSettings: {
            visibility: 'default',
            newActivity: null,
            newTopic: null,
            newArea: null,
        }
    },

    data: {
        // Turer
        trips: [],
    
        // Notater
        notes: [],
    
        // Statistikk ???
        stats: [],
    }

};

// Hjem             +
// Ny tur           +
// Turdetaljer      +
// Endre tur        -
// Nytt notat       +
// Notater          +
// Endre notat      -
// Søk              +
// Innstillinger    +
