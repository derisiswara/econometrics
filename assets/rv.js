/*
 * rv.js : pustaka kecil untuk ilustrasi interaktif (SVG) di buku teks.
 *
 * Dimuat sekali per halaman sebelum skrip ilustrasi:
 *   <script src="../assets/rv.js"></script>
 *
 * API ringkas (semua tersedia melalui objek global RV):
 *   RV.frame(svg, opsi)   menggambar sumbu dan grid; mengembalikan {sx, sy, g, svg, W, H, m}
 *                         opsi: {x0,x1,y0,y1, dx,dy (jarak tick), xl,yl (label sumbu), m (margin)}
 *                         sx/sy mengubah koordinat data menjadi piksel; g adalah grup ber-clip.
 *   RV.line(f, b1, b2, xa, xb, kelas)   garis y = b1 + b2*x dari xa ke xb
 *   RV.dot(f, x, y, r, kelas, induk)    titik
 *   RV.el(tag, atribut, induk)          membuat elemen SVG
 *   RV.txt(atribut, teks, induk)        membuat teks SVG
 *   RV.ols(X, Y)                        {b1, b2, mx, my, sxy, sxx}
 *   RV.fmt(angka, desimal)              format desimal sesuai bahasa halaman (id: koma, en: titik)
 *   RV.t("teks Indonesia", "English")   memilih teks sesuai bahasa halaman; RV.lang = "id" atau "en"
 *   RV.rng(seed), RV.normal(rng)        bilangan acak yang dapat diulang
 *   RV.DX, RV.DY                        data contoh enam keluarga (Bab 1)
 *   RV.print(root, panel, opsi)         mendaftarkan versi statis untuk cetak/PDF (lihat bagian Mode cetak)
 *
 * Warna diatur oleh kelas CSS di assets/widget.css (rv-pt, rv-line, rv-res, ...).
 */
window.RV = (function () {
  var NS = "http://www.w3.org/2000/svg", cid = 0;
  /* Bahasa halaman diambil dari atribut lang (diatur Quarto): "id" atau "en". */
  var lang = ((document.documentElement.getAttribute("lang") || "id").slice(0, 2) === "en") ? "en" : "id";
  function t(idText, enText) { return lang === "en" ? enText : idText; }

  function el(t, a, p) {
    var e = document.createElementNS(NS, t);
    for (var k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function txt(a, s, p) { var e = el("text", a, p); e.textContent = s; return e; }
  function fmt(v, d) {
    var s = (Math.abs(v) < 5e-13 ? 0 : v).toFixed(d === undefined ? 2 : d);
    if (lang === "id") s = s.replace(".", ",");
    return s.replace("-", "−");
  }
  function range(a, b, s) {
    var r = [];
    for (var v = a; v <= b + 1e-9; v += s) r.push(Math.round(v * 100) / 100);
    return r;
  }
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function normal(r) {
    var u = 0;
    while (u === 0) u = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
  }
  function mean(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
  function ols(X, Y) {
    var mx = mean(X), my = mean(Y), sxy = 0, sxx = 0;
    for (var i = 0; i < X.length; i++) {
      sxy += (X[i] - mx) * (Y[i] - my);
      sxx += (X[i] - mx) * (X[i] - mx);
    }
    var b2 = sxy / sxx;
    return { b1: my - b2 * mx, b2: b2, mx: mx, my: my, sxy: sxy, sxx: sxx };
  }

  function frame(svg, o) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var vb = svg.getAttribute("viewBox").split(/[ ,]+/).map(Number),
        W = vb[2], H = vb[3], m = o.m || { l: 46, r: 14, t: 12, b: 42 };
    var sx = function (x) { return m.l + (x - o.x0) / (o.x1 - o.x0) * (W - m.l - m.r); };
    var sy = function (y) { return H - m.b - (y - o.y0) / (o.y1 - o.y0) * (H - m.t - m.b); };
    var lab = function (v) { return lang === "id" ? String(v).replace(".", ",") : String(v); };
    if (o.dx) range(o.x0, o.x1, o.dx).forEach(function (t) {
      el("line", { x1: sx(t), x2: sx(t), y1: sy(o.y0), y2: sy(o.y1), class: "rv-gl" }, svg);
      txt({ x: sx(t), y: sy(o.y0) + 16, "text-anchor": "middle", class: "rv-tk" }, lab(t), svg);
    });
    if (o.dy) range(o.y0, o.y1, o.dy).forEach(function (t) {
      el("line", { x1: sx(o.x0), x2: sx(o.x1), y1: sy(t), y2: sy(t), class: "rv-gl" }, svg);
      txt({ x: sx(o.x0) - 7, y: sy(t) + 4, "text-anchor": "end", class: "rv-tk" }, lab(t), svg);
    });
    el("line", { x1: sx(o.x0), x2: sx(o.x1), y1: sy(o.y0), y2: sy(o.y0), class: "rv-ax" }, svg);
    el("line", { x1: sx(o.x0), x2: sx(o.x0), y1: sy(o.y0), y2: sy(o.y1), class: "rv-ax" }, svg);
    if (o.xl) txt({ x: (sx(o.x0) + sx(o.x1)) / 2, y: H - 6, "text-anchor": "middle", class: "rv-lb" }, o.xl, svg);
    if (o.yl) {
      var cy = (sy(o.y0) + sy(o.y1)) / 2, lx = o.ylx || 13;
      txt({ x: lx, y: cy, "text-anchor": "middle", class: "rv-lb", transform: "rotate(-90 " + lx + " " + cy + ")" }, o.yl, svg);
    }
    var id = "rvclip" + (++cid), d = el("defs", {}, svg), cp = el("clipPath", { id: id }, d);
    el("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b }, cp);
    var g = el("g", { "clip-path": "url(#" + id + ")" }, svg);
    return { sx: sx, sy: sy, W: W, H: H, m: m, g: g, svg: svg };
  }
  function line(f, b1, b2, x0, x1, cls, p) {
    return el("line", { x1: f.sx(x0), y1: f.sy(b1 + b2 * x0), x2: f.sx(x1), y2: f.sy(b1 + b2 * x1), class: cls }, p || f.g);
  }
  function dot(f, x, y, r, cls, p) {
    return el("circle", { cx: f.sx(x), cy: f.sy(y), r: r, class: cls }, p || f.svg);
  }

  /* ---------- Mode cetak ----------
   * Setiap ilustrasi interaktif dapat mendaftarkan versi statisnya:
   *   RV.print(root, panel, opsi)
   *     panel : [{paint: function(svg){...}, caption: "teks", viewBox: "0 0 300 260"}, ...]
   *     opsi  : {cols: jumlah kolom, note: "pesan inti (HTML)", viewBox: bawaan untuk semua panel}
   * Versi statis selalu dibangun saat halaman dimuat, tetapi hanya tampil ketika:
   *   - halaman dicetak atau disimpan sebagai PDF (@media print),
   *   - tombol "Tampilan cetak" diaktifkan, atau
   *   - alamat halaman memuat ?print atau ?print-pdf.
   */
  function bridgeUrl(id) {
    return location.href.split("#")[0].split("?")[0] + "#" + id;
  }
  function bridge(id) {
    var b = document.createElement("div"), url = bridgeUrl(id);
    b.className = "rv-bridge";
    if (typeof window.qrcode === "function" && /^https?:/.test(url)) {
      try {
        var q = window.qrcode(0, "M"); q.addData(url); q.make();
        var w = document.createElement("span"); w.className = "rv-qr";
        w.innerHTML = q.createSvgTag(2, 0);
        b.appendChild(w);
      } catch (e) { /* QR opsional */ }
    }
    var tx = document.createElement("span");
    tx.innerHTML = t("Versi interaktif ilustrasi ini:", "Interactive version of this figure:") + "<br><span class='rv-url'>" + url + "</span>";
    b.appendChild(tx);
    return b;
  }
  function print(root, panels, opt) {
    opt = opt || {};
    var main = root.querySelector("svg"),
        vb = opt.viewBox || (main ? main.getAttribute("viewBox") : "0 0 560 320");
    var box = document.createElement("div"); box.className = "rv-print";
    var grid = document.createElement("div"); grid.className = "rv-print-grid";
    grid.setAttribute("data-cols", String(opt.cols || panels.length));
    panels.forEach(function (p) {
      var fig = document.createElement("figure");
      var s = el("svg", { viewBox: p.viewBox || vb, class: "rv-svg", role: "img", "aria-label": (p.caption || "").replace(/<[^>]+>/g, "") });
      fig.appendChild(s);
      p.paint(s);
      if (p.caption) { var c = document.createElement("figcaption"); c.innerHTML = p.caption; fig.appendChild(c); }
      grid.appendChild(fig);
    });
    box.appendChild(grid);
    if (opt.note) { var n = document.createElement("p"); n.className = "rv-print-note"; n.innerHTML = opt.note; box.appendChild(n); }
    box.appendChild(bridge(root.id));
    root.appendChild(box);
    root.classList.add("rv-has-print");
  }
  function setPrintView(on) {
    document.body.classList.toggle("rv-printing", !!on);
    var bs = document.querySelectorAll(".rv-mode button");
    for (var i = 0; i < bs.length; i++) {
      bs[i].setAttribute("aria-pressed", on ? "true" : "false");
      bs[i].textContent = on ? t("Kembali ke tampilan interaktif", "Back to interactive view") : t("Lihat tampilan cetak (PDF)", "Show print view (PDF)");
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (/[?&]print(-pdf)?\b/.test(location.search)) setPrintView(true);
    var bs = document.querySelectorAll(".rv-mode button");
    for (var i = 0; i < bs.length; i++) bs[i].addEventListener("click", function () {
      setPrintView(!document.body.classList.contains("rv-printing"));
    });
    setPrintView(document.body.classList.contains("rv-printing"));
  });

  return {
    lang: lang, t: t, el: el, txt: txt, fmt: fmt, range: range, rng: rng, normal: normal, mean: mean, ols: ols,
    frame: frame, line: line, dot: dot, print: print, setPrintView: setPrintView,
    DX: [2, 4, 6, 8, 10, 12], DY: [3, 4, 7, 8, 11, 12]
  };
})();
