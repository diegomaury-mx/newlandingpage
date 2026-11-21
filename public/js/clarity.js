// Solo graba en producción: QA local y previews de Pages no deben contaminar Clarity.
(function (c, l, a, r, i, t, y) {
  if (!/(^|\.)diegomaury\.mx$/.test(l.location.hostname)) return;
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode?.insertBefore(t, y);
})(window, document, "clarity", "script", "x7ns7c22xi");
