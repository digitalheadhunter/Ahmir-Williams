/* ShelfReady — shared site behavior: nav toggle + waitlist storage helpers.
   Everything is stored client-side in localStorage. No backend, no login. */

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }
})();

var ShelfReady = (function () {
  var WAITLIST_KEY = "shelfready_waitlist";

  function readAll() {
    try {
      var raw = localStorage.getItem(WAITLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function count() {
    return readAll().length;
  }

  function addEntry(entry) {
    var all = readAll();
    all.push(
      Object.assign(
        {
          id: "wl_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          submittedAt: new Date().toISOString(),
        },
        entry
      )
    );
    try {
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(all));
    } catch (e) {
      /* storage unavailable (private mode, quota) — fail silently, UI still shows success */
    }
    return all.length;
  }

  /* Wires up a <form> with data-waitlist-form to store submissions and
     swap in a success state. Expects a sibling [data-success] element. */
  function bindWaitlistForm(form, opts) {
    opts = opts || {};
    var successEl = form.parentElement.querySelector("[data-success]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var entry = {
        name: (data.get("name") || "").toString().trim(),
        email: (data.get("email") || "").toString().trim(),
        recipe: (data.get("recipe") || "").toString().trim(),
        source: opts.source || "landing",
      };
      if (opts.extra) {
        entry.context = opts.extra();
      }
      if (!entry.email) return;

      addEntry(entry);

      form.classList.add("hidden");
      if (successEl) {
        successEl.classList.add("visible");
      }
      var countEl = document.querySelector("[data-waitlist-count]");
      if (countEl) {
        renderCount(countEl);
      }
      if (typeof opts.onSuccess === "function") {
        opts.onSuccess(entry);
      }
    });
  }

  function renderCount(el) {
    var n = count();
    var base = 128; // baseline so the section reads meaningfully pre-launch
    var total = base + n;
    el.textContent =
      total.toLocaleString() + " people have joined the ShelfReady waitlist";
  }

  return {
    addEntry: addEntry,
    count: count,
    bindWaitlistForm: bindWaitlistForm,
    renderCount: renderCount,
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  var countEl = document.querySelector("[data-waitlist-count]");
  if (countEl) {
    ShelfReady.renderCount(countEl);
  }
});
