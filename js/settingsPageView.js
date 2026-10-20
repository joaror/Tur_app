/* ==========================================================================
   settingsPageView.js – View for innstillingssiden.

   View leser modellen og lager HTML, men endrer ikke modellen.
   Alle brukerhandlinger går via controller-funksjoner i settingsPageController.js:

     addActivity()        – legger til en ny aktivitet
     removeActivity(id)   – sletter en aktivitet
     addTopic()           – legger til en ny emneknagg
     removeTopic(id)      – sletter en emneknagg
     addCounty()          – legger til et nytt fylke
     removeCounty(id)     – sletter et fylke

   Modell-state som dette viewet forventer:
     model.app.currentPage = "settingsPage"
     model.viewState.settingsPage.newActivity  – navnet på aktiviteten som skal legges til
     model.viewState.settingsPage.newTopic     – navnet på emneknaggen som skal legges til
     model.viewState.settingsPage.newCounty    – navnet på fylket som skal legges til
     model.viewState.settingsPage.errorMessage – feilmelding, eller "" når alt er i orden

   Lister med aktiviteter, emneknagger og fylker ligger i modellen:
     model.data.activities
     model.data.topics
     model.data.counties

   Funksjoner:
     updateViewSettingsPage()                                  // tegner hele siden
     createSettingsSectionHtml(title, chipsHtml, fieldName, placeholder, addCall) // én seksjon
     createChipListHtml(list, keyName, chipClass, removeCall)  // chipene, med knapp for å slette
     createAddRowHtml(fieldName, placeholder, addCall)         // raden med tekstfelt og knapp
     createErrorMessageHtml(errorMessage)                      // feilmeldingen, hvis det er en
   ========================================================================== */

/* Innstillingssiden. Her kan brukeren legge til og slette aktiviteter,
   emneknagger og fylker. */
function updateViewSettingsPage() {
  const settings = model.viewState.settingsPage;

  const html = /*HTML*/ `
    <div class="page-settings" style="display: flex; justify-content: center;">
      <div class="phone-frame">
        ${createStatusBarHtml()}

        <header class="app-header app-header--compact">
          <h1>Innstillinger</h1>
        </header>

        <main class="content">
          ${createErrorMessageHtml(settings.errorMessage)}

          ${createSettingsSectionHtml(
            "Aktiviteter",
            createChipListHtml(
              model.data.activities,
              "activity",
              "chip-type",
              "removeActivity",
            ),
            "newActivity",
            "Ny turtype…",
            "addActivity();",
          )}

          ${createSettingsSectionHtml(
            "Emneknagger",
            createChipListHtml(
              model.data.topics,
              "topic",
              "chip-tag",
              "removeTopic",
            ),
            "newTopic",
            "Ny emneknagg…",
            "addTopic();",
          )}

          ${createSettingsSectionHtml(
            "Fylker",
            createChipListHtml(
              model.data.counties,
              "county",
              "chip-county",
              "removeCounty",
            ),
            "newCounty",
            "Nytt fylke…",
            "addCounty();",
          )}
        </main>

        ${createBottomNavHtml("settingsPage")}
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML = html;
}

/* En seksjon i innstillingene. Alle tre seksjonene har samme oppbygning:
   en tittel, en liste med chips, og en rad der brukeren kan skrive inn
   navnet på det som skal legges til. */
function createSettingsSectionHtml(
  title,
  chipsHtml,
  fieldName,
  placeholder,
  addCall,
) {
  return /*HTML*/ `
    <div class="manager-section">
      <h2>${title}</h2>

      <div class="section-card">
        ${chipsHtml}
        ${createAddRowHtml(fieldName, placeholder, addCall)}
      </div>
    </div>
  `;
}

/* Chipene med navnene på aktivitetene, emneknaggene eller fylkene.
   Hver chip har en knapp for å slette det som står på den. */
function createChipListHtml(list, keyName, chipClass, removeCall) {
  let html = /*HTML*/ `<div class="tag-list">`;

  for (const item of list) {
    html += /*HTML*/ `
      <span class="chip ${chipClass}">
        ${escapeHtml(item[keyName])}
        <button
          class="remove"
          type="button"
          title="Fjern"
          onclick="${removeCall}(${item.id});"
        >&times;</button>
      </span>
    `;
  }

  html += "</div>";

  return html;
}

/* Raden med tekstfelt og knappen som legger til. Teksten skrives rett
   inn i view state, slik som på de andre sidene. */
function createAddRowHtml(fieldName, placeholder, addCall) {
  const value = model.viewState.settingsPage[fieldName];

  return /*HTML*/ `
    <div class="add-row">
      <input
        type="text"
        placeholder="${placeholder}"
        value="${escapeHtml(value ? value : "")}"
        oninput="model.viewState.settingsPage.${fieldName} = this.value;"
      />
      <button class="add-btn" type="button" onclick="${addCall}">Legg til</button>
    </div>
  `;
}

/* Feilmeldingen vises bare når controlleren har satt en melding i view state. */
function createErrorMessageHtml(errorMessage) {
  if (!errorMessage) {
    return "";
  }

  return /*HTML*/ `<p class="login-error">${escapeHtml(errorMessage)}</p>`;
}
