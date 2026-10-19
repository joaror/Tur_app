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
                ${createFloatingActionHtml("goToPage('editNotePage');", "Nytt notat")}
            </div>
        </div>
    `;
}

// Denne må du se mer på Joakim ++ Funker til notater. 
// Kan det være noe mer i common? Se på senere.
// Topics må i newnote i viewstates. se mer på dette.

// 

function getTags(tags, styletag, modelobject) {
    let html = "";
    for (let tag of tags) {
        console.log(tag)
        html += /* HTML */ `
            <span class="${styletag}" 
                >${modelobject ? findObjectById(modelobject, tag).topic : tag.topic}
            </span>
        `;
    }
    return html;
}

function getNotes() {
    const data = model.data;
    let html = "";

    for (let note of data.notes) {
        html += /* HTML */ `
            <a class="note-card" href="notat-detaljer.html">
                <div class="note-card-header">
                    <span class="note-date">${note.date}</span>
                </div>
                <h2>${note.title}</h2>
                <p>${note.description}</p>
                <div class="tags">
                    ${getTags(findObjectById(data.notes, note.id).topics, "tag", data.topics)}
                </div>
            </a>
        `;
    }
    return html;
}

// prototype rest 45 117
// plussen funker ikke, lnje 16

// topics knapper...


// .form-body {
//   flex: 1;
//   overflow-y: auto;
//   padding: 20px;  ++++
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// }

// Fjerna padding 20px fra css for riktig plassering av skjemaet. +
// Må ha hjelpe funsksjon for mating av skjemafeltene til modell?
// Endra emneknaggenes htmltag fra div til span siden disse tegnes opp inline. +
// Legg til emneknagger må ordnes. Knapper? må ha id fra modell.

function updateViewEditNotesPage() {
    const html = /*HTML*/ `
        <div class="page-notes" style="display: flex; justify-content: center;">
            <div class="phone-frame">
                ${createStatusBarHtml()}
                
                <header class="app-header">
                    <h1>Nytt notat</h1>
                </header>
                
                <main class="content">
                    <div class="form-body">
                        <div class="field">
                            <label>Tittel</label>
                            <input type="text" onchange="model.viewState.newNotePage.title = this.value" placeholder="f.eks. Sesongplanlegging vinter 2027" />
                        </div>
                        <div class="field">
                            <label>Dato</label>
                            <input type="date" onchange="model.viewState.newNotePage.date = this.value"/>
                        </div>
                        <div class="field">
                            <label for="notat">Notat</label>
                            <div class="textarea-wrap">
                                <textarea id="notat" onchange="model.viewState.newNotePage.description = this.value" placeholder="Skriv dine tanker, refleksjoner eller planer her..."></textarea>
                                <button type="button" class="mic-btn" id="micBtn" title="Snakk inn notat">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                                </button>
                            </div>
                            <p class="mic-status" id="micStatus" hidden></p>
                        </div>

                        <div class="tags-field">
                            <label>Emneknagger</label>
                            <div class="tag-chips">
                                ${getTags(model.data.topics, "chip")}
                            </div>
                            </main>
                            
                            <div class="action-bar">
                                <button class="btn btn-secondary" onclick="location.href='tur-logg.html'">Avbryt</button>
                                <button class="btn btn-primary" onclick="addNewNote()">Lagre</button>
                            </div>
                        </div>
                    </div>
                `;

    document.getElementById("app").innerHTML = html;

    //   ${createBottomNavHtml("notesPage")}
}
