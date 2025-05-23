---
layout: default
# Look up domain data from _data/domains.yml
{% assign current_domain = site.data.domains | where: "slug", page.slug | first %}
{% assign previous_domain_order = current_domain.order | minus: 1 %}
{% assign previous_domain = site.data.domains | where: "order", previous_domain_order | first %}

title: "Domain {{ current_domain.order }} - {{ current_domain.name }}"
domain: "{{ current_domain.name }}"
slug: "cryptography-encryption-and-key-management" # Keep slug for lookup
summary_path: "{{ site.data.domains | where: 'slug', page.slug | first | property: 'summary_page' | relative_url }}"
{% if previous_domain %}
previous_domain_path: "{% assign current_order = site.data.domains | where: 'slug', page.slug | first | property: 'order' %}{% assign previous_order = current_order | minus: 1 %}{% assign previous_domain = site.data.domains | where: 'order', previous_order | first %}{% if previous_domain %}{{ previous_domain.question_page | relative_url }}{% else %}/{% endif %}"
{% else %}
# No previous_domain_path for the first domain
{% endif %}
next_domain_path: "{% assign current_order = site.data.domains | where: 'slug', page.slug | first | property: 'order' %}{% assign next_order = current_order | plus: 1 %}{% assign next_domain = site.data.domains | where: 'order', next_order | first %}{% if next_domain %}{{ next_domain.question_page | relative_url }}{% endif %}"
---

# Domain: {{ page.domain }}

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
      {% comment %}
        The href is set in Liquid but controlled by JS to either go to the previous question or the previous domain summary.
        JS modifies this href on load and when navigating between questions within the domain.
      {% endcomment %}
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
    const prev = current.querySelector('.nav-btn.nav-prev'); // Use class to select
    const next = current.querySelector('.nav-btn.nav-next'); // Use class to select

    // Logic for the 'Previous' button
    if (qidx <= 1) {
      // If it's the first question, the previous button should go to the previous domain summary.
      // The href is already set in Liquid using page.previous_domain_path.
      // Add a class or style to indicate it's the previous domain link if needed
    } else {
      // Otherwise, it goes to the previous question within the domain.
      // The href is already set in Liquid.
    }

    // Logic for the 'Next' button
    if (qidx >= total) {
        // The last next button should navigate to the summary, its href is already set in Liquid.
        // No JS needed to change href or disable it.
    } else {
        // For other questions, the next button navigates to the next question.
        // Its href is already set in Liquid.
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
  // Check if Quill instances already exist for this block to prevent re-initialization
  if (cspDiv && !cspDiv.classList.contains('quill-initialized')) {
    const quillCSP = new Quill(cspDiv, {
      theme: 'bubble',
      placeholder: 'Describe the implementation...',
      modules: { toolbar: [ ['bold', 'italic', 'underline'], ['link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }] ] }
    });
    cspDiv.classList.add('quill-initialized');
    quillCSP.on('text-change', function() {
      saveQuillContent(storageKey, quillCSP.root.innerHTML, 'cspImpl', false);
    });
  }
   if (cscDiv && !cscDiv.classList.contains('quill-initialized')) {
    const quillCSC = new Quill(cscDiv, {
      theme: 'bubble',
      placeholder: 'Describe the responsibilities...',
      modules: { toolbar: [ ['bold', 'italic', 'underline'], ['link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }] ] }
    });
    cscDiv.classList.add('quill-initialized');
    quillCSC.on('text-change', function() {
      saveQuillContent(storageKey, quillCSC.root.innerHTML, 'cscResp', false);
    });
   }

  function saveAnswer(key, value) {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    data.caiqAnswer = value;
    localStorage.setItem(key, JSON.stringify(data));
    showToast();
  }

   function saveOwnership(key, value) {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    data.ssrmOwnership = value;
    localStorage.setItem(key, JSON.stringify(data));
    showToast();
  }

   function saveQuillContent(key, value, type, showNotification = false) {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    if (type === 'cspImpl') data.cspImpl = value;
    if (type === 'cscResp') data.cscResp = value;
    localStorage.setItem(key, JSON.stringify(data));
    if (showNotification) {
      showToast(); // Only show toast notification when explicitly requested
    }
  }


  function loadAnswers() {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (data.caiqAnswer && answerSel) answerSel.value = data.caiqAnswer;
    if (data.ssrmOwnership && ownerSel) ownerSel.value = data.ssrmOwnership;
    // Load Quill content only if editors exist and are initialized
    const quillCSP = Quill.find(cspDiv); // Find Quill instance if exists
    if (data.cspImpl && quillCSP) quillCSP.root.innerHTML = data.cspImpl;
    const quillCSC = Quill.find(cscDiv); // Find Quill instance if exists
    if (data.cscResp && quillCSC) quillCSC.root.innerHTML = data.cscResp;
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
  if (answerSel) answerSel.addEventListener('change', () => saveAnswer(storageKey, answerSel.value));
  if (ownerSel) ownerSel.addEventListener('change', () => saveOwnership(storageKey, ownerSel.value));
  if (cspDiv) {
    const quillCSP = Quill.find(cspDiv); // Find Quill instance
    if (quillCSP) quillCSP.root.addEventListener('blur', () => saveQuillContent(storageKey, quillCSP.root.innerHTML, 'cspImpl', true));
  }
  if (cscDiv) {
    const quillCSC = Quill.find(cscDiv); // Find Quill instance
    if (quillCSC) quillCSC.root.addEventListener('blur', () => saveQuillContent(storageKey, quillCSC.root.innerHTML, 'cscResp', true));
  }

  // Load answers on init
  loadAnswers();

  // Collapsible details section
  const toggleBtn = block.querySelector('.toggle-details');
  const detailsSection = block.querySelector('.details-section');
  if (toggleBtn && detailsSection) {
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
        // Allow default navigation to summary page (href set in Liquid)
      } else if (!isNextButton && currentQidx === 1) {
         // Allow default navigation to previous domain summary page (href set in Liquid)
      } else {
        event.preventDefault();
        let nextQidx;
        if (isNextButton) {
          nextQidx = currentQidx + 1;
        } else {
          nextQidx = currentQidx - 1;
        }
        // Ensure we don't go below 1 or above total questions within the domain navigation
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