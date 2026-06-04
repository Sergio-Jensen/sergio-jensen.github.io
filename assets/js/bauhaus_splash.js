(function() {
    var storageKey = "bauhausSplashEntered";
    var splash = document.getElementById("bauhaus-splash");
    if (!splash) return;

    function hasEntered() {
        try {
            return sessionStorage.getItem(storageKey) === "1";
        } catch (error) {
            return false;
        }
    }

    function rememberEntered() {
        try {
            sessionStorage.setItem(storageKey, "1");
        } catch (error) {}
    }

    function removeSplash() {
        splash.hidden = true;
        document.body.classList.remove("bauhaus-splash-active");
        document.documentElement.classList.add("bauhaus-splash-seen");
    }

    function enterSite() {
        if (splash.classList.contains("is-leaving")) return;
        rememberEntered();
        splash.classList.add("is-leaving");
        window.dispatchEvent(new CustomEvent("bauhausSplashEntered"));
        window.setTimeout(removeSplash, 1450);
    }

    if (hasEntered()) {
        removeSplash();
        return;
    }

    document.body.classList.add("bauhaus-splash-active");
    splash.addEventListener("click", enterSite);
    splash.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            enterSite();
        }
    });
})();
