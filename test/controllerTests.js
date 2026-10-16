/* ==========================================================================
   controllerTests.js – QUnit-tester for loginPageController.js

   Vi tester controller-logikken ved å kontrollere hvordan modellen endres,
   slik retningslinjene sier. Viewet tegnes ikke i disse testene: updateView()
   er erstattet med en teller, slik at vi kan telle hvor mange ganger
   controlleren ber om ny HTML uten å være avhengig av de andre sidene.
   ========================================================================== */

/* Antall ganger updateView() har blitt kalt siden siste reset. */
let updateViewCallCount = 0;

/* Setter loginPage tilbake til utgangspunktet før hver test. */
function resetLoginTest() {
    model.app.currentPage = "loginPage";
    model.viewState.loginPage.userInput = "";
    model.viewState.loginPage.passwordInput = "";
    model.viewState.loginPage.isPasswordVisible = false;
    model.viewState.loginPage.errorMessage = "";
    updateViewCallCount = 0;
}

/* Kort hjelp: sett brukerens innskrevne data. */
function fillLoginTest(userInput, passwordInput) {
    model.viewState.loginPage.userInput = userInput;
    model.viewState.loginPage.passwordInput = passwordInput;
}

QUnit.module("handleLogin", function () {
    QUnit.test("tomt e-postfelt gir feilmelding", function (assert) {
        resetLoginTest();
        fillLoginTest("", "hemmelig");

        const result = handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "errorMessage er satt",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
        assert.equal(result, false, "skjemaet ble ikke sendt");
    });

    QUnit.test("tomt passordfelt gir feilmelding", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "");

        handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "errorMessage er satt",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });

    QUnit.test("kun mellomrom teller som tomt", function (assert) {
        resetLoginTest();
        fillLoginTest("   ", "hemmelig");

        handleLogin();

        assert.equal(
            model.viewState.loginPage.errorMessage,
            "Fyll inn både e-post og passord.",
            "mellomrom er trimmet bort før sjekken",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });

    QUnit.test("begge felt fylt logger inn", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");

        const result = handleLogin();

        assert.equal(model.app.currentPage, "tripsPage", "vi går til turer");
        assert.equal(model.viewState.loginPage.errorMessage, "", "ingen feilmelding");
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
        assert.equal(result, false, "skjemaet ble ikke sendt");
    });

    QUnit.test("innlogging nullstiller passord og øyevisning", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");
        model.viewState.loginPage.isPasswordVisible = true;

        handleLogin();

        assert.equal(model.viewState.loginPage.passwordInput, "", "passordet er tømt");
        assert.equal(model.viewState.loginPage.isPasswordVisible, false, "passordet er skjult");
        assert.equal(
            model.viewState.loginPage.userInput,
            "terje@example.no",
            "e-posten beholdes, så brukeren slipper skrive den igjen",
        );
    });

    QUnit.test("tidligere feilmelding fjernes ved vellykket innlogging", function (assert) {
        resetLoginTest();
        fillLoginTest("", "");
        handleLogin();
        assert.notEqual(model.viewState.loginPage.errorMessage, "", "først er det en feil");

        fillLoginTest("terje@example.no", "hemmelig");
        handleLogin();

        assert.equal(model.viewState.loginPage.errorMessage, "", "meldingen er borte");
    });
});

QUnit.module("togglePasswordVisibility", function () {
    QUnit.test("skjult passord blir synlig", function (assert) {
        resetLoginTest();

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            true,
            "isPasswordVisible er true",
        );
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("synlig passord blir skjult", function (assert) {
        resetLoginTest();
        model.viewState.loginPage.isPasswordVisible = true;

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            false,
            "isPasswordVisible er false",
        );
        assert.equal(updateViewCallCount, 1, "updateView ble kalt én gang");
    });

    QUnit.test("to trykk gir tilbake til start", function (assert) {
        resetLoginTest();

        togglePasswordVisibility();
        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.isPasswordVisible,
            false,
            "isPasswordVisible er false igjen",
        );
        assert.equal(updateViewCallCount, 2, "updateView ble kalt to ganger");
    });

    QUnit.test("funksjonen endrer ikke passordet", function (assert) {
        resetLoginTest();
        fillLoginTest("terje@example.no", "hemmelig");

        togglePasswordVisibility();

        assert.equal(
            model.viewState.loginPage.passwordInput,
            "hemmelig",
            "passordet står uendret",
        );
        assert.equal(model.app.currentPage, "loginPage", "vi blir på innloggingen");
    });
});