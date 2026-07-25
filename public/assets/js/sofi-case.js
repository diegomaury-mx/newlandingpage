/**
 * Caso SOFI. Consume tres data files generados desde el sistema real
 * (window.SOFI_FSM, window.SOFI_CONVERSATION, window.SOFI_METRICS).
 * No inventa ningún dato: si un data file falta, la sección se queda vacía
 * en vez de rellenarse con algo plausible.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // Video de /brag: pieza de presentación, no evidencia. Solo se muestra si el
  // archivo existe de verdad. Nunca un reproductor roto.
  // ---------------------------------------------------------------------------
  var figure = document.getElementById('sofi-video');
  if (figure) {
    var video = figure.querySelector('video');
    video.addEventListener('loadedmetadata', function () { figure.hidden = false; });
    video.load();
  }

  // ---------------------------------------------------------------------------
  // FSM: los estados salen del código, no de esta página.
  // ---------------------------------------------------------------------------
  var grid = document.getElementById('sofi-fsm-grid');
  if (grid && window.SOFI_FSM) {
    var fsm = window.SOFI_FSM;
    var terminal = fsm.terminalStates || [];

    var thresh = document.getElementById('sofi-thresh');
    if (thresh) thresh.textContent = String(fsm.confidenceThreshold);

    fsm.states.forEach(function (state) {
      var isTerminal = terminal.indexOf(state) !== -1;
      var destinos = (fsm.stateMap && fsm.stateMap[state]) || [];

      var card = document.createElement('div');
      card.className = 'sofi-state' + (isTerminal ? ' sofi-state--terminal' : '');

      var name = document.createElement('p');
      name.className = 'sofi-state__name';
      name.appendChild(document.createTextNode(state));
      if (isTerminal) {
        var badge = document.createElement('span');
        badge.className = 'sofi-state__badge';
        badge.textContent = 'terminal';
        name.appendChild(badge);
      }

      var to = document.createElement('p');
      to.className = 'sofi-state__to';
      to.textContent = isTerminal
        ? 'Absorbente. No sale.'
        : (destinos.length ? '→ ' + destinos.join(', ') : 'Sin salidas.');

      card.appendChild(name);
      card.appendChild(to);
      grid.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // Ficha técnica: cada número con su método al lado.
  // ---------------------------------------------------------------------------
  var ficha = document.getElementById('sofi-ficha');
  if (ficha && window.SOFI_METRICS) {
    window.SOFI_METRICS.items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'sofi-ficha__row';

      var dt = document.createElement('dt');
      dt.textContent = item.label;

      var val = document.createElement('dd');
      val.className = 'sofi-ficha__value';
      val.textContent = item.value;

      var dd = document.createElement('dd');
      dd.className = 'sofi-ficha__method';
      dd.textContent = item.method;

      row.appendChild(dt);
      row.appendChild(val);
      row.appendChild(dd);
      ficha.appendChild(row);
    });
  }

  // ---------------------------------------------------------------------------
  // Simulador.
  // ---------------------------------------------------------------------------
  var thread = document.getElementById('sofi-thread');
  var tracePane = document.getElementById('sofi-trace');
  var btnPlay = document.getElementById('sofi-play');
  var btnStep = document.getElementById('sofi-step');
  var btnReset = document.getElementById('sofi-reset');

  if (!thread || !tracePane || !window.SOFI_CONVERSATION) return;

  var turns = window.SOFI_CONVERSATION.turns || [];
  var threshold = (window.SOFI_FSM && window.SOFI_FSM.confidenceThreshold) || 0.75;

  var cursor = 0;      // siguiente turno por mostrar
  var timer = null;    // id del setTimeout cuando va reproduciendo

  function row(label, value, extraClass) {
    var r = document.createElement('div');
    r.className = 'sofi-trace__row';

    var k = document.createElement('span');
    k.className = 'sofi-trace__k';
    k.textContent = label;

    var v = document.createElement('span');
    v.className = 'sofi-trace__v' + (extraClass ? ' ' + extraClass : '');
    v.textContent = value;

    r.appendChild(k);
    r.appendChild(v);
    return r;
  }

  /** El panel derecho. Solo los turnos entrantes traen trace: el FSM corre sobre lo que entra. */
  function renderTrace(trace) {
    tracePane.textContent = '';
    if (!trace) return;

    var movio = trace.stateBefore !== trace.stateAfter;

    tracePane.appendChild(row('Estado antes', trace.stateBefore, 'sofi-trace__v--state'));
    tracePane.appendChild(row('Intent del modelo', trace.intent || 'no clasificado'));

    // La confianza, con el umbral dibujado. Es el primer candado, y se ve.
    if (typeof trace.confidence === 'number') {
      var wrap = document.createElement('div');
      wrap.className = 'sofi-conf';
      wrap.appendChild(row('Confianza', trace.confidence.toFixed(2)));

      var bar = document.createElement('div');
      bar.className = 'sofi-conf__bar';

      var fill = document.createElement('div');
      fill.className = 'sofi-conf__fill' + (trace.confidence < threshold ? ' is-low' : '');

      var mark = document.createElement('div');
      mark.className = 'sofi-conf__thresh';
      mark.style.left = (threshold * 100) + '%';

      bar.appendChild(fill);
      bar.appendChild(mark);
      wrap.appendChild(bar);

      var legend = document.createElement('p');
      legend.className = 'sofi-conf__legend';
      legend.textContent = trace.confidence < threshold
        ? 'Debajo del umbral de ' + threshold + '. El FSM no se mueve.'
        : 'Umbral: ' + threshold + '. La marca blanca.';
      wrap.appendChild(legend);

      tracePane.appendChild(wrap);
      // Reflow forzado, no requestAnimationFrame: en una pestaña de fondo el rAF
      // no dispara y la barra se quedaría vacía. Esto arranca la transición desde
      // el 0 del CSS y funciona igual con la pestaña oculta.
      void bar.offsetWidth;
      fill.style.width = Math.round(trace.confidence * 100) + '%';
    }

    tracePane.appendChild(
      row('Estado después', trace.stateAfter, movio ? 'sofi-trace__v--moved' : 'sofi-trace__v--state')
    );

    var razon;
    if (movio) {
      razon = 'Transición válida. El lead avanza.';
    } else if (trace.reason === 'low_confidence') {
      razon = 'El modelo dudó. El lead se queda donde está.';
    } else if (trace.reason === 'pause') {
      razon = 'El lead pidió pausa. La entrevista retoma donde quedó.';
    } else if (trace.reason === 'invalid_transition') {
      razon = 'El grafo rechazó el destino' + (trace.rejected ? ' (' + trace.rejected + ')' : '') + '.';
    } else {
      razon = 'El intent no mueve este estado. El lead se queda donde está.';
    }
    tracePane.appendChild(row('Decisión', razon));
  }

  /** Muestra el siguiente turno. Devuelve false cuando ya no hay más. */
  function stepOnce() {
    if (cursor >= turns.length) return false;

    var turn = turns[cursor];

    var msg = document.createElement('div');
    msg.className = 'sofi-msg sofi-msg--' + turn.dir;
    msg.textContent = turn.text;
    thread.appendChild(msg);

    // Mismo motivo que en la barra de confianza: sin esto, en una pestaña de fondo
    // los mensajes se quedan en opacity 0 y el simulador se ve vacío.
    void msg.offsetWidth;
    msg.classList.add('is-shown');
    thread.scrollTo({ top: thread.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });

    if (turn.trace) renderTrace(turn.trace);

    cursor++;
    if (cursor >= turns.length) {
      btnStep.disabled = true;
      btnPlay.textContent = 'Reproducir';
    }
    return true;
  }

  function isPlaying() { return timer !== null; }

  function stop() {
    if (timer) clearTimeout(timer);
    timer = null;
    btnPlay.textContent = 'Reproducir';
    btnStep.disabled = cursor >= turns.length;
  }

  function play() {
    btnPlay.textContent = 'Pausar';
    btnStep.disabled = true;

    (function tick() {
      if (!stepOnce()) { stop(); return; }
      // El ritmo real de la corrida, comprimido para que se pueda ver.
      var delay = 700;
      if (cursor < turns.length) {
        var gap = turns[cursor].tOffsetMs - turns[cursor - 1].tOffsetMs;
        delay = Math.min(Math.max(gap / 3, 450), 1800);
      }
      timer = setTimeout(tick, reduceMotion ? 250 : delay);
    })();
  }

  function reset() {
    stop();
    cursor = 0;
    thread.textContent = '';
    tracePane.textContent = '';
    btnStep.disabled = false;

    var empty = document.createElement('p');
    empty.className = 'sofi-trace__empty';
    empty.textContent = 'Dale a Reproducir. Cada mensaje del lead pasa por el modelo, '
      + 'que clasifica la intención, y por la máquina de estados, que decide si avanza.';
    tracePane.appendChild(empty);
  }

  btnPlay.addEventListener('click', function () {
    if (isPlaying()) { stop(); return; }
    if (cursor >= turns.length) reset();
    play();
  });

  btnStep.addEventListener('click', function () {
    if (isPlaying()) stop();
    stepOnce();
  });

  btnReset.addEventListener('click', reset);

  reset();
})();
