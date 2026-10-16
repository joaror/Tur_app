function addNewNote() {
    const noteForm = model.viewState.newNotePage;
    const newNote = structuredClone(noteForm); // ???
    const notes = model.data.notes;

    let newId = 0;
    const date = new Date();

    for (let note of notes) {
        if (newId <= note.id) newId = note.id + 1;
    }

    newNote.id = newId;
    newNote.date = date.toLocaleDateString();
    newNote.updatedAt = date.toLocaleString();

    noteForm.description = "";
    noteForm.title = "";
    noteForm.topics = [];

    notes.push(newNote);
}

// skal dato i common.js?
// skal id i common.js?
