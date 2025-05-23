---
layout: default
title: Domain 2 - Application & Interface Security
domain: "Application & Interface Security"
summary_path: "/domains/domain2-summary"
previous_domain_path: "/domains/domain1-summary"
---

# Domain: Audit & Assurance

{% assign questions = site.data.questions | where: "domain", page.domain %}
{% assign total = questions | size %}

<!-- Progress Bar and Step -->
<div style="margin-bottom: 2em;">
  <label for="progress-bar">Progress:</label>
  <div style="background: #e9ecef; border-radius: 6px; width: 100%; height: 20px;">
    <div id="progress-bar" style="background: #007bff; height: 20px; width: 0%; border-radius: 6px; transition: width 0.3s;"></div>
  </div>
  <span id="progress-text" style="font-size: 0.95em; color: #555;"></span>
</div>

<div id="questions-container">
{% for q in questions %}
  <div class="question-block" data-qidx="{{ forloop.index }}" data-domain="{{ q.domain }}" style="display:none;">
    {% include question.html
      id=q.id
      ccm_id=q.ccm_id
      domain=q.domain
      text=q.text
      spec=q.spec
      storage_key=q.storage_key
      qnum=forloop.index
      total=total
    %}
    <div style="display: flex; justify-content: space-between; max-width: 700px; margin: 0 auto 2em auto;">
      <a href="?q={{ forloop.index | minus: 1 }}" class="btn btn-secondary nav-btn nav-prev">← Previous</a>
      {% if forloop.last %}
        <a href="{{ page.summary_path | relative_url }}" class="btn btn-primary nav-btn nav-next">Review &rarr;</a>
      {% else %}
        <a href="?q={{ forloop.index | plus: 1 }}" class="btn btn-primary nav-btn nav-next">Next →</a>
      {% endif %}
    </div>
  </div>
{% endfor %}
</div>

<!-- Toast Notification -->
<div id="toast-saved" style="display:none; position:fixed; z-index:9999; right:24px; bottom:24px; background:#28a745; color:#fff; padding:0.9em 1.5em; border-radius:8px; font-weight:bold; box-shadow:0 2px 8px rgba(0,0,0,0.12); font-size:1.1em; transition:opacity 0.3s;">Saved!</div>

<!-- Quill.js CDN -->
<link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
<script>
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return parseInt(url.searchParams.get(name) || '1', 10);
}

function showQuestion(qidx, total) {
  // Hide all
  document.querySelectorAll('.question-block').forEach(q => q.style.display = 'none');
  // Show current
  const current = document.querySelector('.question-block[data-qidx="' + qidx + '"]');
  if (current) current.style.display = '';
  // Update progress
  document.getElementById('progress-bar').style.width = ((qidx / total) * 100) + '%';
  document.getElementById('progress-text').textContent = `Question ${qidx} of ${total}`;
  // Disable/enable nav
  if (current) {
    const prev = current.querySelector('.nav-prev');
    const next = current.querySelector('.nav-next');
    if (qidx <= 1) {
      prev.href = "{{ page.previous_domain_path | relative_url }}";
    } else {
      prev.href = "?q={{ forloop.index | minus: 1 }}";
    }
    if (qidx >= total) {
        // The link is already set in Liquid, no JS needed to change href
    } else {
        next.style.pointerEvents = '', next.style.opacity = 1;
    }
  }
}

function initQuillAndSaving(qidx) {
  const block = document.querySelector('.question-block[data-qidx="' + qidx + '"]');
  if (!block) return;
  const storageKey = block.querySelector('.caiq-answer').id.replace('caiq-answer-', '');
  const answerSel = block.querySelector('.caiq-answer');
  const ownerSel = block.querySelector('.ssrm-ownership');
  const cspDiv = block.querySelector('.csp-impl-desc');
  const cscDiv = block.querySelector('.csc-resp');
  const quillCSP = new Quill(cspDiv, {
    theme: 'bubble',
    placeholder: 'Describe the implementation...',
    modules: { toolbar: [ ['bold', 'italic', 'underline'], ['link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }] ] }
  });
  const quillCSC = new Quill(cscDiv, {
    theme: 'bubble',
    placeholder: 'Describe the responsibilities...',
    modules: { toolbar: [ ['bold', 'italic', 'underline'], ['link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }] ] }
  });
  function saveAnswers() {
    const data = {
      caiqAnswer: answerSel.value,
      ssrmOwnership: ownerSel.value,
      cspImpl: quillCSP.root.innerHTML,
      cscResp: quillCSC.root.innerHTML
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    showToast();
  }
  function loadAnswers() {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (data.caiqAnswer) answerSel.value = data.caiqAnswer;
    if (data.ssrmOwnership) ownerSel.value = data.ssrmOwnership;
    if (data.cspImpl) quillCSP.root.innerHTML = data.cspImpl;
    if (data.cscResp) quillCSC.root.innerHTML = data.cscResp;
  }
  function showToast() {
    const toast = document.getElementById('toast-saved');
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 1200);
  }
  // Add event listeners for saving
  answerSel.addEventListener('change', saveAnswers);
  ownerSel.addEventListener('change', saveAnswers);
  quillCSP.root.addEventListener('blur', saveAnswers);
  quillCSC.root.addEventListener('blur', saveAnswers);

  // Load answers on init
  loadAnswers();

  // Collapsible details section
  const toggleBtn = block.querySelector('.toggle-details');
  const detailsSection = block.querySelector('.details-section');
  toggleBtn.addEventListener('click', function() {
    if (detailsSection.style.display === 'none') {
      detailsSection.style.display = 'block';
      toggleBtn.textContent = 'Hide Details ▲';
    } else {
      detailsSection.style.display = 'none';
      toggleBtn.textContent = 'Show Details ▼';
    }
  });
}

// On page load
(function() {
  const total = {{ total }};
  let qidx = getQueryParam('q');
  if (isNaN(qidx) || qidx < 1) qidx = 1;
  if (qidx > total) qidx = total;

  showQuestion(qidx, total);
  initQuillAndSaving(qidx);

  // Add click listeners for navigation
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      const isNextButton = button.classList.contains('nav-next');
      const currentQidx = getQueryParam('q');
      const total = {{ total }};
      const isLastQuestion = currentQidx >= total;

      if (isNextButton && isLastQuestion) {
        // Allow default navigation to summary page
      } else {
        event.preventDefault();
        let nextQidx;
        if (isNextButton) {
          nextQidx = currentQidx + 1;
        } else {
          nextQidx = currentQidx - 1;
        }
        if (nextQidx >= 1 && nextQidx <= total) {
          const newUrl = `${window.location.pathname}?q=${nextQidx}`;
          history.pushState(null, '', newUrl);
          showQuestion(nextQidx, total);
          initQuillAndSaving(nextQidx);
        }
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    const total = {{ total }};
    let qidx = getQueryParam('q');
    if (isNaN(qidx) || qidx < 1) qidx = 1;
    if (qidx > total) qidx = total;
    showQuestion(qidx, total);
    initQuillAndSaving(qidx);
  });

})();
</script> 