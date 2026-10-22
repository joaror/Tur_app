function saveNote() {
    const noteForm = model.viewState;
    const notesVault = model.data.notes;
    const isEdit = noteForm.noteViewPage.isEditing; // Endre noteViewPage til noteViewState?

    if (isEdit) {
        noteForm.editNotePage.updatedAt = getTimestamp()
        notesVault[findIndexById(notesVault, noteForm.noteViewPage.noteId)] = noteForm.editNotePage;
        openNote(noteForm.editNotePage.id);
        noteForm.editNotePage = {
            noteId: null,
            title: "",
            date: "",
            description: "",
            topics: [],
            errorMessage: "",
        };
    } else {
        const newNote = {
            id: getNextId(notesVault),
            title: noteForm.newNotePage.title,
            date: noteForm.newNotePage.date,
            description: noteForm.newNotePage.description,
            topics: noteForm.newNotePage.topics,
            updatedAt: getTimestamp(),
        };
        notesVault.push(newNote);
        openNote(newNote.id);
        noteForm.newNotePage = {
            title: "",
            date: "",
            description: "",
            topics: [],
        };
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
    const note = selectedNote().topics;
    if (note.includes(topicId)) {
        for (let i = 0; i < note.length; i++) {
            if (note[i] == topicId) note.splice(i, 1);
        }
    } else {
        note.push(topicId);
    }
    updateView();
}

function editNote() {
    const notesVault = model.data.notes;
    const selectedNote = model.viewState.noteViewPage;
    model.viewState.editNotePage = notesVault[findIndexById(notesVault, selectedNote.noteId)];

    selectedNote.isEditing = true;
    goToPage("editNotePage");
}

function selectedNote() {
    const selectedNote = model.viewState;
    if (selectedNote.noteViewPage.isEditing) {
        return selectedNote.editNotePage;
    } else {
        return selectedNote.newNotePage;
    }
}

function resetNoteActions() {
    const note = model.viewState.noteViewPage;
    note.noteId = null;
    note.isEditing = false;
}
