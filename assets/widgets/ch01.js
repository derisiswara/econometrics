/*
 * Ilustrasi Bab 1 (dwibahasa) / Chapter 1 figures (bilingual).
 * Satu berkas dipakai oleh halaman Indonesia dan Inggris. Setiap ilustrasi hanya
 * dijalankan bila elemennya ada di halaman. Teks memakai RV.t("Indonesia", "English").
 * Pola setiap ilustrasi: paint(svg, keadaan) -> interaksi layar -> RV.print(...) untuk versi cetak.
 */
document.addEventListener("DOMContentLoaded", function () {
  var R = window.RV; if (!R) return;
  var t = R.t, F = R.fmt;
  function $(id) { return document.getElementById(id); }
  var AX = t("X: pendapatan (juta Rp/bulan)", "X: income (IDR million/month)");
  var AY = t("Y: konsumsi (juta Rp/bulan)", "Y: consumption (IDR million/month)");
  var X6 = R.DX, Y6 = R.DY, O6 = R.ols(X6, Y6);
  var EQ = "Ŷ = " + F(0.8, 1) + " + " + F(O6.b2, 3) + "X";
  function inti(idT, enT) { return "<b>" + t("Pesan inti:", "Key message:") + "</b> " + t(idT, enT); }

  /* Populasi hipotetis bersama (Ilustrasi 5 dan 7) */
  var POP = (function () {
    var r = R.rng(11), XS = [2, 4, 6, 8, 10, 12], pop = [];
    XS.forEach(function (x) {
      var e = []; for (var k = 0; k < 7; k++) e.push(R.normal(r));
      var m = R.mean(e); e.forEach(function (v) { pop.push({ x: x, y: 1 + 0.75 * x + (v - m) }); });
    });
    return { pop: pop, XS: XS, B1: 1, B2: 0.75, SD: 1 };
  })();

  /* 1. Diagram pencar */
  (function () {
    var root = $("rv-scatter"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out"), btn = $("rv-scatter-btn");
    var r = R.rng(5), X = [], Y = [];
    for (var i = 0; i < 20; i++) { var x = 2 + 10 * r(); X.push(x); Y.push(1 + 0.75 * x + R.normal(r) * 0.9); }
    var o = R.ols(X, Y), show = false;
    function paint(s, withLine) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 14, dx: 2, dy: 2, xl: AX, yl: AY });
      if (withLine) R.line(f, o.b1, o.b2, 0, 14, "rv-line");
      X.forEach(function (x, i) { R.dot(f, x, Y[i], 5, "rv-pt"); });
    }
    function draw() {
      paint(svg, show);
      btn.textContent = show ? t("Sembunyikan garis", "Hide the line") : t("Tampilkan garis yang merangkum pola", "Show the line that summarises the pattern");
      out.innerHTML = show
        ? t("Garis biru merangkum pola titik-titik tersebut: <b>makin tinggi pendapatan, makin tinggi rata-rata konsumsi</b>. Garis inilah yang disebut <b>garis regresi</b>.",
            "The blue line summarises the pattern in the points: <b>the higher the income, the higher the average consumption</b>. This line is called the <b>regression line</b>.")
        : t("Setiap titik adalah satu keluarga. Titik-titik tampak menyebar, tetapi ada pola: titik cenderung naik ke kanan.",
            "Each point is one household. The points are scattered, but there is a pattern: they tend to rise to the right.");
    }
    btn.addEventListener("click", function () { show = !show; draw(); }); draw();
    R.print(root, [{ paint: function (s) { paint(s, true); }, caption: t("Data 20 keluarga dan garis yang merangkum polanya", "Data on 20 households and the line summarising the pattern") }],
      { note: inti("titik-titik data menyebar, tetapi polanya dapat dirangkum oleh sebuah garis. Makin tinggi pendapatan, makin tinggi rata-rata konsumsi. Garis inilah yang disebut garis regresi.",
                   "the data points are scattered, but their pattern can be summarised by a line. Higher income goes with higher average consumption. This line is the regression line.") });
  })();

  /* 2. Tiga pola hubungan (statis) */
  (function () {
    var root = $("rv-pattern"); if (!root) return;
    var svgs = root.querySelectorAll("svg"), r = R.rng(21), spec = [[2, 0.8], [12, -0.8], [6, 0]];
    spec.forEach(function (s, k) {
      var X = [], Y = [];
      for (var i = 0; i < 16; i++) { var x = 1 + 10 * r(); X.push(x); Y.push(s[0] + s[1] * x + R.normal(r) * 1.1); }
      var o = R.ols(X, Y), f = R.frame(svgs[k], { x0: 0, x1: 12, y0: 0, y1: 14, m: { l: 22, r: 8, t: 8, b: 24 }, xl: "X", yl: "Y", ylx: 10 });
      R.line(f, o.b1, o.b2, 0, 12, "rv-line");
      X.forEach(function (x, i) { R.dot(f, x, Y[i], 3.5, "rv-pt"); });
    });
  })();

  /* 4. Intersep dan kemiringan */
  (function () {
    var root = $("rv-line"); if (!root) return;
    var svg = root.querySelector("svg"), s1 = $("rv-line-b1"), s2 = $("rv-line-b2");
    function eq(b1, b2) { return "Y = " + F(b1, 1) + (b2 < 0 ? " − " + F(-b2, 1) : " + " + F(b2, 1)) + "X"; }
    function paint(s, b1, b2) {
      var f = R.frame(s, { x0: 0, x1: 10, y0: 0, y1: 14, dx: 1, dy: 2, xl: "X", yl: "Y" });
      R.line(f, b1, b2, 0, 10, "rv-line");
      var xa = 4, ya = b1 + b2 * xa, yb = b1 + b2 * (xa + 1);
      R.el("path", { d: "M" + f.sx(xa) + " " + f.sy(ya) + "H" + f.sx(xa + 1) + "V" + f.sy(yb), class: "rv-help" }, f.g);
      R.txt({ x: (f.sx(xa) + f.sx(xa + 1)) / 2, y: f.sy(ya) + (b2 >= 0 ? 16 : -8), "text-anchor": "middle", class: "rv-note" }, "+1", f.g);
      R.txt({ x: f.sx(xa + 1) + 6, y: (f.sy(ya) + f.sy(yb)) / 2 + 4, class: "rv-note" }, (b2 >= 0 ? "+" : "") + F(b2, 1), f.g);
      R.dot(f, 0, b1, 6, "rv-dot");
      R.txt({ x: f.sx(0) + 10, y: f.sy(b1) + (b1 > 12 ? 16 : -8), class: "rv-note" }, t("intersep = ", "intercept = ") + F(b1, 1), f.g);
    }
    function draw() {
      var b1 = +s1.value, b2 = +s2.value; paint(svg, b1, b2);
      $("rv-line-b1v").textContent = F(b1, 1); $("rv-line-b2v").textContent = F(b2, 1);
      var arah = b2 > 0 ? t("naik sebesar ", "rises by ") + F(b2, 1) : (b2 < 0 ? t("turun sebesar ", "falls by ") + F(-b2, 1) : t("tidak berubah", "does not change"));
      root.querySelector(".rv-out").innerHTML = t("Persamaan: ", "Equation: ") + "<span class='rv-big'>" + eq(b1, b2) + "</span><br>" +
        t("Garis memotong sumbu Y di ", "The line crosses the Y axis at ") + F(b1, 1) + ". " +
        t("Setiap X bertambah 1, Y ", "Each time X increases by 1, Y ") + arah + ".";
    }
    s1.addEventListener("input", draw); s2.addEventListener("input", draw); draw();
    var P = [[9, -0.6, t("Kemiringan negatif", "Negative slope")], [5, 0, t("Kemiringan nol", "Zero slope")], [1, 0.8, t("Kemiringan positif", "Positive slope")]];
    R.print(root, P.map(function (p) { return { paint: function (s) { paint(s, p[0], p[1]); }, caption: "<b>" + p[2] + "</b><br>" + eq(p[0], p[1]) }; }),
      { cols: 3, viewBox: "0 0 300 260", note: inti("intersep menentukan titik potong garis dengan sumbu Y; kemiringan menentukan arah dan kecuraman garis. Segitiga jingga menunjukkan perubahan Y ketika X bertambah 1.",
                                                     "the intercept sets where the line crosses the Y axis; the slope sets its direction and steepness. The orange triangle shows the change in Y when X increases by 1.") });
  })();

  /* 5. Rata-rata bersyarat dan kurva distribusi */
  (function () {
    var root = $("rv-cond"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out"), cb = $("rv-cond-mean");
    var mode = "pt", btns = { pt: "rv-cond-pt", bell: "rv-cond-bell", both: "rv-cond-both" };
    function paint(s, mode, showMean) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 14, dx: 2, dy: 2, xl: AX, yl: AY });
      if (mode !== "pt") POP.XS.forEach(function (x) {
        var mu = POP.B1 + POP.B2 * x, d = "M" + f.sx(x) + " " + f.sy(mu - 3);
        for (var z = -3; z <= 3.001; z += 0.1) d += "L" + (f.sx(x) + 52 * Math.exp(-z * z / 2)) + " " + f.sy(mu + z);
        d += "L" + f.sx(x) + " " + f.sy(mu + 3) + "Z"; R.el("path", { d: d, class: "rv-bell" }, f.g);
      });
      if (showMean) R.line(f, POP.B1, POP.B2, 0, 14, "rv-line");
      if (mode !== "bell") POP.pop.forEach(function (p) { R.dot(f, p.x, p.y, 4, "rv-pt", f.g).setAttribute("fill-opacity", "0.55"); });
      if (showMean) POP.XS.forEach(function (x) {
        var cx = f.sx(x), cy = f.sy(POP.B1 + POP.B2 * x);
        R.el("path", { d: "M" + (cx - 7) + " " + cy + "L" + cx + " " + (cy - 7) + "L" + (cx + 7) + " " + cy + "L" + cx + " " + (cy + 7) + "Z", class: "rv-dot" }, f.g);
      });
    }
    function draw() {
      paint(svg, mode, cb.checked);
      for (var k in btns) $(btns[k]).className = (k === mode ? "on" : "");
      out.innerHTML = (mode === "pt"
        ? t("Pada setiap nilai X terdapat 7 keluarga dengan konsumsi yang berbeda-beda.", "At each value of X there are 7 households with different levels of consumption.")
        : t("Kurva lonceng menggambarkan sebaran konsumsi pada setiap tingkat pendapatan. Puncak kurva berada di nilai rata-rata.", "Each bell curve shows how consumption is spread at that income level. The peak sits at the mean."))
        + (cb.checked ? " " + t("Belah ketupat jingga adalah <b>rata-rata bersyarat E(Y|X)</b>; garis biru menghubungkan rata-rata tersebut. Itulah garis regresi.",
                                "The orange diamonds are the <b>conditional means E(Y|X)</b>; the blue line connects them. That is the regression line.") : "");
    }
    Object.keys(btns).forEach(function (k) { $(btns[k]).addEventListener("click", function () { mode = k; draw(); }); });
    cb.addEventListener("change", draw); draw();
    R.print(root, [{ paint: function (s) { paint(s, "both", true); }, caption: t("Titik data, kurva sebaran, dan rata-rata bersyarat (belah ketupat) pada setiap X", "Data points, spread curves, and conditional means (diamonds) at each X") }],
      { note: inti("pada setiap tingkat pendapatan, konsumsi menyebar membentuk kurva lonceng. Garis regresi tidak melewati setiap titik; garis itu menghubungkan <b>rata-rata</b> Y pada setiap X, yaitu E(Y|X).",
                   "at every income level, consumption is spread out in a bell shape. The regression line does not pass through every point; it connects the <b>mean</b> of Y at each X, that is, E(Y|X).") });
  })();

  /* 6. Galat */
  (function () {
    var root = $("rv-err"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out");
    var X = [1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12], E = [0.9, -1.1, 0.4, 1.4, -0.8, -1.5, 0.7, 1.0], B1 = 1, B2 = 0.75, sel = 3;
    function paint(s, sels, all, onPick) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 14, dx: 2, dy: 2, xl: "X", yl: "Y" });
      R.line(f, B1, B2, 0, 14, "rv-line");
      X.forEach(function (x, i) {
        var on = sels.indexOf(i) >= 0; if (!on && !all) return;
        var yl = B1 + B2 * x, y = yl + E[i];
        R.el("line", { x1: f.sx(x), x2: f.sx(x), y1: f.sy(y), y2: f.sy(yl), class: "rv-res" }, f.g);
        if (on) {
          R.dot(f, x, yl, 6, "rv-hollow", f.g);
          R.txt({ x: f.sx(x) + 10, y: (f.sy(y) + f.sy(yl)) / 2 + 4, class: "rv-note" }, "u = " + (E[i] > 0 ? "+" : "") + F(E[i], 1), f.g);
        }
      });
      X.forEach(function (xx, i) {
        var on = sels.indexOf(i) >= 0;
        R.dot(f, xx, B1 + B2 * xx + E[i], on ? 7 : 5, on ? "rv-dot" : "rv-pt", f.g);
        if (onPick) { var h = R.dot(f, xx, B1 + B2 * xx + E[i], 14, "rv-hit", f.g); h.addEventListener("click", function () { onPick(i); }); }
      });
    }
    function draw() {
      paint(svg, [sel], false, function (i) { sel = i; draw(); });
      var x = X[sel], yl = B1 + B2 * x, y = yl + E[sel];
      out.innerHTML = t("Keluarga ke-", "Household ") + (sel + 1) + ": X = " + F(x, 1) + ". " +
        t("Nilai Y aktual = ", "Actual Y = ") + "<b>" + F(y, 2) + "</b>; " + t("nilai pada garis = ", "value on the line = ") +
        F(1, 0) + " + " + F(0.75, 2) + " × " + F(x, 1) + " = <b>" + F(yl, 2) + "</b>. " +
        t("Galat", "Error") + " u = " + F(y, 2) + " − " + F(yl, 2) + " = <b>" + F(E[sel], 2) + "</b> (" +
        (E[sel] > 0 ? t("titik di atas garis", "point above the line") : t("titik di bawah garis", "point below the line")) + ").";
    }
    draw();
    R.print(root, [{ paint: function (s) { paint(s, [3, 5], true); }, caption: t("Garis jingga tegak = galat setiap keluarga; dua di antaranya diberi label", "Vertical orange lines = each household's error; two of them are labelled") }],
      { note: inti("galat adalah jarak vertikal titik ke garis, u = Y aktual − nilai pada garis. Keluarga ke-4 (X = 6) berada 1,4 di <b>atas</b> garis (u = +1,4); keluarga ke-6 (X = 9) berada 1,5 di <b>bawah</b> garis (u = −1,5).",
                   "the error is the vertical distance from a point to the line, u = actual Y − value on the line. Household 4 (X = 6) lies 1.4 <b>above</b> the line (u = +1.4); household 6 (X = 9) lies 1.5 <b>below</b> it (u = −1.5).") });
  })();

  /* 7. Variasi sampling */
  (function () {
    var root = $("rv-sample"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out"), hist = [], cur = null, g = {};
    POP.XS.forEach(function (x) { g[x] = POP.pop.filter(function (p) { return p.x === x; }); });
    function take(rand) {
      var s = POP.XS.map(function (x) { return g[x][Math.floor(rand() * g[x].length)]; });
      var o = R.ols(s.map(function (p) { return p.x; }), s.map(function (p) { return p.y; })); o.pts = s; return o;
    }
    function paint(s, hist, cur) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 14, dx: 2, dy: 2, xl: AX, yl: AY });
      POP.pop.forEach(function (p) { R.dot(f, p.x, p.y, 3.2, "rv-pt-dim", f.g); });
      hist.forEach(function (o) { if (o !== cur) R.line(f, o.b1, o.b2, 0, 14, "rv-old"); });
      R.line(f, POP.B1, POP.B2, 0, 14, "rv-true");
      if (cur) { R.line(f, cur.b1, cur.b2, 0, 14, "rv-line"); cur.pts.forEach(function (p) { R.dot(f, p.x, p.y, 5.5, "rv-pt", f.g); }); }
    }
    function avg(h) { return R.mean(h.map(function (o) { return o.b2; })); }
    function add() { cur = take(Math.random); hist.push(cur); }
    function draw() {
      paint(svg, hist.slice(-40), cur);
      out.innerHTML = t("Garis putus-putus jingga = garis populasi (kemiringan sebenarnya ", "Dashed orange line = population line (true slope ") + F(0.75, 2) +
        t("; dalam praktik tidak diketahui). Garis biru = taksiran dari sampel terakhir (6 keluarga).", "; unknown in practice). Blue line = estimate from the latest sample (6 households).") + "<br>" +
        t("Sampel ke-", "Sample ") + "<b>" + hist.length + "</b>: " + t("kemiringan taksiran = ", "estimated slope = ") + "<b>" + F(cur.b2, 3) + "</b>. " +
        t("Rata-rata kemiringan dari semua sampel = ", "Average slope across all samples = ") + "<b>" + F(avg(hist), 3) + "</b>.";
    }
    $("rv-sample-1").addEventListener("click", function () { add(); draw(); });
    $("rv-sample-20").addEventListener("click", function () { for (var i = 0; i < 20; i++) add(); draw(); });
    $("rv-sample-0").addEventListener("click", function () { hist = []; add(); draw(); });
    add(); draw();
    var rr = R.rng(2024), ph = []; for (var i = 0; i < 40; i++) ph.push(take(rr));
    R.print(root, [{ paint: function (s) { paint(s, ph, ph[ph.length - 1]); }, caption: t("40 sampel acak (masing-masing 6 keluarga): setiap garis tipis adalah taksiran dari satu sampel", "40 random samples (6 households each): every thin line is the estimate from one sample") }],
      { note: inti("setiap sampel menghasilkan garis taksiran yang sedikit berbeda, tetapi garis-garis itu menyebar <b>di sekitar</b> garis populasi (putus-putus). Pada 40 sampel ini, rata-rata kemiringan taksiran adalah " + F(avg(ph), 3) + ", dekat dengan nilai sebenarnya " + F(0.75, 2) + ".",
                   "each sample gives a slightly different estimated line, but the lines scatter <b>around</b> the population line (dashed). In these 40 samples the average estimated slope is " + F(avg(ph), 3) + ", close to the true value of " + F(0.75, 2) + ".") });
  })();

  /* 8. Mengapa dikuadratkan (statis) */
  (function () {
    var root = $("rv-why"); if (!root) return;
    var svgs = root.querySelectorAll("svg"), caps = root.querySelectorAll("figcaption");
    [[O6.b1, O6.b2, t("Garis A", "Line A")], [7.5, 0, t("Garis B", "Line B")]].forEach(function (L, k) {
      var f = R.frame(svgs[k], { x0: 0, x1: 14, y0: 0, y1: 15, dx: 4, dy: 5, m: { l: 30, r: 8, t: 10, b: 28 } });
      var s = 0, s2 = 0;
      X6.forEach(function (x, i) { var yh = L[0] + L[1] * x, u = Y6[i] - yh; s += u; s2 += u * u; R.el("line", { x1: f.sx(x), x2: f.sx(x), y1: f.sy(Y6[i]), y2: f.sy(yh), class: "rv-res" }, f.g); });
      R.line(f, L[0], L[1], 0, 14, "rv-line");
      X6.forEach(function (x, i) { R.dot(f, x, Y6[i], 4.5, "rv-pt", f.g); });
      caps[k].innerHTML = "<b>" + L[2] + "</b><br>" + t("Jumlah residual", "Sum of residuals") + " Σû = " + F(s, 2) + "<br>" +
        t("Jumlah kuadrat residual", "Sum of squared residuals") + " Σû² = <b>" + F(s2, 2) + "</b>";
    });
  })();

  /* 9. Tantangan SSR */
  (function () {
    var root = $("rv-ols"); if (!root) return;
    var B1 = O6.b1, B2 = O6.b2, svg = root.querySelector("svg"), s1 = $("rv-ols-b1"), s2 = $("rv-ols-b2"), cb = $("rv-ols-sq"), st = { b1: 4, b2: 0.4 };
    function ssr(b1, b2) { var s = 0; for (var i = 0; i < X6.length; i++) { var u = Y6[i] - b1 - b2 * X6[i]; s += u * u; } return s; }
    var smin = ssr(B1, B2);
    function paint(s, b1, b2, sq, small) {
      var f = R.frame(s, small ? { x0: 0, x1: 14, y0: 0, y1: 15, dx: 4, dy: 5, m: { l: 30, r: 8, t: 10, b: 24 } } : { x0: 0, x1: 14, y0: 0, y1: 15, dx: 2, dy: 3, xl: AX, yl: AY });
      for (var i = 0; i < X6.length; i++) {
        var px = f.sx(X6[i]), py = f.sy(Y6[i]), ph = f.sy(b1 + b2 * X6[i]), side = Math.abs(py - ph);
        if (sq && side > 0.5) { var right = px + side < f.sx(14); R.el("rect", { x: right ? px : px - side, y: Math.min(py, ph), width: side, height: side, class: "rv-sq" }, f.g); }
        R.el("line", { x1: px, x2: px, y1: py, y2: ph, class: "rv-res" }, f.g);
      }
      R.line(f, b1, b2, 0, 14, "rv-line");
      X6.forEach(function (x, i) { R.dot(f, x, Y6[i], small ? 4.5 : 6, "rv-pt", f.g); });
    }
    function draw() {
      var b1 = st.b1, b2 = st.b2, s = ssr(b1, b2), ok = Math.abs(b1 - B1) < 1e-9 && Math.abs(b2 - B2) < 1e-9;
      paint(svg, b1, b2, cb.checked, false);
      $("rv-ols-b1v").textContent = F(b1, ok ? 3 : 1); $("rv-ols-b2v").textContent = F(b2, ok ? 3 : 2);
      var msg = t("SSR garis Anda: ", "SSR of your line: ") + "<span class='rv-big'>" + F(s, 2) + "</span> &nbsp;|&nbsp; " + t("SSR terkecil (OLS): ", "Smallest SSR (OLS): ") + "<span class='rv-big'>" + F(smin, 2) + "</span><br>";
      if (ok) msg += t("Ini garis OLS: ", "This is the OLS line: ") + "<b>" + EQ + "</b>. " + t("Tidak ada garis lain yang menghasilkan SSR lebih kecil.", "No other line gives a smaller SSR.");
      else if (s - smin < 0.15) msg += t("Sangat dekat! Garis Anda hampir sama dengan garis OLS.", "Very close! Your line is almost the OLS line.");
      else msg += t("Masih dapat diperkecil sebesar ", "It can still be reduced by ") + F(s - smin, 2) + ". " + t("Usahakan kotak-kotak jingga sekecil mungkin.", "Try to make the orange squares as small as possible.");
      $("rv-ols-out").innerHTML = msg;
    }
    function fromSliders() { st = { b1: +s1.value, b2: +s2.value }; draw(); }
    s1.addEventListener("input", fromSliders); s2.addEventListener("input", fromSliders); cb.addEventListener("change", draw);
    $("rv-ols-fit").addEventListener("click", function () { st = { b1: B1, b2: B2 }; s1.value = B1; s2.value = B2; draw(); });
    $("rv-ols-reset").addEventListener("click", function () { st = { b1: 4, b2: 0.4 }; s1.value = 4; s2.value = 0.4; draw(); });
    draw();
    var C = [["A", 2, 0.8], ["B", B1, B2], ["C", 4, 0.4]];
    R.print(root, C.map(function (c) {
      return { paint: function (s) { paint(s, c[1], c[2], true, true); },
        caption: "<b>" + t("Garis ", "Line ") + c[0] + "</b>: Ŷ = " + F(c[1], 1) + " + " + F(c[2], c[0] === "B" ? 3 : 1) + "X<br>SSR = " + F(ssr(c[1], c[2]), 2) };
    }), { cols: 3, viewBox: "0 0 300 240",
      note: "<b>" + t("Soal:", "Question:") + "</b> " + t("sebelum membaca angka SSR, tebak garis mana yang terbaik hanya dari luas kotak jingga.", "before reading the SSR values, guess which line is best from the orange squares alone.") +
            " <b>" + t("Jawaban:", "Answer:") + "</b> " + t("garis B, dengan SSR terkecil (", "line B, with the smallest SSR (") + F(smin, 2) + t("). Garis B adalah garis OLS.", "). Line B is the OLS line.") });
  })();

  /* 10. Kurva SSR berbentuk U */
  (function () {
    var root = $("rv-curve"); if (!root) return;
    var mx = O6.mx, my = O6.my, svgs = root.querySelectorAll("svg"), out = root.querySelector(".rv-out"), sl = $("rv-curve-b2");
    var syy = 0; Y6.forEach(function (y) { syy += (y - my) * (y - my); });
    function S(b) { return syy - 2 * b * O6.sxy + b * b * O6.sxx; }
    function dS(b) { return -2 * O6.sxy + 2 * b * O6.sxx; }
    var M = { l: 34, r: 8, t: 10, b: 36 };
    function paintL(s, bs) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 15, dx: 4, dy: 5, m: M, xl: "X" });
      var main = bs.filter(function (q) { return q.main; })[0];
      if (main) X6.forEach(function (x, i) { R.el("line", { x1: f.sx(x), x2: f.sx(x), y1: f.sy(Y6[i]), y2: f.sy(my - main.b * mx + main.b * x), class: "rv-res" }, f.g); });
      bs.forEach(function (q) {
        var b1 = my - q.b * mx; R.line(f, b1, q.b, 0, 14, q.main ? "rv-line" : "rv-alt");
        if (q.lab) { var xe = Math.min(13.3, (14.5 - b1) / Math.max(q.b, 1e-9)); R.txt({ x: f.sx(xe) + 4, y: f.sy(b1 + q.b * xe) + 4, class: "rv-letter" }, q.lab, f.g); }
      });
      X6.forEach(function (x, i) { R.dot(f, x, Y6[i], 4.5, "rv-pt", f.g); });
    }
    function paintR(s, bs) {
      var g = R.frame(s, { x0: 0, x1: 2, y0: 0, y1: 80, dx: 0.5, dy: 20, m: M, xl: t("kemiringan", "slope") + " β̂₂" });
      var d = ""; for (var z = 0; z <= 2.0001; z += 0.02) d += (z === 0 ? "M" : "L") + g.sx(z) + " " + g.sy(S(z));
      R.el("path", { d: d, class: "rv-curve" }, g.g);
      bs.forEach(function (q) {
        var h = 0.3, b = q.b;
        R.el("line", { x1: g.sx(b - h), y1: g.sy(S(b) - dS(b) * h), x2: g.sx(b + h), y2: g.sy(S(b) + dS(b) * h), class: "rv-tan" }, g.g);
        R.dot(g, b, S(b), 6, "rv-dot", g.g);
        if (q.lab) R.txt({ x: g.sx(b), y: g.sy(S(b)) - 12, "text-anchor": "middle", class: "rv-letter" }, q.lab, g.g);
      });
      R.txt({ x: g.sx(0.05), y: g.sy(76), class: "rv-note-m" }, "SSR", g.svg);
    }
    var b = 0.3;
    function draw() {
      var at = Math.abs(b - O6.b2) < 1e-9;
      paintL(svgs[0], [{ b: b, main: true }]); paintR(svgs[1], [{ b: b }]);
      $("rv-curve-b2v").textContent = F(b, at ? 3 : 2);
      out.innerHTML = "SSR = <span class='rv-big'>" + F(S(b), 2) + "</span>. " + t("Kemiringan garis singgung (turunan) = ", "Slope of the tangent (derivative) = ") + "<b>" + F(at ? 0 : dS(b), 1) + "</b>.<br>" +
        (at ? t("<b>Dasar kurva tercapai.</b> Garis singgung datar (turunan = 0), sehingga SSR paling kecil. Kemiringan pada titik ini adalah taksiran OLS.",
                "<b>The bottom of the curve.</b> The tangent is flat (derivative = 0), so SSR is at its smallest. The slope at this point is the OLS estimate.")
            : (dS(b) < 0 ? t("Garis singgung menurun: SSR masih dapat diperkecil dengan <b>menaikkan</b> kemiringan.", "The tangent slopes down: SSR can still be reduced by <b>increasing</b> the slope.")
                         : t("Garis singgung menanjak: SSR dapat diperkecil dengan <b>menurunkan</b> kemiringan.", "The tangent slopes up: SSR can be reduced by <b>decreasing</b> the slope.")));
    }
    sl.addEventListener("input", function () { b = +sl.value; draw(); });
    $("rv-curve-min").addEventListener("click", function () { b = O6.b2; sl.value = b; draw(); });
    draw();
    var Q = [{ b: 0.3, lab: "A" }, { b: O6.b2, lab: "B", main: true }, { b: 1.6, lab: "C" }];
    R.print(root, [{ paint: function (s) { paintL(s, Q); }, caption: t("Tiga garis kandidat; residual digambar untuk garis B", "Three candidate lines; residuals drawn for line B") },
      { paint: function (s) { paintR(s, Q); }, caption: t("Posisi A, B, dan C pada kurva SSR", "Positions of A, B, and C on the SSR curve") }],
      { cols: 2, viewBox: "0 0 300 260",
        note: inti("di A kemiringan terlalu kecil dan garis singgung menurun; di C terlalu besar dan garis singgung menanjak. Di B, dasar kurva, garis singgung datar (turunan = 0) dan SSR paling kecil. Kemiringan di B, yaitu " + F(O6.b2, 3) + ", adalah taksiran OLS.",
                   "at A the slope is too small and the tangent slopes down; at C it is too large and the tangent slopes up. At B, the bottom of the curve, the tangent is flat (derivative = 0) and SSR is smallest. The slope at B, " + F(O6.b2, 3) + ", is the OLS estimate.") });
  })();

  /* 11. Perhitungan bertahap */
  (function () {
    var root = $("rv-steps"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out"), step = 1, N = 4;
    var T = [
      t("<b>Langkah 1.</b> Gambarkan keenam data dalam diagram pencar.", "<b>Step 1.</b> Plot the six observations in a scatter plot."),
      t("<b>Langkah 2.</b> Hitung rata-rata: X̄ = 42/6 = <b>7</b> dan Ȳ = 45/6 = <b>7,5</b>. Garis putus-putus membagi bidang menjadi empat kuadran. Garis OLS selalu melewati titik rata-rata.",
        "<b>Step 2.</b> Compute the means: X̄ = 42/6 = <b>7</b> and Ȳ = 45/6 = <b>7.5</b>. The dashed lines split the plane into four quadrants. The OLS line always passes through the point of means."),
      t("<b>Langkah 3.</b> Ukur selisih setiap titik terhadap rata-rata: x = X − 7 dan y = Y − 7,5. Setiap persegi panjang biru berukuran x × y. Semua titik berada di kuadran kanan-atas atau kiri-bawah, sehingga semua x·y positif. Jumlahnya <b>Σxy = 67</b>, sedangkan <b>Σx² = 70</b>.",
        "<b>Step 3.</b> Measure each point's distance from the means: x = X − 7 and y = Y − 7.5. Each blue rectangle has size x × y. All points lie in the upper-right or lower-left quadrant, so every x·y is positive. Their sum is <b>Σxy = 67</b>, while <b>Σx² = 70</b>."),
      t("<b>Langkah 4.</b> Kemiringan β̂₂ = 67/70 ≈ <b>0,957</b>. Intersep β̂₁ = 7,5 − 0,957 × 7 = <b>0,8</b>. Garis taksiran: ",
        "<b>Step 4.</b> Slope β̂₂ = 67/70 ≈ <b>0.957</b>. Intercept β̂₁ = 7.5 − 0.957 × 7 = <b>0.8</b>. Estimated line: ") + "<span class='rv-big'>" + EQ + "</span>."];
    var CAP = ["<b>1.</b> " + t("Gambarkan data", "Plot the data"), "<b>2.</b> " + t("Hitung rata-rata", "Compute the means") + ": (7; " + F(7.5, 1) + ")",
      "<b>3.</b> " + t("Selisih dari rata-rata", "Deviations from the means") + ": Σxy = 67, Σx² = 70", "<b>4.</b> β̂₂ = 67/70 ≈ " + F(O6.b2, 3) + "; β̂₁ = " + F(0.8, 1)];
    function paint(s, step) {
      var f = R.frame(s, { x0: 0, x1: 14, y0: 0, y1: 15, dx: 2, dy: 3, xl: AX, yl: AY });
      if (step >= 2) {
        R.el("line", { x1: f.sx(O6.mx), x2: f.sx(O6.mx), y1: f.sy(0), y2: f.sy(15), class: "rv-guide" }, f.g);
        R.el("line", { x1: f.sx(0), x2: f.sx(14), y1: f.sy(O6.my), y2: f.sy(O6.my), class: "rv-guide" }, f.g);
        R.txt({ x: f.sx(O6.mx) + 5, y: f.sy(14.2), class: "rv-note-m" }, "X̄ = 7", f.g);
        R.txt({ x: f.sx(13.9), y: f.sy(O6.my) - 6, "text-anchor": "end", class: "rv-note-m" }, "Ȳ = " + F(7.5, 1), f.g);
        [[11, 13.6, "rv-note-b", ">"], [3, 1.2, "rv-note-b", ">"], [3, 13.6, "rv-note-m", "<"], [11, 1.2, "rv-note-m", "<"]].forEach(function (q) {
          R.txt({ x: f.sx(q[0]), y: f.sy(q[1]), "text-anchor": "middle", class: q[2] }, "x·y " + q[3] + " 0", f.g);
        });
      }
      if (step >= 3) X6.forEach(function (x, i) {
        var ax = Math.min(f.sx(x), f.sx(O6.mx)), ay = Math.min(f.sy(Y6[i]), f.sy(O6.my));
        R.el("rect", { x: ax, y: ay, width: Math.abs(f.sx(x) - f.sx(O6.mx)), height: Math.abs(f.sy(Y6[i]) - f.sy(O6.my)), class: "rv-rect" }, f.g);
        R.txt({ x: f.sx(x) + (x > O6.mx ? 6 : -6), y: f.sy(Y6[i]) + (Y6[i] > O6.my ? -6 : 14), "text-anchor": x > O6.mx ? "start" : "end", class: "rv-note-b" }, F((x - O6.mx) * (Y6[i] - O6.my), 1), f.g);
      });
      if (step >= 4) R.line(f, O6.b1, O6.b2, 0, 14, "rv-line");
      X6.forEach(function (x, i) { R.dot(f, x, Y6[i], 6, "rv-pt", f.g); });
      if (step >= 2) R.dot(f, O6.mx, O6.my, 7, "rv-dot", f.g);
    }
    function draw() {
      paint(svg, step); out.innerHTML = T[step - 1];
      $("rv-steps-n").textContent = t("Langkah ", "Step ") + step + t(" dari ", " of ") + N;
      $("rv-steps-prev").disabled = step === 1; $("rv-steps-next").disabled = step === N;
    }
    $("rv-steps-prev").addEventListener("click", function () { if (step > 1) { step--; draw(); } });
    $("rv-steps-next").addEventListener("click", function () { if (step < N) { step++; draw(); } });
    draw();
    R.print(root, [1, 2, 3, 4].map(function (k) { return { paint: function (s) { paint(s, k); }, caption: CAP[k - 1] }; }),
      { cols: 2, viewBox: "0 0 380 300",
        note: inti("OLS dihitung dalam empat langkah: gambarkan data, hitung rata-rata, jumlahkan hasil kali selisih (Σxy) dan kuadrat selisih X (Σx²), lalu bagi keduanya untuk memperoleh kemiringan.",
                   "OLS is computed in four steps: plot the data, compute the means, sum the products of deviations (Σxy) and the squared deviations of X (Σx²), then divide one by the other to get the slope.") });
  })();

  /* 12. Prediksi dan ekstrapolasi */
  (function () {
    var root = $("rv-pred"); if (!root) return;
    var svg = root.querySelector("svg"), out = root.querySelector(".rv-out"), sl = $("rv-pred-x");
    function yhat(x) { return 0.8 + 0.957 * x; }
    function paint(s, x) {
      var yh = yhat(x), f = R.frame(s, { x0: 0, x1: 16, y0: 0, y1: 18, dx: 2, dy: 3, xl: AX, yl: AY });
      R.el("rect", { x: f.sx(2), y: f.sy(18), width: f.sx(12) - f.sx(2), height: f.sy(0) - f.sy(18), class: "rv-shade" }, f.g);
      R.txt({ x: f.sx(7), y: f.sy(17), "text-anchor": "middle", class: "rv-note-b" }, t("rentang data (2 sampai 12)", "data range (2 to 12)"), f.g);
      R.line(f, O6.b1, O6.b2, 0, 16, "rv-line");
      X6.forEach(function (xx, i) { R.dot(f, xx, Y6[i], 4.5, "rv-pt", f.g); });
      R.el("line", { x1: f.sx(x), x2: f.sx(x), y1: f.sy(0), y2: f.sy(yh), class: "rv-guide" }, f.g);
      R.el("line", { x1: f.sx(0), x2: f.sx(x), y1: f.sy(yh), y2: f.sy(yh), class: "rv-guide" }, f.g);
      R.dot(f, x, yh, 7, "rv-dot", f.g);
      R.txt({ x: f.sx(0) + 6, y: f.sy(yh) - 6, class: "rv-note" }, "Ŷ = " + F(yh, 2), f.g);
    }
    function draw() {
      var x = +sl.value, inr = x >= 2 && x <= 12; paint(svg, x);
      $("rv-pred-xv").textContent = F(x, 1);
      out.innerHTML = "Ŷ = " + F(0.8, 1) + " + " + F(0.957, 3) + " × " + F(x, 1) + " = <span class='rv-big'>" + F(yhat(x), 2) + "</span><br>" +
        (inr ? t("X berada di dalam rentang data, sehingga prediksi relatif dapat dipercaya.", "X is inside the data range, so the prediction is relatively reliable.")
             : "<span class='rv-warn'>" + t("Hati-hati: X berada di luar rentang data. Ini ekstrapolasi; pola garis belum tentu berlaku di sini.", "Caution: X is outside the data range. This is extrapolation; the pattern may not hold here.") + "</span>");
    }
    sl.addEventListener("input", draw); draw();
    R.print(root, [{ paint: function (s) { paint(s, 9); }, caption: "<b>" + t("Di dalam rentang data", "Inside the data range") + "</b>: X = 9, Ŷ = " + F(yhat(9), 2) },
      { paint: function (s) { paint(s, 15); }, caption: "<b>" + t("Ekstrapolasi", "Extrapolation") + "</b>: X = 15, Ŷ = " + F(yhat(15), 2) }],
      { cols: 2, viewBox: "0 0 400 320",
        note: inti("prediksi di dalam rentang data (arsiran biru) relatif dapat dipercaya; prediksi di luar rentang data disebut <b>ekstrapolasi</b> dan perlu disikapi dengan hati-hati.",
                   "predictions inside the data range (blue band) are relatively reliable; predictions outside it are called <b>extrapolation</b> and should be treated with caution.") });
  })();
});
