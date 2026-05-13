/* @jsx React.createElement */
const { useState } = React;

const ISO_SVG = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%', height:'100%'}}>
    <path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" fill="none"/>
    <path d="M22 64 L46 38 L54 50 L54 74 L78 60 L78 36" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    <path d="M54 74 L46 78 L22 64" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
  </svg>
);

function Nav({active, onNavigate}) {
  const links = [['work','Work'], ['servicios','Servicios'], ['about','About'], ['contacto','Contacto']];
  return (
    <nav className="nav">
      <div className="container nav__inner">
        <a href="#hero" className="nav__brand" onClick={(e)=>{e.preventDefault(); onNavigate('hero');}}>
          <img className="nav__logo" src="../../assets/isotipo-gradient.png" alt="DM" />
          <span className="nav__name">Diego Maury</span>
        </a>
        <ul className="nav__links">
          {links.map(([id,label]) => (
            <li key={id}><a href={`#${id}`} className={`nav__link ${active===id?'is-active':''}`}
              onClick={(e)=>{e.preventDefault(); onNavigate(id);}}>{label}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Hero({onCTA}) {
  return (
    <section className="hero" id="hero">
      <div className="bg-pattern"></div>
      <div className="container section-content">
        <div className="hero__inner">
          <p className="hero__tag mono">Strategic Program &amp; Innovation Manager</p>
          <h1 className="hero__headline">Programas y sistemas que convierten<br/>innovación en resultados medibles.</h1>
          <p className="hero__sub">Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM.</p>
          <div className="hero__ctas">
            <a className="btn btn--ember" onClick={()=>onCTA('cv')}>Descargar CV</a>
            <a className="btn btn--outline" onClick={()=>onCTA('call')}>Agendar llamada</a>
          </div>
        </div>
      </div>
      <div className="hero__metrics">
        <div className="container hero__metrics-inner">
          <div className="hero__metric"><span className="hero__metric-num">30+</span><span className="hero__metric-label mono">Programas<br/>implementados</span></div>
          <div className="hero__metric"><span className="hero__metric-num">900+</span><span className="hero__metric-label mono">Proyectos<br/>evaluados</span></div>
          <div className="hero__metric"><span className="hero__metric-num">3,000+</span><span className="hero__metric-label mono">Emprendedores<br/>impactados</span></div>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  {id:'heineken', num:'01', name:'HEINEKEN Green Challenge', meta:'Ecosistemas · Program Ops · 2019–2022', metric:'+600%',
   industry:'CONSUMO · SUSTENTABILIDAD', heroMeta:'Registros de proyectos · 2019 → 2022',
   ctx:'Programa de innovación en sustentabilidad de HEINEKEN México. Convocatoria abierta a emprendedores con soluciones para reducir huella ambiental.',
   problem:'En la edición inicial el programa registró apenas 36 proyectos. Bajo conocimiento de marca en el ecosistema de innovación, criterios de evaluación poco claros, y un proceso de selección manual que no escalaba.',
   role:'Diseñé el rediseño operativo del programa: customer journey, virtualización del proceso, automatización de evaluaciones y nueva narrativa de convocatoria.',
   actions:['Mapa de Customer Journey de cada participante (registro, evaluación, mentoría, demo day).', 'Virtualización del programa durante COVID — pasamos eventos presenciales a online sin perder calidad.', 'Implementación de Redux como sistema de evaluación: criterios estandarizados, pesos definidos, evaluadores calibrados.', 'Nueva narrativa de convocatoria con foco en impacto y métricas de sustentabilidad.'],
   results:['+600% en registros (36 → 250+) en 3 años', 'Referente nacional de programas de sustentabilidad corporativa', 'Sistema de evaluación reutilizado en otros programas de HEINEKEN'],
   learn:['Un programa no escala sin sistema de evaluación calibrado.', 'Virtualizar bien obliga a documentar — y eso mejora la operación.']},
  {id:'innovation', num:'02', name:'Innovation Systems Builder', meta:'Transformación · Producto · 2020–2022', metric:'+500%',
   industry:'PROPTECH · FINTECH', heroMeta:'Generación de leads FlipHouse · 2020',
   ctx:'Construcción de sistemas de innovación para FlipHouse, HackSureste y CAVA Soft. Tres contextos distintos: PropTech, hackatón regional, software empresarial.',
   problem:'Cada empresa tenía iniciativas de innovación dispersas, sin métricas comunes ni cadencia de revisión. Equipos operando en silos.',
   role:'Diseño y setup de sistemas de gestión: CRM, automatizaciones, dashboards, flujos de trabajo. Capacitación de equipos para mantenerlos.',
   actions:['Mapeo de procesos actuales y dolor por área.', 'Setup de HubSpot + automatizaciones para FlipHouse.', 'Dashboards de innovación con KPIs por iniciativa.', 'Playbook operativo + capacitación intensiva al equipo interno.'],
   results:['+500% leads en FlipHouse (Q1 2020 → Q4 2020)', '3 sistemas de innovación productivos en empresas distintas', 'Equipos internos operando sin dependencia externa al cierre del proyecto'],
   learn:['Las herramientas no resuelven; los procesos sí. Las herramientas escalan procesos.', 'Capacitar al equipo interno es parte del entregable, no un extra.']},
  {id:'redux', num:'03', name:'REDUX + INCmty Challenges', meta:'Metodología · Aceleración · 2020–2023', metric:'1,000+',
   industry:'EDUCACIÓN · ECOSISTEMA', heroMeta:'Estudiantes participantes · 32 estados',
   ctx:'INCmty es el festival de emprendimiento más grande de LATAM. REDUX fue la metodología de aceleración aplicada a Challenges con estudiantes universitarios.',
   problem:'Los Challenges tradicionales generaban entusiasmo pero pocos proyectos viables. Faltaba una metodología que convirtiera ideas en sistemas.',
   role:'Diseñé REDUX: framework de aceleración de 8 semanas. Operación end-to-end de Challenges con universidades de los 32 estados.',
   actions:['Framework REDUX con 5 etapas: descubrimiento, definición, prototipo, validación, presentación.', 'Convocatoria nacional con presencia en 32 estados.', 'Sistema de evaluación con 900+ proyectos evaluados por panel calibrado.', 'Demo Day en INCmty con jurado de inversionistas y corporativos.'],
   results:['1,000+ estudiantes participantes', 'Proyectos en 32 estados de México', '900+ proyectos evaluados con criterios homologados'],
   learn:['Una metodología clara es más valiosa que un mentor brillante.', 'El alcance geográfico se construye con sistema, no con presupuesto.']}
];

function WorkSection({onOpenCase}) {
  return (
    <section className="work" id="work">
      <div className="bg-pattern"></div>
      <div className="container section-content">
        <p className="section-label">Selected Work</p>
        <h2 className="section-title">3 casos, resultados reales.</h2>
        <ol className="work__list">
          {CASES.map(c => (
            <li key={c.id} className="work__item">
              <a className="work__link" onClick={()=>onOpenCase(c)}>
                <span className="work__num">{c.num}</span>
                <div className="work__info">
                  <h3 className="work__name">{c.name}</h3>
                  <p className="work__meta">{c.meta}</p>
                </div>
                <span className="work__metric">{c.metric}</span>
                <span className="work__arrow">→</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="work__footer"><a className="btn btn--outline">Ver todos los proyectos →</a></div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {tag:'Estrategia', name:'Program Sprint', desc:'Diagnóstico, diseño y hoja de ruta de un programa de innovación. Desde cero o como rescate de iniciativas estancadas.', deliv:['Diagnóstico y mapa de stakeholders','Diseño del programa con KPIs','Playbook operativo y calendario'], time:'4–6 semanas'},
    {tag:'Operación', name:'Digital Ops Setup', desc:'Implementación de sistemas digitales: CRM, automatizaciones, dashboards y flujos de trabajo para equipos de innovación.', deliv:['Mapeo de procesos actuales','Setup de herramientas y automatizaciones','Capacitación del equipo'], time:'6–8 semanas'},
    {tag:'Ecosistemas', name:'Ecosystem Playbook', desc:'Diseño y operación de programas de aceleración, comunidades de innovación o alianzas estratégicas en LATAM.', deliv:['Mapeo de actores del ecosistema','Modelo de programa y convocatoria','Sistema de seguimiento y métricas'], time:'8–12 semanas'}
  ];
  return (
    <section className="services" id="servicios">
      <div className="bg-pattern"></div>
      <div className="container section-content">
        <p className="section-label">Servicios</p>
        <h2 className="section-title">Lo que construyo contigo.</h2>
        <div className="services__grid">
          {services.map(s => (
            <article key={s.name} className="svc-card">
              <p className="svc-card__tag mono">{s.tag}</p>
              <h3 className="svc-card__name">{s.name}</h3>
              <p className="svc-card__desc">{s.desc}</p>
              <ul className="svc-card__deliv">{s.deliv.map(d => <li key={d}>{d}</li>)}</ul>
              <p className="svc-card__time">{s.time}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const tools = ['Notion','Airtable','HubSpot','Make / Zapier','Figma','Google Workspace','Miro','Slack'];
  const how = ['Diagnóstico antes de soluciones','Playbook desde el día 1','KPIs acordados con stakeholders','Revisiones semanales de métricas','Entregables documentados'];
  return (
    <section className="about" id="about">
      <div className="bg-pattern"></div>
      <div className="container section-content">
        <div className="about__inner">
          <div>
            <p className="section-label">About</p>
            <h2 className="section-title">PM operativo.<br/>Sistemas que funcionan.</h2>
            <p className="about__bio">Soy Strategic Program &amp; Innovation Manager. Diseño y opero programas de innovación, emprendimiento y transformación digital en LATAM. Convierto objetivos ambiciosos en sistemas ejecutables con cadencia, stakeholders claros y métricas.</p>
            <p className="about__bio">Trabajo con playbooks, no con supuestos. Cada programa que opero tiene KPIs definidos, cadencia de revisión y un sistema que puede funcionar sin mí cuando termino.</p>
          </div>
          <div className="about__data">
            <div>
              <p className="section-label">Herramientas</p>
              <div className="about__chips">{tools.map(t => <span key={t} className="chip">{t}</span>)}</div>
            </div>
            <div>
              <p className="section-label">Cómo trabajo</p>
              <ul className="about__how">{how.map(h => <li key={h}>{h}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({onCTA}) {
  return (
    <section className="contact" id="contacto">
      <div className="bg-pattern"></div>
      <div className="container section-content">
        <p className="section-label">Contacto</p>
        <h2 className="section-title">Hagamos que las cosas pasen.</h2>
        <div className="contact__grid">
          <div className="contact__card">
            <p className="mono">Calendario</p>
            <h3>Agendar diagnóstico</h3>
            <p>30 minutos para entender el contexto y definir si encajamos.</p>
            <a className="btn btn--ember" onClick={()=>onCTA('book')}>Agendar →</a>
          </div>
          <div className="contact__card">
            <p className="mono">Email</p>
            <h3>dm@diegomaury.mx</h3>
            <p>Para propuestas, colaboraciones y todo lo demás.</p>
            <a className="btn btn--outline" onClick={()=>onCTA('email')}>Escribir →</a>
          </div>
          <div className="contact__card">
            <p className="mono">LinkedIn</p>
            <h3>/in/diegomaury</h3>
            <p>Conexiones profesionales y publicaciones.</p>
            <a className="btn btn--outline" onClick={()=>onCTA('linkedin')}>Ver perfil →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bar"></div>
      <div className="container footer__inner">
        <span className="footer__tagline">Hagamos que las cosas pasen</span>
        <span className="footer__copy">© 2026 Diego Maury · CDMX</span>
      </div>
    </footer>
  );
}

function CaseModal({ caseData, onClose }) {
  if (!caseData) return null;
  return (
    <div className={`case-overlay ${caseData?'is-open':''}`}>
      <button className="case__close" onClick={onClose}>← Cerrar</button>
      <div className="case">
        <p className="mono case__industry">{caseData.industry}</p>
        <h2 className="case__title">{caseData.name}</h2>
        <div className="case__hero-metric">{caseData.metric}</div>
        <div className="case__hero-meta">{caseData.heroMeta}</div>
        <h4>Contexto</h4><p>{caseData.ctx}</p>
        <h4>Problema</h4><p>{caseData.problem}</p>
        <h4>Mi rol</h4><p>{caseData.role}</p>
        <h4>Acciones</h4><ul>{caseData.actions.map(a => <li key={a}>{a}</li>)}</ul>
        <h4>Resultados</h4><ul>{caseData.results.map(r => <li key={r}>{r}</li>)}</ul>
        <h4>Aprendizajes</h4><ul>{caseData.learn.map(l => <li key={l}>{l}</li>)}</ul>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState('hero');
  const [caseOpen, setCaseOpen] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = (id) => { setActive(id); document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'}); };
  const cta = (kind) => { setToast({cv:'CV descargado (demo)', call:'Llamada agendada (demo)', book:'Diagnóstico agendado (demo)', email:'Email copiado (demo)', linkedin:'Abriendo LinkedIn (demo)'}[kind]); setTimeout(()=>setToast(''), 1800); };
  return (
    <div data-screen-label="Portfolio Home">
      <Nav active={active} onNavigate={navigate}/>
      <Hero onCTA={cta}/>
      <WorkSection onOpenCase={setCaseOpen}/>
      <Services/>
      <About/>
      <Contact onCTA={cta}/>
      <Footer/>
      <CaseModal caseData={caseOpen} onClose={()=>setCaseOpen(null)}/>
      {toast && <div style={{position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#FF5C39', color:'white', padding:'10px 18px', borderRadius:8, fontFamily:'JetBrains Mono', fontSize:12, letterSpacing:'0.10em', textTransform:'uppercase', zIndex:300, boxShadow:'0 8px 24px rgba(255,92,57,0.25)'}}>{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
