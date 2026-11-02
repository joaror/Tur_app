// Validates that required fields (title and date) are filled
function validateRequiredFields (form) {
    if (!form.date || !form.title || form.title.trim() === "")
        return "Tittel og dato må være fyllt inn.";
};

// Handles validation errors and updates the error message
function handleValidationErrors (errors, viewPage) {
    if (errors) {
        viewPage.errorMessage = errors;
        return true; // validation failed
    }
    viewPage.errorMessage = "";
    return false; // validation passed
};

// Builds a new note object from form data
function buildNewNote (newNoteForm, vault) {
    return {
        id: getNextId(vault),
        title: newNoteForm.title.trim(),
        date: newNoteForm.date,
        description: newNoteForm.description || "",
        topics: newNoteForm.topics || [],
        updatedAt: getTimestamp()
    }
};

// Updates an existing note in the vault
function updateNoteInVault(vault, noteId, updatedNote) {
    const index = findIndexById(vault, noteId);
    if (index !== -1) {
        vault[index] = { ...vault[index], ...updatedNote };
    }
};

function saveNote() {
    const noteForm = model.viewState;
    const notesVault = model.data.notes;
    const isEdit = noteForm.noteViewPage.isEditing;

    if (isEdit) {
        // Handle edit mode
        const errors = validateRequiredFields(noteForm.editNotePage);
        if (handleValidationErrors(errors, noteForm.editNotePage)) {
            updateViewEditNotesPage();
            return;
        }

        // Update the existing note and redirect
        const updatedNote = { ...noteForm.editNotePage, updatedAt: getTimestamp() };
        updateNoteInVault(notesVault, noteForm.noteViewPage.noteId, updatedNote);
        openNote(noteForm.editNotePage.id);

        // Reset edit form
        noteForm.editNotePage = clearEditNote();
    } else {
        // Handle new note mode
        const errors = validateRequiredFields(noteForm.newNotePage);
        if (handleValidationErrors(errors, noteForm.newNotePage)) {
            updateViewEditNotesPage();
            return;
        }

        // Build and save the new note
        const newNote = buildNewNote(noteForm.newNotePage, notesVault);
        notesVault.push(newNote);
        openNote(newNote.id);

        // Reset form
        noteForm.newNotePage = clearNewNote();
    }
}

function clearNewNote() {
    return {
        title: "",
        date: "",
        description: "",
        topics: [],
        errorMessage: "",
    };
}

function clearEditNote() {
    return {
        noteId: null,
        title: "",
        date: "",
        description: "",
        topics: [],
        errorMessage: "",
    };
}

function toggleMenu() {
    const menu = model.viewState.noteViewPage;
    menu.isMenuOpen = !menu.isMenuOpen;
    updateViewNoteViewPage();
}

function duplicateNote() {
    const notesVault = model.data.notes;
    const noteViewPage = model.viewState.noteViewPage;
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
    noteViewPage.noteId = newNote.id;
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
    model.data.notes.splice(findIndexById(model.data.notes, model.viewState.noteViewPage.noteId), 1);
    resetNoteActions();
    goToPage("notesPage");
}

function deleteDialog() {
    model.viewState.noteViewPage.isDeleteDialogOpen = true;
    updateViewNoteViewPage();
}

// Opens an existing note in edit mode
function editNote() {
    const vault = model.data.notes;
    const viewState = model.viewState;
    
    // Find and deep-clone the target note
    const noteIndex = findIndexById(vault, viewState.noteViewPage.noteId);
    if (noteIndex === -1) {
        console.warn("No valid note selected for editing");
        return;
    }
    
    // Populate edit form and prepare state
    viewState.editNotePage = structuredClone(vault[noteIndex]);
    viewState.noteViewPage.isEditing = true;

    // Update UI if already on edit page, or navigate to it
    if (model.app.currentPage === "editNotePage") {
        updateViewEditNotesPage();
    } else {
        goToPage("editNotePage");
    }
};

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
    const dataView = model.viewState.noteViewPage;

    if (dataView.isDeleteDialogOpen) {
        dataView.isDeleteDialogOpen = false;
        dataView.isMenuOpen = false;
    }

    data.editNotePage = clearEditNote();
    data.newNotePage = clearNewNote();
    dataView.noteId == null ? goToPage("notesPage") : updateViewNoteViewPage();
}
