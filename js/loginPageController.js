/* ==========================================================================
   loginPageController.js – Controller for innloggingssiden

   Dette er en ren frontend uten backend, så vi "logger inn" uten å sjekke
   mot en server: er begge feltene fylt, regnes brukeren som innlogget.

   Brukerhandlinger:
     handleLogin()               – Logg inn-knappen
     togglePasswordVisibility()  – Øynet som viser/skjuler passord
   ========================================================================== */

function handleLogin() {
  const login = model.viewState.loginPage;

  const userInput = login.userInput.trim();
  const passwordInput = login.passwordInput.trim();

  if (userInput === "" || passwordInput === "") {
    login.errorMessage = "Fyll inn både e-post og passord.";
    updateView();
    return false;
  }

  login.errorMessage = "";
  login.passwordInput = "";
  login.isPasswordVisible = false;

  model.app.currentPage = "tripsPage";
  updateView();

  return false;
}

function togglePasswordVisibility() {
  const login = model.viewState.loginPage;

  login.isPasswordVisible = !login.isPasswordVisible;
  updateView();
}
