(function () {
  "use strict";

  const API_URL = "http://127.0.0.1:8000/predict";

  // Must match the FastAPI Pydantic Literal exactly (order preserved).
  const COUNTRIES = [
    "Other", "India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico",
    "Turkey", "France", "Spain", "Ireland", "Denmark", "Japan", "Switzerland",
    "Nepal", "Italy", "Russia", "Sri Lanka", "Maldives", "Bangladesh", "Pakistan",
    "Poland", "South Korea", "China", "Brazil", "Singapore", "New Zealand",
    "Malaysia", "Netherlands", "UAE", "Finland", "Uzbekistan", "Qatar", "Sweden",
    "Norway", "Egypt", "Paraguay", "Cyprus", "Vietnam", "Argentina", "Costa Rica",
    "Romania", "Moldova", "Georgia", "Andorra", "Belgium", "Greece", "South Africa",
    "Peru", "Panama", "Trinidad", "Czech Republic", "Latvia", "Lithuania",
    "North Macedonia", "Lebanon", "Iraq", "Afghanistan", "Hong Kong", "Morocco",
    "Nigeria", "Slovakia", "Ukraine", "Kazakhstan", "Tajikistan", "Monaco",
    "San Marino", "Vatican City", "Albania", "Austria", "Portugal", "Philippines",
    "Indonesia", "Taiwan", "Israel", "Ghana", "Chile", "Venezuela", "Jamaica",
    "Bahamas", "Hungary", "Bulgaria", "Estonia", "Azerbaijan", "Malta",
    "Luxembourg", "Liechtenstein", "Kosovo", "Bahrain", "Oman", "Jordan",
    "Bhutan", "Thailand", "Kenya", "Colombia", "Ecuador", "Uruguay", "Bolivia",
    "Iceland", "Croatia", "Serbia", "Slovenia", "Belarus", "Kyrgyzstan",
    "Armenia", "Montenegro", "Bosnia", "Kuwait", "Yemen", "Syria"
  ];

  const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 94; // r=94 from the SVG

  const els = {};
  let currentStep = 1;
  const TOTAL_STEPS = 3;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheEls();
    populateCountries();
    bindNav();
    bindSliders();
    bindStressCards();
    bindForm();
    bindRestart();
    updateProgress();
  }

  function cacheEls() {
    els.menuToggle = document.getElementById("menuToggle");
    els.navLinks = document.getElementById("navLinks");
    els.navStartBtn = document.getElementById("navStartBtn");
    els.heroStartBtn = document.getElementById("heroStartBtn");

    els.form = document.getElementById("wellnessForm");
    els.steps = Array.from(document.querySelectorAll(".form-step"));
    els.progressTrack = document.getElementById("progressTrack");
    els.progressSteps = Array.from(document.querySelectorAll(".progress-step"));
    els.progressLines = Array.from(document.querySelectorAll(".progress-line"));

    els.country = document.getElementById("country");

    els.usageHours = document.getElementById("usageHours");
    els.usageHoursValue = document.getElementById("usageHoursValue");
    els.studyHours = document.getElementById("studyHours");
    els.studyHoursValue = document.getElementById("studyHoursValue");
    els.activityHours = document.getElementById("activityHours");
    els.activityHoursValue = document.getElementById("activityHoursValue");
    els.sleepHours = document.getElementById("sleepHours");
    els.sleepHoursValue = document.getElementById("sleepHoursValue");

    els.stressGrid = document.getElementById("stressGrid");
    els.stressLevel = document.getElementById("stressLevel");

    els.submitBtn = document.getElementById("submitBtn");
    els.loadingState = document.getElementById("loadingState");
    els.apiError = document.getElementById("apiError");
    els.apiErrorText = document.getElementById("apiErrorText");

    els.assessmentSection = document.getElementById("assessment");
    els.resultsSection = document.getElementById("results");

    els.gaugeFill = document.getElementById("gaugeFill");
    els.scoreValue = document.getElementById("scoreValue");
    els.interpretationBadge = document.getElementById("interpretationBadge");
    els.interpretationText = document.getElementById("interpretationText");
    els.detailGrid = document.getElementById("detailGrid");
    els.suggestionsList = document.getElementById("suggestionsList");
    els.restartBtn = document.getElementById("restartBtn");
  }

  /* ---------------- Navbar ---------------- */
  function bindNav() {
    els.menuToggle.addEventListener("click", () => {
      const isOpen = els.navLinks.classList.toggle("is-open");
      els.menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    els.navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => els.navLinks.classList.remove("is-open"))
    );
    const goToAssessment = () => {
      document.getElementById("assessment").scrollIntoView({ behavior: "smooth" });
    };
    els.navStartBtn.addEventListener("click", goToAssessment);
    els.heroStartBtn.addEventListener("click", goToAssessment);
  }

  /* ---------------- Countries ---------------- */
  function populateCountries() {
    COUNTRIES.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      els.country.appendChild(opt);
    });
  }

  /* ---------------- Sliders ---------------- */
  function bindSliders() {
    linkSlider(els.usageHours, els.usageHoursValue);
    linkSlider(els.studyHours, els.studyHoursValue);
    linkSlider(els.activityHours, els.activityHoursValue);
    linkSlider(els.sleepHours, els.sleepHoursValue);
  }
  function linkSlider(input, output) {
    const render = () => (output.textContent = parseFloat(input.value).toFixed(1));
    input.addEventListener("input", render);
    render();
  }

  /* ---------------- Stress cards ---------------- */
  function bindStressCards() {
    const cards = Array.from(els.stressGrid.querySelectorAll(".stress-card"));
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        els.stressLevel.value = card.dataset.value;
        clearError("stressLevel");
      });
    });
  }

  /* ---------------- Step navigation ---------------- */
  function bindNavButtons() {}

  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-next]")) {
      if (validateStep(currentStep)) goToStep(currentStep + 1);
    }
    if (e.target.matches("[data-back]")) {
      goToStep(currentStep - 1);
    }
  });

  function goToStep(step) {
    if (step < 1 || step > TOTAL_STEPS) return;
    currentStep = step;
    els.steps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === step));
    updateProgress();
    els.assessmentSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgress() {
    els.progressSteps.forEach((stepEl) => {
      const n = Number(stepEl.dataset.step);
      stepEl.classList.toggle("is-active", n === currentStep);
      stepEl.classList.toggle("is-done", n < currentStep);
    });
    els.progressLines.forEach((line, i) => {
      line.classList.toggle("is-filled", i < currentStep - 1);
    });
  }

  /* ---------------- Validation ---------------- */
  function validateStep(step) {
    let valid = true;

    const check = (id, condition) => {
      if (!condition) {
        showError(id, "This field is required.");
        valid = false;
      } else {
        clearError(id);
      }
    };

    if (step === 1) {
      const age = document.getElementById("age");
      const ageVal = Number(age.value);
      if (!age.value || ageVal < 10 || ageVal > 100) {
        showError("age", "Enter an age between 10 and 100.");
        valid = false;
      } else clearError("age");

      check("gender", document.getElementById("gender").value);
      check("country", els.country.value);
      check("academicLevel", document.getElementById("academicLevel").value);
    }

    if (step === 2) {
      check("platform", document.getElementById("platform").value);
      check("purpose", document.getElementById("purpose").value);

      const unlocks = document.getElementById("unlocks");
      if (!unlocks.value || Number(unlocks.value) < 1) {
        showError("unlocks", "Enter at least 1 unlock.");
        valid = false;
      } else clearError("unlocks");
    }

    if (step === 3) {
      check("stressLevel", els.stressLevel.value);
    }

    return valid;
  }

  function showError(id, message) {
    const errEl = document.getElementById("err-" + id);
    if (errEl) errEl.textContent = message;
    const inputEl = document.getElementById(id);
    if (inputEl) inputEl.style.borderColor = "var(--coral)";
  }
  function clearError(id) {
    const errEl = document.getElementById("err-" + id);
    if (errEl) errEl.textContent = "";
    const inputEl = document.getElementById(id);
    if (inputEl) inputEl.style.borderColor = "";
  }

  /* ---------------- Submit ---------------- */
  function bindForm() {
    els.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateStep(3)) return;

      const payload = buildPayload();
      setLoading(true);
      hideApiError();

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 422) {
          throw new Error("VALIDATION");
        }
        if (!response.ok) {
          throw new Error("SERVER_" + response.status);
        }

        const result = await response.json();
        const score = result.predicted_Score;
        showResults(score, payload);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    });
  }

  function buildPayload() {
    return {
      Age: Number(document.getElementById("age").value),
      Gender: document.getElementById("gender").value,
      Country: els.country.value,
      Academic_Level: document.getElementById("academicLevel").value,
      Most_Used_Platform: document.getElementById("platform").value,
      Purpose_Of_Use: document.getElementById("purpose").value,
      Avg_Daily_Usage_Hours: Number(els.usageHours.value),
      Daily_Unlocks: Number(document.getElementById("unlocks").value),
      Study_Hours: Number(els.studyHours.value),
      Physical_Activity_Hours: Number(els.activityHours.value),
      Sleep_Hours_Per_Night: Number(els.sleepHours.value),
      Stress_Level: els.stressLevel.value,
    };
  }

  function setLoading(isLoading) {
    els.loadingState.hidden = !isLoading;
    els.submitBtn.disabled = isLoading;
    els.submitBtn.textContent = isLoading ? "Analyzing…" : "Analyze My Wellness";
  }

  function handleApiError(err) {
    let message =
      "Something went wrong while analyzing your responses. Please try again.";

    if (err instanceof TypeError) {
      // fetch() throws a TypeError on network failure (server not reachable, CORS, etc.)
      message =
        "Unable to connect to the prediction server. Please make sure your FastAPI backend is running at http://127.0.0.1:8000";
    } else if (err.message === "VALIDATION") {
      message = "Please check your answers and try again.";
    } else if (typeof err.message === "string" && err.message.startsWith("SERVER_")) {
      message = "The prediction server returned an error. Please try again in a moment.";
    }

    els.apiErrorText.textContent = message;
    els.apiError.hidden = false;
  }
  function hideApiError() {
    els.apiError.hidden = true;
  }

  /* ---------------- Results ---------------- */
  function showResults(score, inputs) {
    const clamped = Math.max(0, Math.min(100, Number(score)));

    els.assessmentSection.hidden = true;
    els.resultsSection.hidden = false;
    els.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

    animateScore(clamped, score);
    renderInterpretation(clamped);
    renderDetails(inputs);
    renderSuggestions(inputs);
  }

  function animateScore(clamped, rawScore) {
    els.scoreValue.textContent = "0";
    els.gaugeFill.style.strokeDashoffset = String(GAUGE_CIRCUMFERENCE);

    requestAnimationFrame(() => {
      const offset = GAUGE_CIRCUMFERENCE * (1 - clamped / 100);
      els.gaugeFill.style.strokeDashoffset = String(offset);

      const duration = 900;
      const start = performance.now();
      const from = 0;
      const to = Number(rawScore);

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (to - from) * eased;
        els.scoreValue.textContent = current.toFixed(2);
        if (progress < 1) requestAnimationFrame(tick);
        else els.scoreValue.textContent = to.toFixed(2);
      }
      requestAnimationFrame(tick);
    });
  }

  function renderInterpretation(score) {
    let band, label, colorClass;
    if (score < 30) {
      band = "lower"; label = "Lower range"; colorClass = "band-lower";
    } else if (score < 50) {
      band = "moderate"; label = "Moderate range"; colorClass = "band-moderate";
    } else if (score < 70) {
      band = "elevated"; label = "Elevated range"; colorClass = "band-elevated";
    } else {
      band = "higher"; label = "Higher range"; colorClass = "band-higher";
    }

    els.interpretationBadge.textContent = label;
    els.interpretationBadge.className = "interpretation-badge " + colorClass;
    els.interpretationText.textContent =
      `Your predicted wellness score is in the ${label.toLowerCase()}. ` +
      "This is a general, AI-generated estimate based on your habits — not a medical diagnosis or a clinical assessment.";
  }

  function renderDetails(inputs) {
    const items = [
      { icon: "🌙", label: "Sleep", value: `${inputs.Sleep_Hours_Per_Night} hrs` },
      { icon: "📱", label: "Screen time", value: `${inputs.Avg_Daily_Usage_Hours} hrs/day` },
      { icon: "📘", label: "Study", value: `${inputs.Study_Hours} hrs/day` },
      { icon: "🏃", label: "Physical activity", value: `${inputs.Physical_Activity_Hours} hr/day` },
      { icon: "🔓", label: "Daily unlocks", value: `${inputs.Daily_Unlocks}` },
      { icon: "🌤️", label: "Stress", value: inputs.Stress_Level },
    ];

    els.detailGrid.innerHTML = items
      .map(
        (i) => `
        <div class="detail-card">
          <span class="detail-icon">${i.icon}</span>
          <span class="detail-value">${i.value}</span>
          <span class="detail-label">${i.label}</span>
        </div>`
      )
      .join("");
  }

  function renderSuggestions(inputs) {
    const suggestions = [];

    if (inputs.Sleep_Hours_Per_Night < 6) {
      suggestions.push("Consider maintaining a consistent sleep schedule.");
    }
    if (inputs.Avg_Daily_Usage_Hours >= 8) {
      suggestions.push("Try taking regular breaks from your screen.");
    }
    if (inputs.Physical_Activity_Hours < 1) {
      suggestions.push("Consider adding some movement or physical activity to your day.");
    }
    if (inputs.Stress_Level === "High" || inputs.Stress_Level === "Very High") {
      suggestions.push(
        "Consider talking with someone you trust or a qualified professional if stress feels difficult to manage."
      );
    }
    if (inputs.Study_Hours >= 10) {
      suggestions.push("Try building short breaks into long study sessions.");
    }
    if (suggestions.length === 0) {
      suggestions.push("Your current habits look balanced — keep up what's working for you.");
    }

    els.suggestionsList.innerHTML = suggestions.map((s) => `<li>${s}</li>`).join("");
  }

  /* ---------------- Restart ---------------- */
  function bindRestart() {
    els.restartBtn.addEventListener("click", () => {
      els.form.reset();
      els.stressLevel.value = "";
      els.stressGrid
        .querySelectorAll(".stress-card")
        .forEach((c) => c.classList.remove("is-selected"));

      [els.usageHours, els.studyHours, els.activityHours, els.sleepHours].forEach((s) =>
        s.dispatchEvent(new Event("input"))
      );
      // reset default slider positions
      els.usageHours.value = 15;
      els.studyHours.value = 5;
      els.activityHours.value = 1;
      els.sleepHours.value = 7;
      [els.usageHours, els.studyHours, els.activityHours, els.sleepHours].forEach((s) =>
        s.dispatchEvent(new Event("input"))
      );

      document.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
      document
        .querySelectorAll(".field input, .field select")
        .forEach((e) => (e.style.borderColor = ""));

      els.resultsSection.hidden = true;
      els.assessmentSection.hidden = false;
      goToStep(1);
      els.assessmentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
