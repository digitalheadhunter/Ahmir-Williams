/* ShelfReady — Retail Readiness Calculator
   All math happens client-side and recalculates on every input change. */

(function () {
  var body = document.getElementById("ingredients-body");
  var rowTemplate = function () {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td data-label="Ingredient"><input type="text" class="ing-name" placeholder="e.g. Tomatoes" /></td>' +
      '<td data-label="Quantity used"><input type="text" class="ing-qty" placeholder="e.g. 3 lbs" /></td>' +
      '<td data-label="Cost for batch ($)"><input type="number" class="ing-cost" min="0" step="0.01" placeholder="0.00" /></td>' +
      '<td class="col-remove"><button type="button" class="row-remove" aria-label="Remove ingredient">×</button></td>';
    return tr;
  };

  function addRow(name, qty, cost) {
    var tr = rowTemplate();
    if (name) tr.querySelector(".ing-name").value = name;
    if (qty) tr.querySelector(".ing-qty").value = qty;
    if (cost !== undefined) tr.querySelector(".ing-cost").value = cost;
    body.appendChild(tr);
  }

  function removeRow(tr) {
    if (body.children.length > 1) {
      tr.remove();
    } else {
      tr.querySelectorAll("input").forEach(function (i) {
        i.value = "";
      });
    }
    recalc();
  }

  document.getElementById("add-row").addEventListener("click", function () {
    addRow();
  });

  body.addEventListener("click", function (e) {
    if (e.target.classList.contains("row-remove")) {
      removeRow(e.target.closest("tr"));
    }
  });

  body.addEventListener("input", recalc);

  // start with 3 blank rows
  addRow();
  addRow();
  addRow();

  var recipeNameEl = document.getElementById("recipe-name");
  var batchYieldEl = document.getElementById("batch-yield");
  var packagingCostEl = document.getElementById("packaging-cost");
  var targetPriceEl = document.getElementById("target-price");

  [recipeNameEl, batchYieldEl, packagingCostEl, targetPriceEl].forEach(function (el) {
    el.addEventListener("input", recalc);
  });

  document.getElementById("load-example").addEventListener("click", function () {
    recipeNameEl.value = "Grandma's Hot Sauce";
    body.innerHTML = "";
    addRow("Fresh chilies", "5 lbs", "12.50");
    addRow("Vinegar", "1 gallon", "6.00");
    addRow("Garlic & spices", "—", "4.25");
    addRow("Salt & sugar", "—", "1.10");
    batchYieldEl.value = 48;
    packagingCostEl.value = 0.95;
    targetPriceEl.value = 8.99;
    recalc();
  });

  var money = function (n) {
    if (!isFinite(n)) return "$0.00";
    var sign = n < 0 ? "-" : "";
    return sign + "$" + Math.abs(n).toFixed(2);
  };
  var pct = function (n) {
    if (!isFinite(n)) return "0%";
    return n.toFixed(1) + "%";
  };

  var placeholder = document.getElementById("results-placeholder");
  var content = document.getElementById("results-content");
  var cta = document.getElementById("results-cta");
  var ctaHidden = document.getElementById("cta-recipe-hidden");
  var ingredientsTotalEl = document.getElementById("ingredients-total");

  function totalIngredientCost() {
    var total = 0;
    body.querySelectorAll(".ing-cost").forEach(function (input) {
      var v = parseFloat(input.value);
      if (!isNaN(v) && v > 0) total += v;
    });
    return total;
  }

  function setVerdict(tone, icon, title, desc) {
    var box = document.getElementById("verdict-box");
    box.className = "verdict " + tone;
    document.getElementById("verdict-icon").textContent = icon;
    document.getElementById("verdict-title").textContent = title;
    document.getElementById("verdict-desc").textContent = desc;
  }

  function recalc() {
    var ingredientTotal = totalIngredientCost();
    ingredientsTotalEl.textContent = money(ingredientTotal);

    var batchYield = parseFloat(batchYieldEl.value);
    var packagingCost = parseFloat(packagingCostEl.value);
    var targetPrice = parseFloat(targetPriceEl.value);

    var hasYield = !isNaN(batchYield) && batchYield > 0;
    var hasPrice = !isNaN(targetPrice) && targetPrice > 0;

    if (!hasYield || !hasPrice) {
      placeholder.classList.remove("hidden");
      content.classList.add("hidden");
      return;
    }

    placeholder.classList.add("hidden");
    content.classList.remove("hidden");

    var packaging = isNaN(packagingCost) || packagingCost < 0 ? 0 : packagingCost;
    var ingredientPerUnit = ingredientTotal / batchYield;
    var costPerUnit = ingredientPerUnit + packaging;

    // Standard "keystone" retail pricing: retailer takes roughly a 50%
    // margin, so the wholesale price a maker actually receives is about
    // half the shelf (retail) price.
    var wholesalePrice = targetPrice / 2;
    var margin = wholesalePrice > 0 ? ((wholesalePrice - costPerUnit) / wholesalePrice) * 100 : 0;

    // Suggested retail price for a healthy (~50%) margin at wholesale:
    // wholesale needed = costPerUnit / (1 - 0.5) = costPerUnit * 2
    // retail needed = wholesale needed * 2 = costPerUnit * 4
    var suggestedRetail = costPerUnit * 4;

    document.getElementById("out-cost-per-unit").textContent = money(costPerUnit);
    document.getElementById("out-wholesale").textContent = money(wholesalePrice);
    document.getElementById("out-margin").textContent = pct(margin);
    document.getElementById("out-suggested").textContent = money(suggestedRetail);

    document.getElementById("math-ingredient-per-unit").textContent = money(ingredientPerUnit);
    document.getElementById("math-packaging-per-unit").textContent = money(packaging);
    document.getElementById("math-cost-per-unit").textContent = money(costPerUnit);
    document.getElementById("math-wholesale").textContent = money(wholesalePrice);
    document.getElementById("math-margin").textContent = pct(margin);
    document.getElementById("math-suggested").textContent = money(suggestedRetail);

    if (margin >= 50) {
      setVerdict(
        "green",
        "✓",
        "Retail-ready margins",
        "At this price, your margin at wholesale is healthy for retail. You're in a strong position to pitch stores."
      );
    } else if (margin >= 30) {
      setVerdict(
        "yellow",
        "!",
        "Getting close",
        "Your margin is workable but tight. Consider trimming ingredient or packaging costs, or nudging your retail price up."
      );
    } else {
      setVerdict(
        "red",
        "✕",
        "Not retail-ready yet",
        "At this price, a retailer's cut would leave little or no margin. Revisit your costs or target retail price below."
      );
    }

    cta.classList.add("visible");
    ctaHidden.value = recipeNameEl.value || "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var ctaForm = document.querySelector('[data-waitlist-form]');
    if (ctaForm) {
      ShelfReady.bindWaitlistForm(ctaForm, {
        source: "calculator",
        extra: function () {
          return {
            recipe: recipeNameEl.value || "",
            costPerUnit: document.getElementById("out-cost-per-unit").textContent,
            margin: document.getElementById("out-margin").textContent,
          };
        },
      });
    }
  });

  recalc();
})();
