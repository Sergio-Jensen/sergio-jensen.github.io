(function() {
    var splash = document.getElementById("bauhaus-splash");
    if (!splash) return;

    function removeSplash() {
        splash.hidden = true;
        document.body.classList.remove("bauhaus-splash-active");
        document.documentElement.classList.add("bauhaus-splash-seen");
    }

    function enterSite() {
        if (splash.classList.contains("is-leaving")) return;
        splash.classList.add("is-leaving");
        window.dispatchEvent(new CustomEvent("bauhausSplashEntered"));
        window.setTimeout(removeSplash, 1450);
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
