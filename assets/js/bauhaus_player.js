(function() {
    var storageKey = "bauhausFloatingPlayerState";
    var resumeKey = "bauhausFloatingPlayerResumeRequested";
    var iconBase = "./assets/images/";
    var tracks = [
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Suite Bergamasque, L. 75, CD 82 III. Clair de Lune.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Suite Bergamasque, L. 75, CD 82 I. Prélude.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Suite Bergamasque, L. 75, CD 82 II. Menuet.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Suite Bergamasque, L. 75, CD 82 IV. Passepied.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Deux Arabesques, L. 66, CD 74 I. Première Arabesque.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Deux Arabesques, L. 66, CD 74 II. Deuxième Arabesque.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 I. Doctor Gradus ad Parnassum.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 II. Jimbo's Lullaby.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 III. Serenade for the Doll.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 IV. The Snow is Dancing.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 V. The Little Shepherd.mp3" },
        { src: "./assets/audio/[Jean-Efflam Bavouzet] - Children's Corner, L. 113, CD 119 VI. Golliwogg's Cakewalk.mp3" }
    ].map(function(track) {
        return Object.assign(track, parseTrackName(track.src));
    });

    function parseTrackName(src) {
        var file = decodeURIComponent(src.split("/").pop() || "Untitled.mp3").replace(/\.[^.]+$/, "");
        var match = file.match(/^\[([^\]]+)\]\s*-\s*(.+)$/);
        if (match) {
            return {
                author: match[1].trim(),
                title: match[2].trim()
            };
        }
        return {
            author: "",
            title: file.replace(/[_-]+/g, " ").trim()
        };
    }

    function createPlayerMarkup() {
        if (document.getElementById("bauhaus-player")) return;
        var player = document.createElement("div");
        player.className = "bauhaus-floating-player";
        player.id = "bauhaus-player";
        player.setAttribute("aria-label", "Floating music player");
        player.innerHTML = [
            '<div class="bauhaus-player-strip" aria-hidden="true"></div>',
            '<button type="button" class="bauhaus-player-toggle" id="bauhaus-player-toggle" aria-expanded="true" aria-label="Toggle player">',
                '<span class="bauhaus-toggle-track"><span class="bauhaus-toggle-thumb"></span></span>',
                '<span class="bauhaus-toggle-label">PLAYER</span>',
            '</button>',
            '<div class="bauhaus-player-title-row">',
                '<div class="bauhaus-track-copy">',
                    '<span class="bauhaus-track-title" id="bauhaus-track-title">Loading</span>',
                    '<span class="bauhaus-track-author" id="bauhaus-track-author"></span>',
                '</div>',
                '<button type="button" class="bauhaus-list-toggle" id="bauhaus-list-toggle" aria-expanded="false" aria-controls="bauhaus-track-list">LIST</button>',
            '</div>',
            '<div class="bauhaus-track-list" id="bauhaus-track-list" hidden></div>',
            '<div class="bauhaus-player-controls">',
                '<button type="button" class="bauhaus-player-button square" id="bauhaus-prev" aria-label="Previous track"><img src="' + iconBase + 'left.png" alt=""></button>',
                '<button type="button" class="bauhaus-player-button play" id="bauhaus-play" aria-label="Play or pause" data-play-icon="' + iconBase + 'play.png" data-stop-icon="' + iconBase + 'stop.png"><img src="' + iconBase + 'play.png" alt=""></button>',
                '<button type="button" class="bauhaus-player-button square" id="bauhaus-next" aria-label="Next track"><img src="' + iconBase + 'right.png" alt=""></button>',
                '<div class="bauhaus-progress-wrap">',
                    '<input type="range" id="bauhaus-progress" min="0" max="100" value="0" aria-label="Track progress">',
                    '<div class="bauhaus-player-time" id="bauhaus-time">0:00</div>',
                '</div>',
            '</div>',
            '<audio id="homepage-audio" autoplay preload="auto"></audio>'
        ].join("");
        document.body.appendChild(player);
    }

    function readState() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "{}");
        } catch (error) {
            return {};
        }
    }

    function writeState(state) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {}
    }

    function formatTime(value) {
        if (!Number.isFinite(value)) return "0:00";
        var minutes = Math.floor(value / 60);
        var seconds = Math.floor(value % 60).toString().padStart(2, "0");
        return minutes + ":" + seconds;
    }

    function trackUrl(src) {
        var encoded = src.split("/").map(function(part) {
            if (part === "." || part === ".." || part === "") return part;
            return encodeURIComponent(part);
        }).join("/");
        return new URL(encoded, window.location.href).href;
    }

    function initPlayer() {
        if (!tracks.length) return;
        if (document.body.dataset.bauhausPlayerReady === "true") return;
        document.body.dataset.bauhausPlayerReady = "true";
        createPlayerMarkup();

        var player = document.getElementById("bauhaus-player");
        var toggle = document.getElementById("bauhaus-player-toggle");
        var audio = document.getElementById("homepage-audio");
        var play = document.getElementById("bauhaus-play");
        var prev = document.getElementById("bauhaus-prev");
        var next = document.getElementById("bauhaus-next");
        var progress = document.getElementById("bauhaus-progress");
        var title = document.getElementById("bauhaus-track-title");
        var author = document.getElementById("bauhaus-track-author");
        var listToggle = document.getElementById("bauhaus-list-toggle");
        var trackList = document.getElementById("bauhaus-track-list");
        var time = document.getElementById("bauhaus-time");
        var stored = readState();
        var current = hasResumeRequest() && Number.isInteger(stored.current) ? stored.current : 0;
        var pendingTime = Number(stored.currentTime) || 0;
        var wantsPlaying = true;
        var dragging = false;
        var dragOffsetX = 0;
        var dragOffsetY = 0;
        var pageLeaving = false;
        var loadErrorCount = 0;
        var firstAutoplayAttempt = true;
        var isExpanded = stored.expanded !== false;

        current = ((current % tracks.length) + tracks.length) % tracks.length;

        function saveState(extra) {
            writeState(Object.assign({
                current: current,
                currentTime: audio.currentTime || pendingTime || 0,
                playing: wantsPlaying,
                left: player.style.left || stored.left || "",
                top: player.style.top || stored.top || "",
                expanded: isExpanded
            }, extra || {}));
        }

        function setPlayIcon(isPlaying) {
            var image = play.querySelector("img");
            if (!image) return;
            image.src = isPlaying ? play.dataset.stopIcon : play.dataset.playIcon;
        }

        function isInteractiveTarget(target) {
            return Boolean(target.closest("button, input, a, audio, .bauhaus-progress-wrap, .bauhaus-track-list"));
        }

        function setExpanded(nextExpanded) {
            isExpanded = nextExpanded;
            player.classList.toggle("is-collapsed", !isExpanded);
            toggle.setAttribute("aria-expanded", String(isExpanded));
            saveState({ expanded: isExpanded });
            updateListDirection();
        }

        function updateListDirection() {
            var rect = player.getBoundingClientRect();
            var spaceBelow = window.innerHeight - rect.bottom;
            var spaceAbove = rect.top;
            var expectedListHeight = Math.min(320, window.innerHeight * 0.44);
            var openUp = spaceBelow < expectedListHeight && spaceAbove > spaceBelow;
            player.classList.toggle("list-opens-up", openUp);
            return openUp;
        }

        function pinPlayerForList(openUp, beforeRect) {
            var afterRect = player.getBoundingClientRect();
            var left = beforeRect.left;
            var top = openUp ? beforeRect.bottom - afterRect.height : beforeRect.top;
            var position = clampPlayer(left, top);
            player.style.left = position.left + "px";
            player.style.top = position.top + "px";
            player.style.right = "auto";
            player.style.bottom = "auto";
            saveState();
        }

        function closeTrackList() {
            trackList.hidden = true;
            player.classList.remove("is-list-open");
            listToggle.setAttribute("aria-expanded", "false");
        }

        function requestResume() {
            wantsPlaying = true;
            try {
                sessionStorage.setItem(resumeKey, "1");
            } catch (error) {}
            saveState({ playing: true });
        }

        function clearResumeRequest() {
            try {
                sessionStorage.removeItem(resumeKey);
            } catch (error) {}
        }

        function hasResumeRequest() {
            try {
                return sessionStorage.getItem(resumeKey) === "1";
            } catch (error) {
                return false;
            }
        }

        function normalizePageUrl(href) {
            var url;
            try {
                url = new URL(href, window.location.href);
            } catch (error) {
                return null;
            }
            if (url.origin !== window.location.origin) return null;
            if (url.hash && url.pathname === window.location.pathname && url.search === window.location.search) {
                return null;
            }
            var path = url.pathname.replace(/\/+$/, "");
            var base = window.location.pathname.replace(/[^/]*$/, "");
            if (path === base.replace(/\/+$/, "") || /\/index(?:\.html)?$/.test(path)) {
                url.pathname = base + "index.html";
                url.hash = "";
                return url;
            }
            if (/\/publications?$/.test(path) || /\/publications?\.html$/.test(path)) {
                url.pathname = base + "publications.html";
                url.hash = "";
                return url;
            }
            return null;
        }

        function revivePageBehaviors() {
            document.querySelectorAll("img.lazy[data-src]").forEach(function(image) {
                image.setAttribute("src", image.getAttribute("data-src"));
                image.setAttribute("data-isLoaded", "1");
            });
            document.querySelectorAll("div.lazy[data-src]").forEach(function(block) {
                block.style.backgroundImage = "url('" + block.getAttribute("data-src") + "')";
                block.style.backgroundSize = "cover";
                block.style.backgroundPosition = "center";
            });
            if (window.jQuery) {
                if (jQuery.fn.tooltip) {
                    jQuery('[data-toggle="tooltip"]').tooltip();
                }
                if (jQuery.fn.scrollspy && document.body.getAttribute("data-spy") === "scroll") {
                    jQuery(document.body).scrollspy({ target: document.body.getAttribute("data-target"), offset: 100 });
                }
            }
            if (typeof window.renderMathInElement === "function") {
                window.renderMathInElement(document.body, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ],
                    throwOnError: false
                });
            }
        }

        function replacePage(nextDocument, nextUrl, scrollToTop, shouldPushState) {
            var keptPlayer = player;
            var wasPlaying = wantsPlaying;
            if (keptPlayer.parentNode) {
                keptPlayer.parentNode.removeChild(keptPlayer);
            }
            document.title = nextDocument.title;
            document.body.className = nextDocument.body.className;
            document.body.setAttribute("class", nextDocument.body.getAttribute("class") || "");
            Array.from(document.body.attributes).forEach(function(attribute) {
                if (attribute.name !== "class") {
                    document.body.removeAttribute(attribute.name);
                }
            });
            Array.from(nextDocument.body.attributes).forEach(function(attribute) {
                document.body.setAttribute(attribute.name, attribute.value);
            });
            nextDocument.querySelectorAll("#bauhaus-player").forEach(function(node) {
                node.remove();
            });
            document.body.innerHTML = nextDocument.body.innerHTML;
            document.body.appendChild(keptPlayer);
            pageLeaving = false;
            wantsPlaying = wasPlaying || true;
            if (shouldPushState) {
                history.pushState({ bauhausPage: true }, nextDocument.title, nextUrl.href);
            }
            revivePageBehaviors();
            if (scrollToTop) {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }
            if (wantsPlaying) {
                tryPlay();
            }
        }

        function softNavigate(href, scrollToTop, shouldPushState) {
            var nextUrl = normalizePageUrl(href);
            if (!nextUrl) return false;
            requestResume();
            fetch(nextUrl.href, { credentials: "same-origin" }).then(function(response) {
                if (!response.ok) throw new Error("Navigation failed");
                return response.text();
            }).then(function(html) {
                var parser = new DOMParser();
                replacePage(parser.parseFromString(html, "text/html"), nextUrl, scrollToTop, shouldPushState);
            }).catch(function() {
                window.location.href = nextUrl.href;
            });
            return true;
        }

        function renderTrackList() {
            trackList.innerHTML = "";
            tracks.forEach(function(track, index) {
                var button = document.createElement("button");
                var itemTitle = document.createElement("span");
                var itemAuthor = document.createElement("small");
                button.type = "button";
                button.className = "bauhaus-track-list-item" + (index === current ? " active" : "");
                itemTitle.textContent = track.title;
                itemAuthor.textContent = track.author;
                button.appendChild(itemTitle);
                button.appendChild(itemAuthor);
                button.addEventListener("click", function() {
                    loadTrack(index, true, 0);
                    closeTrackList();
                });
                trackList.appendChild(button);
            });
        }

        function updateProgress() {
            if (!audio.duration) {
                progress.value = "0";
                progress.style.setProperty("--progress", "0%");
                time.textContent = "0:00";
                return;
            }
            var percent = (audio.currentTime / audio.duration) * 100;
            progress.value = String(percent);
            progress.style.setProperty("--progress", percent + "%");
            time.textContent = formatTime(audio.duration - audio.currentTime);
        }

        function loadTrack(index, shouldPlay, startTime) {
            current = ((index % tracks.length) + tracks.length) % tracks.length;
            pendingTime = Math.max(0, Number(startTime) || 0);
            var nextSrc = trackUrl(tracks[current].src);
            var currentSrc = audio.currentSrc || audio.src;
            if (currentSrc !== nextSrc) {
                audio.src = nextSrc;
                audio.load();
            }
            title.textContent = tracks[current].title;
            author.textContent = tracks[current].author;
            setPlayIcon(false);
            renderTrackList();
            updateProgress();
            saveState({ current: current, currentTime: pendingTime, playing: shouldPlay });
            if (shouldPlay) {
                tryPlay();
            }
        }

        function tryPlay() {
            if (!audio.src) {
                loadTrack(current, false, pendingTime);
            }
            wantsPlaying = true;
            audio.autoplay = true;
            audio.setAttribute("autoplay", "");
            audio.setAttribute("muted", "");
            audio.setAttribute("playsinline", "");
            if (firstAutoplayAttempt) {
                audio.muted = true;
            } else {
                audio.muted = false;
            }
            audio.volume = 1;
            function restoreSound() {
                audio.muted = false;
                audio.removeAttribute("muted");
                audio.volume = 1;
            }
            audio.play().then(function() {
                if (firstAutoplayAttempt) {
                    window.setTimeout(restoreSound, 300);
                    window.setTimeout(restoreSound, 900);
                    window.setTimeout(restoreSound, 1600);
                }
                firstAutoplayAttempt = false;
                saveState({ playing: true });
            }).catch(function() {
                audio.muted = true;
                audio.play().then(function() {
                    window.setTimeout(restoreSound, 300);
                    window.setTimeout(restoreSound, 900);
                    window.setTimeout(restoreSound, 1600);
                    firstAutoplayAttempt = false;
                    saveState({ playing: true });
                }).catch(function() {
                    saveState({ playing: true });
                });
            });
        }

        function clampPlayer(left, top) {
            var rect = player.getBoundingClientRect();
            var maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
            var maxTop = Math.max(8, window.innerHeight - rect.height - 8);
            return {
                left: Math.max(8, Math.min(left, maxLeft)),
                top: Math.max(8, Math.min(top, maxTop))
            };
        }

        function restorePosition() {
            if (stored.left && stored.top) {
                var position = clampPlayer(parseFloat(stored.left), parseFloat(stored.top));
                player.style.left = position.left + "px";
                player.style.top = position.top + "px";
                player.style.right = "auto";
                player.style.bottom = "auto";
            }
        }

        audio.addEventListener("loadedmetadata", function() {
            if (pendingTime && audio.duration) {
                audio.currentTime = Math.min(pendingTime, Math.max(0, audio.duration - 1));
                pendingTime = 0;
            }
            updateProgress();
            if (wantsPlaying) {
                tryPlay();
            }
        });

        audio.addEventListener("play", function() {
            wantsPlaying = true;
            setPlayIcon(true);
            clearResumeRequest();
            saveState({ playing: true });
        });

        audio.addEventListener("pause", function() {
            setPlayIcon(false);
            if (!pageLeaving) {
                saveState({ playing: wantsPlaying });
            }
        });

        audio.addEventListener("ended", function() {
            loadTrack(current + 1, true, 0);
        });

        audio.addEventListener("error", function() {
            loadErrorCount += 1;
            if (loadErrorCount < tracks.length) {
                loadTrack(current + 1, true, 0);
            }
        });

        audio.addEventListener("canplay", function() {
            loadErrorCount = 0;
            if (wantsPlaying) {
                tryPlay();
            }
        });

        audio.addEventListener("timeupdate", function() {
            updateProgress();
            saveState();
        });

        progress.addEventListener("input", function() {
            if (audio.duration) {
                audio.currentTime = (Number(progress.value) / 100) * audio.duration;
                updateProgress();
                saveState();
            }
        });

        play.addEventListener("click", function() {
            if (audio.paused) {
                requestResume();
                tryPlay();
            } else {
                wantsPlaying = false;
                clearResumeRequest();
                audio.pause();
                saveState({ playing: false });
            }
        });

        prev.addEventListener("click", function() {
            requestResume();
            loadTrack(current - 1, true, 0);
        });

        next.addEventListener("click", function() {
            requestResume();
            loadTrack(current + 1, true, 0);
        });

        listToggle.addEventListener("click", function() {
            var willOpen = trackList.hidden;
            var beforeRect = player.getBoundingClientRect();
            if (willOpen) {
                var openUp = updateListDirection();
                trackList.hidden = false;
                player.classList.add("is-list-open");
                listToggle.setAttribute("aria-expanded", "true");
                pinPlayerForList(openUp, beforeRect);
            } else {
                closeTrackList();
            }
        });

        toggle.addEventListener("click", function(event) {
            event.stopPropagation();
            setExpanded(!isExpanded);
        });

        player.addEventListener("pointerdown", function(event) {
            if (isInteractiveTarget(event.target)) return;
            dragging = true;
            var rect = player.getBoundingClientRect();
            dragOffsetX = event.clientX - rect.left;
            dragOffsetY = event.clientY - rect.top;
            player.setPointerCapture(event.pointerId);
        });

        player.addEventListener("pointermove", function(event) {
            if (!dragging) return;
            var position = clampPlayer(event.clientX - dragOffsetX, event.clientY - dragOffsetY);
            player.style.left = position.left + "px";
            player.style.top = position.top + "px";
            player.style.right = "auto";
            player.style.bottom = "auto";
            updateListDirection();
        });

        player.addEventListener("pointerup", function(event) {
            dragging = false;
            player.releasePointerCapture(event.pointerId);
            saveState();
        });

        window.addEventListener("resize", function() {
            if (player.style.left && player.style.top) {
                var position = clampPlayer(parseFloat(player.style.left), parseFloat(player.style.top));
                player.style.left = position.left + "px";
                player.style.top = position.top + "px";
                updateListDirection();
                saveState();
            }
        });

        window.addEventListener("beforeunload", function() {
            pageLeaving = true;
            saveState({ playing: wantsPlaying });
        });

        document.addEventListener("click", function(event) {
            var link = event.target.closest("a[href]");
            if (link && link.href && link.target !== "_blank" && normalizePageUrl(link.href)) {
                event.preventDefault();
                softNavigate(link.href, true, true);
                return;
            }
            if (link && link.href && link.target !== "_blank") {
                pageLeaving = true;
                if (wantsPlaying) {
                    requestResume();
                }
                saveState({ playing: wantsPlaying });
            }
        }, true);

        window.addEventListener("popstate", function() {
            softNavigate(window.location.href, false, false);
        });

        document.addEventListener("pointerdown", function autoplayAfterGesture() {
            if (wantsPlaying) {
                tryPlay();
            }
            document.removeEventListener("pointerdown", autoplayAfterGesture);
        }, { once: true });

        restorePosition();
        player.classList.toggle("is-list-open", !trackList.hidden);
        setExpanded(isExpanded);
        setPlayIcon(!audio.paused);
        updateListDirection();
        if (hasResumeRequest()) {
            wantsPlaying = true;
        }
        loadTrack(current, wantsPlaying, pendingTime);
        if (wantsPlaying) {
            window.addEventListener("load", tryPlay, { once: true });
            window.addEventListener("pageshow", tryPlay, { once: true });
            tryPlay();
        }
    }

    if (document.body) {
        initPlayer();
    } else {
        document.addEventListener("DOMContentLoaded", initPlayer);
    }
})();
