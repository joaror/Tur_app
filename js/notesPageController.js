function saveNote() {
    const noteForm = model.viewState;
    const notesVault = model.data.notes;
    const isEdit = noteForm.noteViewPage.isEditing; 

    if (isEdit) {
        if (errorHandler(noteForm.editNotePage)) {
            updateViewEditNotesPage();
            return
        } 
        noteForm.editNotePage.updatedAt = getTimestamp();
        notesVault[findIndexById(notesVault, noteForm.noteViewPage.noteId)] = noteForm.editNotePage;
        openNote(noteForm.editNotePage.id);
        noteForm.editNotePage = clearEditNote();
    } else {
        if (errorHandler(noteForm.newNotePage)) {
            updateViewEditNotesPage();
            return
        } 
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
        noteForm.newNotePage = clearNewNote()
    }
}

function clearNewNote() {
    return {
        title: "",
        date: "",
        description: "",
        topics: [],
        errorMessage: "",
    }
}

function clearEditNote() {
    return {
        noteId: null,
        title: "",
        date: "",
        description: "",
        topics: [],
        errorMessage: "",
    }
}

function errorHandler(form) {
    const title = form.title
    const date = form.date

    if (!date || !title) {
        form.errorMessage = "Tittel og dato må være fyllt inn."
        return true
    } else {
        form.errorMessage = ""
    }
}

function toggleMenu() {
    const menu = model.viewState.noteViewPage;
    menu.isMenuOpen = !menu.isMenuOpen;
    updateViewNoteViewPage();
}

function duplicateNote() {
    const notesVault = model.data.notes
    const noteViewPage = model.viewState.noteViewPage
    const selectedNote = structuredClone(findObjectById(notesVault, noteViewPage.noteId));
    
    const newNote = {
        id: getNextId(notesVault),
        title: "Kopi av " + selectedNote.title,
        date: selectedNote.date,
        description: selectedNote.description,
        topics: selectedNote.topics, 
        updatedAt: getTimestamp(),
    };
    
    model.data.notes.push(newNote);
    noteViewPage.noteId = newNote.id
    noteViewPage.isMenuOpen = false;
    
    updateViewNoteViewPage();
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

function openNote(id) {
    model.viewState.noteViewPage.noteId = id;
    goToPage("noteViewPage");
}

function deleteNote() {
    model.data.notes.splice(
        findIndexById(model.data.notes, model.viewState.noteViewPage.noteId),
        1,
    );
    resetNoteActions();
    goToPage("notesPage");
}

function deleteDialog() {
    model.viewState.noteViewPage.isDeleteDialogOpen = true;
    updateViewNoteViewPage();
}

function editNote() {
    const notesVault = model.data.notes;
    const selectedNote = model.viewState;
    selectedNote.editNotePage = structuredClone(notesVault[findIndexById(notesVault, selectedNote.noteViewPage.noteId)]);

    selectedNote.noteViewPage.isEditing = true;
    model.app.currentPage == "editNotePage" ? updateViewEditNotesPage() : goToPage("editNotePage");
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
    model.viewState.noteViewPage = {
        noteId: null,
        isMenuOpen: false,
        isEditing: false,
        isDeleteDialogOpen: false,
    };
}

function cancelNote() {
    const data = model.viewState;
    const dataView = model.viewState.noteViewPage

    if (dataView.isDeleteDialogOpen) {
        dataView.isDeleteDialogOpen = false;
        dataView.isMenuOpen = false;
    }
    
    data.editNotePage = clearEditNote()
    data.newNotePage = clearNewNote()
    dataView.noteId == null ? goToPage("notesPage") : updateViewNoteViewPage();
}
