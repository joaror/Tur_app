function addNewNote() {
    const noteForm = model.viewState.newNotePage;
    const newNote = {
        id: getNextId(model.data.notes),
        title: noteForm.title,
        date: noteForm.date,
        description: noteForm.description,
        topics: noteForm.topics,
        updatedAt: getTimestamp(),
    };
    
    if (checkFormComplete()) {
        model.data.notes.push(newNote);
        openNote(newNote.id);
        clearNoteForm();
    }
}

function clearNoteForm() {
     model.viewState.newNotePage = {
            title: "",
            date: "",
            description: "",
            topics: [],
        };
}

function checkFormComplete() {
    const form = model.viewState.newNotePage;

    if (form.title == "" || form.date == "") {
        alert("fullfør");
    } else { 
        return true
    }
}

function toggleMenu() {
    const menu = model.viewState.noteViewPage;
    menu.isMenuOpen = !menu.isMenuOpen;
    updateViewNoteViewPage();
}

function openNote(id) {
    model.viewState.noteViewPage.noteId = id;
    goToPage("noteViewPage");
}

function toggleTopic(topicId) {
    const note = model.viewState.newNotePage.topics;
    if (note.includes(topicId)) {
        for (let i = 0; i < note.length; i++) {
            if (note[i] == topicId) note.splice(i, 1);
        }
    } else {
        note.push(topicId);
    }
    updateView();
}
