function updateViewNotesPage() {
    document.getElementById("app").innerHTML = /*HTML*/ `
        <div class="page-notes" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}
                
                    <header class="app-header">
                        <h1>Notater</h1>
                    </header>
                    
                <main class="content">
                    ${getNotes()}
                </main>

                ${createBottomNavHtml("notesPage")}
                ${createFloatingActionHtml("createNewNote();", "Nytt notat")}
            </div>
        </div>
    `;
}

function getTags(tags) {
    let html = "";
    for (let tag of tags) {
        html += /* HTML */ `
            <span class="tag">
                ${findObjectById(model.data.topics, tag).topic}
            </span>
        `;
    }
    return html;
}

function getNotes() {
    const notes = model.data.notes;
    let html = "";

    for (let note of notes) {
        html += /* HTML */ `
            <a class="note-card" href="notat-detaljer.html">
                <div class="note-card-header">
                    <span class="note-date">${note.date}</span>
                </div>
                <h2>${note.title}</h2>
                <p>${note.description}</p>
                <div class="tags">
                    ${getTags(findObjectById(notes, note.id).topics)}
                </div>
            </a>
        `;
    }
    return html;
}

