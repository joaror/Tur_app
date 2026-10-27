function updateViewNotesPage() {
    const html = /*HTML*/ `
        <div class="page-notes" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}
                
                <header class="app-header">
                    <h1>Notater</h1>
                </header>

                <main class="content">
                    ${getNotes()}
                </main>

                ${createFloatingActionHtml("goToPage('editNotePage');", "Nytt notat")}
                ${createBottomNavHtml("notesPage")}
            </div>
        </div>
    `;
    document.getElementById("app").innerHTML = html;
}

function updateViewEditNotesPage() {
    const html = /*HTML*/ `
        <div class="page-notes" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}
                
                <header class="app-header app-header--actions">
                    ${createBackButtonHtml("notesPage", "cancelNote()")}
                    <h1>Nytt notat</h1>
                </header>

                <main class="content">
                    <div class="form-body">
                        <div class="field">
                            <label>Tittel</label>
                            <input type="text" 
                                value="${selectedNote().title}"
                                oninput="selectedNote().title = escapeHtml(this.value)" 
                                placeholder="f.eks. Sesongplanlegging vinter 2027" />
                        </div>
                        <div class="field">
                            <label>Dato</label>
                            <input type="date" value="${selectedNote().date}" onchange="selectedNote().date = escapeHtml(this.value)"/>
                        </div>
                        <div class="field">
                            <label for="notat">Notat</label>
                            <div class="textarea-wrap">
                                <textarea id="notat" 
                                    oninput="selectedNote().description = escapeHtml(this.value)"
                                    placeholder="Skriv dine tanker, refleksjoner eller planer her...">${selectedNote().description ? selectedNote().description : ""}</textarea>
                            </div>
                        </div>
                        <div class="tags-field">
                            <label>Emneknagger</label>
                            <div class="tag-chips">
                                ${getTags(model.data.topics, "chip")}
                            </div>
                        </div>
                    </div>
                </main>
                ${selectedNote().errorMessage ? /*HTML*/ `<p class="login-error">${selectedNote().errorMessage}</p>` : ""}
                <div class="action-bar">
                    <button class="btn btn-secondary" onclick="cancelNote()">Avbryt</button>
                    <button class="btn btn-primary" onclick="saveNote()">Lagre</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("app").innerHTML = html;
}

function updateViewNoteViewPage() {
    const note = findObjectById(model.data.notes, model.viewState.noteViewPage.noteId);
    const html = /*HTML*/ `
        <div class="page-notes" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}
                
                <header class="app-header app-header--actions">
                    ${createBackButtonHtml("notesPage")}
                    <h1>Notat</h1>
                    <div class="header-actions">
                        <button class="icon-btn" type="button" id="editBtn" onclick="editNote()" title="Rediger">
                            <span class="svg-edit 
                                svg-display 
                                svg-size-20">
                            </span>
                        </button>
                        <div class="menu-wrap">
                            <button class="icon-btn" type="button" onclick="toggleMenu()" title="Mer">
                                <span class="svg-dots 
                                    svg-display 
                                    svg-size-20">
                                </span>
                            </button>
                            <div class="menu" id="moreMenu" ${model.viewState.noteViewPage.isMenuOpen ? "" : "hidden"}>
                                <button class="menu-item" type="button" onclick="duplicateNote()">
                                    <span class="svg-duplicate 
                                        svg-display 
                                        svg-size-20">
                                    </span>
                                    Dupliser notat
                                </button>
                                <div class="menu-divider"></div>
                                <button class="menu-item danger" type="button" onclick="deleteDialog()" id="deleteBtn">
                                    <span class="svg-trash 
                                        svg-display 
                                        svg-size-18" >
                                    </span>
                                    Slett notat
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <div class="detail-content" id="viewMode">
                    <div class="detail-section">
                        <div class="note-detail-head">
                            <span class="meta-chip">
                                <span class="svg-calendar svg-display"></span>
                                ${formatDate(note.date)}
                            </span>
                        </div>
                        <h2 id="viewTitle">${note.title}</h2>
                    </div>
                    <div class="detail-section">
                        <p class="note-detail-text" id="viewText">${note.description} </P>
                        <div class="note-detail-tags" id="viewTags">
                            ${getTags(note.topics, "tag", model.data.topics)}
                        </div>
                        <p class="note-updated">Sist oppdatert: ${formatDate(note.updatedAt)}</p>
                    </div>
                </div>
                ${createNoteDeleteDialogHtml(note, model.viewState.noteViewPage.isDeleteDialogOpen)}
                ${createBottomNavHtml("notesPage")}
            </div>
        </div>
    `;
    document.getElementById("app").innerHTML = html;
}

function createNoteDeleteDialogHtml(note, isDeleteDialogOpen) {
    if (!isDeleteDialogOpen) {
        return /*HTML*/ `<div class="dialog-backdrop" hidden></div>`;
    }

    return /*HTML*/ `
        <div class="dialog-backdrop">
            <div class="dialog">
                <h2 class="dialog-title">Slette notatet?</h2>
                <p class="dialog-text">
                    «${note.title}» blir permanent slettet.
                    Dette kan ikke angres.
                </p>
                <div class="dialog-actions">
                    <button class="dialog-btn" type="button" onclick="cancelNote();">
                        Avbryt
                    </button>
                    <button class="dialog-btn danger" type="button" onclick="deleteNote();">
                        Slett notat
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getTags(tags, styleTag, modelObject) {
    const isSelected = selectedNote().topics;
    let html = "";

    if (modelObject) {
        for (let tag of tags) {
            html += /*HTML*/ `
                <span class="${styleTag}">
                    ${findObjectById(modelObject, tag).topic}
                </span>
            `;
        }
        return html;
    } else {
        for (let tag of tags) {
            html += /* HTML */ `
                <span
                    class="${styleTag} ${isSelected.includes(tag.id) ? "selected" : ""}"
                    onclick="toggleTopic(${tag.id})"
                >
                    ${tag.topic}
                </span>
            `;
        }
        return html;
    }
}

function getNotes() {
    const data = model.data;
    const notes = model.data.notes;
    let html = "";
    resetNoteActions();

    for (let note of notes) {
        html += /* HTML */ `
            <div class="note-card" onclick="openNote(${note.id})">
                <div class="note-card-header">
                    <span class="note-date">${formatDate(note.date)}</span>
                </div>
                <h2>${note.title}</h2>
                <p>${note.description}</p>
                <div class="tags">${getTags(note.topics, "tag", data.topics)}</div>
            </div>
        `;
    }
    return html;
}
