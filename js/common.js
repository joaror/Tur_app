/* ==========================================================================
   common.js – Hjelpefunksjoner og felles HTML

   Her bor det som gjenbrukes på flere sider (skall, statuslinje, bunnnavigasjon)
   og små hjelpefunksjoner som gjør koden i view og controller lesbar.
   ========================================================================== */

/* --- Felles HTML ---------------------------------------------------------- */

/* Statuslinja er felles for alle sider. */
function createStatusBarHtml() {
  return /*HTML*/ `
        <div class="status-bar">
            <span class="time">09:41</span>
            <div class="status-icons">
				<span class="svg-wifi svg-display svg-size-16"></span>
				<span class="svg-5g svg-display svg-size-16"></span>
				<span class="svg-battery svg-display svg-size-16"></span>
            </div>
        </div>
    `;
}

/* Bunnnavigasjonen er felles for alle sider. activePage avgjør hvilken
   fane som er valgt, og sendes til goToPage() i controlleren. */
function createBottomNavHtml(activePage) {
  const turerActive = activePage === "tripsPage";
  const sokActive = activePage === "searchPage";
  const notaterActive = activePage === "notesPage";
  const innstillingerActive = activePage === "settingsPage";

  return /*HTML*/ `
    <nav class="bottom-nav">
        <a class="nav-item ${turerActive ? "active" : ""}" onclick="goToPage('tripsPage');" href="#">
            <span class="svg-home svg-display svg-size-24"></span>
            <span>Turer</span>
        </a>
        
        <a class="nav-item ${notaterActive ? "active" : ""}" onclick="goToPage('notesPage');" href="#">
            <span class="svg-notes svg-display svg-size-24"></span>
            <span>Notater</span>
        </a>
        
        <a class="nav-item ${sokActive ? "active" : ""}" onclick="goToPage('searchPage');" href="#">
            <span class="svg-search svg-display svg-size-24"></span>
            <span>Søk</span>
        </a>            
        
        <a class="nav-item ${innstillingerActive ? "active" : ""}" onclick="goToPage('settingsPage');" href="#">
            <span class="svg-settings svg-display svg-size-24"></span>
            <span>Innstillinger</span>
        </a>
    </nav>
    `;
}

/* Den runde knappen som lager ny tur. */
function createFloatingActionHtml(onclick, title) {
  return /*HTML*/ `
        <a class="floating-action" title="${title}" onclick="${onclick}" href="#">
            <span class="svg-float"></span>
        </a>
    `;
}

function goToPage(page) {
  if (model.app.currentPage === page) {
    return;
  }

  model.app.currentPage = page;
  updateView();
}

/* Finner et objekt i en liste på id. Vi bruker alltid id, aldri
   plasseringen i arrayen, som identitet. */
function findObjectById(array, id) {
  for (const object of array) {
    if (object.id === id) {
      return object;
    }
  }

  return null;
}

/* Finner indeksen til et objekt i en liste på id. */
function findIndexById(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }

  return -1;
}

/* Finner et bilde i model.data.images på id. */
function findImageById(imageId) {
  return findObjectById(model.data.images, imageId);
}

/* Finner navnet på en aktivitet, f.eks. "Fisketur". */
function getActivityName(activityId) {
  const activity = findObjectById(model.data.activities, activityId);

  if (activity) {
    return activity.activity;
  }

  return "Ukjent aktivitet";
}

/* Finner navnet på et fylkesnavn, f.eks. "Nordland". */
function getCountyName(countyId) {
  const county = findObjectById(model.data.counties, countyId);

  if (county) {
    return county.county;
  }

  return "Ukjent fylke";
}

/* Formaterer "2026-10-30" til "30. okt. 2026". */
function formatDate(dateText) {
  if (!dateText) {
    return "";
  }

  const date = new Date(dateText);

  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* Kortere utdrag av en lang tekst, til kortene på turlisten. */
function createPreview(text) {
  if (!text) {
    return "";
  }

  const maxLength = 80;

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
}

/* Neste ledige id i en liste. Vi bruker den når vi lager nye
   turer og notater, slik at id-ene fortsetter etter der de slutter. */
function getNextId(array) {
  let biggestId = 0;

  for (const object of array) {
    if (object.id > biggestId) {
      biggestId = object.id;
    }
  }

  return biggestId + 1;
}

/* Sesongen regnes ut fra datoen, den lagres ikke på turen.
   Mars–mai er vår, juni–august er sommer, september–november er høst,
   desember–februar er vinter. Sesongene ligger i model.data.seasons,
   der vår er 1, sommer er 2, høst er 3 og vinter er 4. */
function getSeasonId(dateText) {
  if (!dateText) {
    return null;
  }

  const date = new Date(dateText);
  const month = date.getMonth();

  if (month >= 2 && month <= 4) {
    return 1;
  }

  if (month >= 5 && month <= 7) {
    return 2;
  }

  if (month >= 8 && month <= 10) {
    return 3;
  }

  return 4;
}

/* Navnet på sesongen. Vi slår opp i model.data.seasons, så det finnes
   bare ett sted som sier hva sesongene heter. */
function getSeasonName(dateText) {
  const seasonId = getSeasonId(dateText);

  if (seasonId === null) {
    return "";
  }

  const season = findObjectById(model.data.seasons, seasonId);

  if (season) {
    return season.season;
  }

  return "";
}

/* Tilbakeknappen i toppteksten. Den bruker goToPage() i controlleren.
   Skal vi gå tilbake til et skjema i stedet, kan vi sende inn en egen
   onclick, for eksempel "cancelEditTripForm();". */
function createBackButtonHtml(page, onclick) {
  const click = onclick ? onclick : `goToPage('${page}');`;

  return /*HTML*/ `
        <a class="back-btn" onclick="${click}" href="#" title="Tilbake">
			<span class="svg-back"></span>
        </a>
    `;
}

/* Tidspunkt brukt på nye og endrede turer, på samme format
   som updatedAt i modellen: 2026-10-06T19:24 */
function getTimestamp() {
  return new Date().toISOString().substring(0, 16);
}

/* Bygger <option>-taggene til en dropdown. Den valgte verdien
   markeres med selected. */
function createOptionHtml(value, text, selectedValue) {
  const selected = selectedValue === value ? " selected" : "";

  return /*HTML*/ `<option value="${value}"${selected}>${text}</option>`;
}
/* Tegner et bilde fra modellen. Hvert bilde peker på et motiv
   i model.data.imageTemplates, som er en ferdig inline-SVG. */
function createPictureSvgHtml(imageId) {
  const image = findObjectById(model.data.images, imageId);

  if (!image) {
    return "";
  }

  const template = findObjectById(model.data.imageTemplates, image.templateId);

  if (!template) {
    return "";
  }

  return template.svg;
}

/* Navnet på bildet. Det er motivet i model.data.imageTemplates som
   gir navnet, så bildet selv trenger ikke å lagre et eget navn. */
function getPictureLabel(imageId) {
  const image = findObjectById(model.data.images, imageId);

  if (!image) {
    return "Bilde";
  }

  const template = findObjectById(model.data.imageTemplates, image.templateId);

  if (template) {
    return template.label;
  }

  return "Bilde";
}

/* Gjør en tekst trygg å putte inn i HTML. Vi bruker den på tekst som
   kommer fra brukeren, for eksempel søkeord, titler og navn. */
function escapeHtml(text) {
  if (!text) {
    return "";
  }

  let escaped = text.split("&").join("&amp;");
  escaped = escaped.split("<").join("&lt;");
  escaped = escaped.split(">").join("&gt;");
  escaped = escaped.split('"').join("&quot;");

  return escaped;
}
