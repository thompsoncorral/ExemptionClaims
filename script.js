// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.parentElement;
    var open = item.classList.toggle('open');
    btn.querySelector('.icon').textContent = open ? '×' : '+';
  });
});

// Hypothetical draft risk calculator
var form = document.getElementById('riskForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value; };
    var age = v('age'), gender = v('gender'), cit = v('citizenship'),
        student = v('student'), health = v('health'), reg = v('registered');

    var score = 50;
    var notes = [];

    // Age
    if (age === 'under18') { score -= 35; notes.push('You are under 18 — too young to be called.'); }
    else if (age === '18-20') { score += 25; notes.push('Ages 18–20 would be among the first called in a lottery.'); }
    else if (age === '21-25') { score += 15; notes.push('Ages 21–25 are within the prime draft window.'); }
    else if (age === '26-35') { score -= 30; notes.push('26 and older is past the standard registration window.'); }
    else if (age === '36plus') { score -= 45; notes.push('36 and older is well outside the draft age range.'); }

    // Gender
    if (gender === 'male') { score += 10; notes.push('Men are currently required to register.'); }
    else if (gender === 'female') { score -= 25; notes.push('Women are not currently required to register.'); }

    // Citizenship
    if (cit === 'visa') { score -= 30; notes.push('Most temporary visa holders are not required to register.'); }
    else if (cit === 'citizen' || cit === 'dual' || cit === 'resident') { score += 5; }

    // Student
    if (student === 'highschool') { score -= 10; notes.push('High school students can postpone until graduation or age 20.'); }
    else if (student === 'college' || student === 'grad') { score -= 3; notes.push('College students can only postpone until the end of the current semester.'); }
    else if (student === 'divinity') { score -= 25; notes.push('Divinity students may qualify for a deferment.'); }

    // Health
    if (health === 'minor') { score -= 5; }
    else if (health === 'serious') { score -= 20; notes.push('A serious condition could disqualify you at MEPS.'); }
    else if (health === 'disability') { score -= 35; notes.push('A permanent disability would likely disqualify you.'); }

    // Registered
    if (reg === 'no') { notes.push('Not registering can cost you federal student aid, federal jobs, and more.'); }
    else if (reg === 'unsure') { notes.push('You can check your registration status at sss.gov.'); }

    score = Math.max(0, Math.min(100, score));
    var level, cls;
    if (score >= 65) { level = 'High'; cls = 'high'; }
    else if (score >= 35) { level = 'Medium'; cls = 'medium'; }
    else { level = 'Low'; cls = 'low'; }

    var html = '<p class="level ' + cls + '">Draft Risk: ' + level + '</p>';
    if (notes.length) {
      html += '<ul>' + notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
    }
    html += '<p class="fine">Hypothetical estimate for fun and education only. There is no active draft.</p>';

    var box = document.getElementById('result');
    box.innerHTML = html;
    box.classList.add('show');
  });
}
