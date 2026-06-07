(function() {
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    var trail = document.createElement("div");
    trail.className = "bauhaus-cursor-trail";
    trail.setAttribute("aria-hidden", "true");
    document.body.appendChild(trail);

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var x = targetX;
    var y = targetY;
    var lastX = x;
    var lastY = y;
    var visible = false;

    function show() {
        if (visible) return;
        visible = true;
        trail.classList.add("is-visible");
    }

    function hide() {
        visible = false;
        trail.classList.remove("is-visible");
    }

    document.addEventListener("mousemove", function(event) {
        targetX = event.clientX;
        targetY = event.clientY;
        show();
    }, { passive: true });

    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    function tick() {
        x += (targetX - x) * 0.18;
        y += (targetY - y) * 0.18;
        trail.style.transform = "translate3d(" + x + "px," + y + "px,0)";
        lastX = x;
        lastY = y;
        window.requestAnimationFrame(tick);
    }

    tick();
})();
