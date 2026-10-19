function addNewNote() {
    let noteForm = model.viewState.newNotePage;
    const notes = model.data.notes;

    noteForm.noteId = getNextId(notes);
    noteForm.date = noteForm.date
    noteForm.updatedAt = getTimestamp();
    
    notes.push(noteForm);

    model.viewState.newNotePage = {
      title: "",
      date: "",
      description: "",
      topics: [],
    }

    goToPage('notesPage');
}

function checkFormComplete(params) {
    const form  = model.viewState.newNotePage 

    if (form.title == '' 
        || form.date == '' 
        || form.description == '' 
        || form.topics.length <= 0) {
            alert('fullfør') 
    }  else {

    }
}