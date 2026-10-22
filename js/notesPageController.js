function addNewNote() {
    const noteForm = model.viewState.newNotePage
    const notesVault = model.data.notes
    const newNote = {
        id : getNextId(notesVault),
        title : noteForm.title,
        date : noteForm.date,
        description : noteForm.description,
        topics : noteForm.topics,
        updatedAt : getTimestamp(),
    } 

    model.viewState.newNotePage = {
        title: "",
        date: "",
        description: "",
        topics: [],
    };
    notesVault.push(newNote);
    openNote(newNote.id);
}

// function checkFormComplete(params) {
//     const form = model.viewState.newNotePage;

//     if (form.title == "" || form.date == "" || form.description == "" || form.topics.length <= 0) {
//         alert("fullfør");
//     } else {
//     }
// }

function toggleMenu() {
    const menu = model.viewState.noteViewPage;
    menu.isMenuOpen = !menu.isMenuOpen
    updateViewNoteViewPage()
}

function openNote(id) {
    model.viewState.noteViewPage.noteId = id
    goToPage('noteViewPage')
}

function toggleTopic(topicId) {
    const note = model.viewState.newNotePage.topics
    if (note.includes(topicId)){
        for (let i = 0; i < note.length; i++) {
            if(note[i] == topicId) note.splice(i, 1)
        }
    } else {
        note.push(topicId)
    }
    updateView()
}