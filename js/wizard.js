/* ShelfReady — Intake Wizard
   Multi-step form, all state kept in memory + localStorage. Optional to
   complete: users can stop at any step, nothing is required until submit. */

(function () {
  var TOTAL_STEPS = 4;
  var currentStep = 1;

  var form = document.getElementById("wizard-form");
  var steps = form.querySelectorAll(".wizard-step");
  var progressTrack = document.getElementById("progress-track");
  var progressLabel = document.getElementById("progress-label");
  var btnBack = document.getElementById("btn-back");
  var btnNext = document.getElementById("btn-next");
  var btnSubmit = document.getElementById("btn-submit");
  var complete = document.getElementById("wizard-complete");

  var stepLabels = {
    1: "Recipe details",
    2: "Shelf-life expectations",
    3: "Packaging preferences",
    4: "Contact info",
  };

  function buildProgress() {
    progressTrack.innerHTML = "";
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var seg = document.createElement("div");
      seg.className = "progress-seg" + (i <= currentStep ? " filled" : "");
      progressTrack.appendChild(seg);
    }
    progressLabel.textContent = "Step " + currentStep + " of " + TOTAL_STEPS + " — " + stepLabels[currentStep];
  }

  function showStep(n, scroll) {
    steps.forEach(function (el) {
      el.classList.toggle("active", parseInt(el.dataset.step, 10) === n);
    });
    btnBack.classList.toggle("hidden", n === 1);
    btnNext.classList.toggle("hidden", n === TOTAL_STEPS);
    btnSubmit.classList.toggle("hidden", n !== TOTAL_STEPS);
    buildProgress();
    if (scroll) {
      window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
    }
  }

  function validateStep(n) {
    var stepEl = form.querySelector('.wizard-step[data-step="' + n + '"]');
    var required = stepEl.querySelectorAll("[required]");
    for (var i = 0; i < required.length; i++) {
      if (!required[i].value.trim()) {
        required[i].focus();
        return false;
      }
    }
    return true;
  }

  btnNext.addEventListener("click", function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      showStep(currentStep, true);
    }
  });

  btnBack.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep, true);
    }
  });

  // Visual state for choice cards
  form.addEventListener("change", function (e) {
    if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
      var card = e.target.closest(".choice-card");
      var group = card && card.parentElement;
      if (group && e.target.type === "radio") {
        group.querySelectorAll(".choice-card").forEach(function (c) {
          c.classList.remove("checked");
        });
      }
      if (card) {
        card.classList.toggle("checked", e.target.checked);
      }
    }
  });

  function collectData() {
    var data = new FormData(form);
    var obj = {};
    data.forEach(function (value, key) {
      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(TOTAL_STEPS)) return;

    var submission = collectData();

    try {
      var KEY = "shelfready_wizard_submissions";
      var all = JSON.parse(localStorage.getItem(KEY) || "[]");
      all.push(
        Object.assign(
          {
            id: "wiz_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            submittedAt: new Date().toISOString(),
          },
          submission
        )
      );
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch (err) {
      /* storage unavailable — proceed anyway, submission still confirmed in UI */
    }

    form.classList.add("hidden");
    document.getElementById("progress-track").classList.add("hidden");
    document.getElementById("progress-label").classList.add("hidden");
    complete.classList.remove("hidden");
    document.getElementById("complete-name").textContent =
      (submission.contactName || "").split(" ")[0] || "friend";
  });

  showStep(currentStep);
})();
