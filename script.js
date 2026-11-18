// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.parentElement;
    var open = item.classList.toggle('open');
    btn.querySelector('.icon').textContent = open ? '×' : '+';
  });
});

// Hero banner rotation: 5 slides, auto-advance every 10s, dots clickable
(function () {
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.dots button');
  if (!slides.length) return;
  var current = 0;
  var timer;

  function showSlide(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    slides[i].classList.add('active');
    dots[i].classList.add('active');
    current = i;
  }
  function start() {
    timer = setInterval(function () { showSlide((current + 1) % slides.length); }, 10000);
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      showSlide(i);
      start();
    });
  });
  start();
})();

// Draft risk calculator
// Based on public Selective Service / MSSA rules: age call order (20 first, then 21-25,
// then 19, then 18), registration applies to men 18-25, deferments and disqualifications
// lower the odds of call-up. This is not a prediction; there is no active draft.
var AGE_CALL_ORDER_WEIGHT = {
  '20': 100, '21': 90, '22': 80, '23': 70, '24': 60, '25': 50,
  '19': 30, '18': 15,
  '17': 0,  // not yet subject to registration
  '26': 0   // aged out of registration requirement
};
var STUDENT_DEFERMENT_MULTIPLIER = { highschool: 0.4, college: 0.7, notstudent: 1.0 };
var HEALTH_MULTIPLIER = { healthy: 1.0, minor: 0.75, major: 0.1 };
var CITIZENSHIP_MULTIPLIER = { citizen: 1.0, immigrant: 1.0, nonresident: 0.0 };

var form = document.getElementById('riskForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value; };
    var age = v('age'), gender = v('gender'), citizenship = v('citizenship'),
        student = v('student'), health = v('health'), registered = v('registered');

    var percent = 0;
    var notes = [];

    if (gender === 'female') {
      notes.push('Women are not currently subject to Selective Service registration under existing federal law.');
    } else if (age === '17' || age === '26') {
      notes.push(age === '17'
        ? 'Registration is not required until 30 days after your 18th birthday.'
        : 'Registration is only required through age 25; you are no longer subject to the requirement.');
    } else if (citizenship === 'nonresident') {
      notes.push('Non-U.S. residents living outside the United States are not subject to U.S. Selective Service registration.');
    } else {
      percent = (AGE_CALL_ORDER_WEIGHT[age] || 0) *
        (STUDENT_DEFERMENT_MULTIPLIER[student] || 1) *
        (HEALTH_MULTIPLIER[health] || 1) *
        (CITIZENSHIP_MULTIPLIER[citizenship] === undefined ? 1 : CITIZENSHIP_MULTIPLIER[citizenship]);
      percent = Math.round(Math.max(0, Math.min(100, percent)));

      if (student === 'highschool') notes.push('High school deferment applies until graduation or age 20.');
      if (student === 'college') notes.push('College deferment applies until the end of the current semester (or academic year for seniors).');
      if (health === 'major') notes.push('Major medical/disability conditions are grounds for disqualification at a MEPS physical.');
      if (health === 'minor') notes.push('Minor conditions may or may not be disqualifying — a MEPS physical would determine this.');
      if (registered === 'no') notes.push('You are required to register if you have not already — failure to register carries federal penalties.');
      if (registered === 'notsure') notes.push('Verify your registration status directly at sss.gov/verify.');
    }

    var level, cls;
    if (percent >= 65) { level = 'High'; cls = 'high'; }
    else if (percent >= 35) { level = 'Medium'; cls = 'medium'; }
    else { level = 'Low'; cls = 'low'; }

    var html = '<p class="level ' + cls + '">Draft Risk: ' + percent + '% (' + level + ')</p>';
    if (notes.length) {
      html += '<ul>' + notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
    }
    html += '<p class="fine">Reflects relative standing under current public Selective Service rules if a draft were ever activated. There is no active draft.</p>';

    var box = document.getElementById('result');
    box.innerHTML = html;
    box.classList.add('show');
  });
}

// Highlight the current page in the top menu
document.querySelectorAll('.mainnav a').forEach(function (a) {
  if (a.pathname === location.pathname && !a.hash) a.classList.add('current');
});
