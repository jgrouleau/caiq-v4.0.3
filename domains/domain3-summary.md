---
layout: default
title: Summary - Business Continuity, Management, and Operational Resilience
domain: "Business Continuity, Management, and Operational Resilience"
next_domain_path: "/domains/domain4"
---

# Business Continuity, Management, and Operational Resilience — Review & Edit

{% assign questions = site.data.questions | where: "domain", page.domain %}

<div style="max-width: 700px; margin: 0 auto;">
  <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5em;">
    <a href="{{ page.next_domain_path | relative_url }}" class="btn btn-secondary">Continue to next domain →</a>
  </div>
  <div id="domain3-summary">
    {% for q in questions %}
    <div class="summary-question-block" data-storage-key="{{ q.storage_key }}" style="background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.07);padding:2em 2em 1.5em 2em; margin-bottom: 2em;">
      <div style="font-size:1.1em;font-weight:bold;margin-bottom:0.5em;">{{ q.text }}</div>
      <div style="display:flex;gap:1em;margin-bottom:1.2em;flex-wrap:wrap;">
        <div style="flex:1 1 220px;min-width:220px;">
          <label style="font-weight:bold;" for="caiq-answer-{{ q.storage_key }}">CSP CAIQ Answer:</label><br>
          <select id="caiq-answer-{{ q.storage_key }}" class="caiq-answer" style="width:100%;padding:0.5em;border-radius:4px;border:1px solid #ccc;margin-top:0.2em;">
            <option value="">-- Select --</option>
            <option>Yes</option>
            <option>No</option>
            <option>Not Applicable</option>
          </select>
        </div>
        <div style="flex:1 1 220px;min-width:220px;">
          <label style="font-weight:bold;" for="ssrm-ownership-{{ q.storage_key }}">SSRM Ownership:</label><br>
          <select id="ssrm-ownership-{{ q.storage_key }}" class="ssrm-ownership" style="width:100%;padding:0.5em;border-radius:4px;border:1px solid #ccc;margin-top:0.2em;">
            <option value="">-- Select --</option>
            <option>CSP-owned</option>
            <option>CSC-owned</option>
            <option>3rd-party outsourced</option>
            <option>Shared CSP and CSC</option>
            <option>Shared CSP and 3rd party</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom:1.2em;">
        <label style="font-weight:bold;" for="csp-impl-desc-{{ q.storage_key }}">CSP Implementation Description:</label>
        <div id="csp-impl-desc-{{ q.storage_key }}" class="csp-impl-desc" style="background:#f8f9fa;border:1px solid #ccc;border-radius:4px;min-height:80px;margin-top:0.2em;"></div>
      </div>
      <div style="margin-bottom:1.2em;">
        <label style="font-weight:bold;" for="csc-resp-{{ q.storage_key }}">CSC Responsibilities:</label>
        <div id="csc-resp-{{ q.storage_key }}" class="csc-resp" style="background:#f8f9fa;border:1px solid #ccc;border-radius:4px;min-height:80px;margin-top:0.2em;"></div>
      </div>
    </div>
    {% endfor %}
  </div>

  <div style="display: flex; justify-content: flex-end; margin-top: 2em;">
    <a href="{{ page.next_domain_path | relative_url }}" class="btn btn-primary">Continue to next domain →</a>
  </div>
</div>

<!-- Toast Notification -->
<div id="toast-saved" style="display:none; position:fixed; z-index:9999; right:24px; bottom:24px; background:#28a745; color:#fff; padding:0.9em 1.5em; border-radius:8px; font-weight:bold; box-shadow:0 2px 8px rgba(0,0,0,0.12); font-size:1.1em; transition:opacity 0.3s;">Saved!</div>

<!-- Quill.js CDN -->
<link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
<script>
function showToast() {
  const toast = document.getElementById('toast-saved');
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 1200);
}

function saveAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC) {
  const data = {
    caiqAnswer: answerSel.value,
    ssrmOwnership: ownerSel.value,
    cspImpl: quillCSP.root.innerHTML,
    cscResp: quillCSC.root.innerHTML
  };
  localStorage.setItem(storageKey, JSON.stringify(data));
  showToast();
}

function loadAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC) {
  const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (data.caiqAnswer) answerSel.value = data.caiqAnswer;
  if (data.ssrmOwnership) ownerSel.value = data.ssrmOwnership;
  if (data.cspImpl) quillCSP.root.innerHTML = data.cspImpl;
  if (data.cscResp) quillCSC.root.innerHTML = data.cscResp;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.summary-question-block').forEach(block => {
    const storageKey = block.getAttribute('data-storage-key');
    const answerSel = block.querySelector('.caiq-answer');
    const ownerSel = block.querySelector('.ssrm-ownership');
    const cspDiv = block.querySelector('.csp-impl-desc');
    const cscDiv = block.querySelector('.csc-resp');
    // Initialize Quill editors
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
    // Load saved answers
    loadAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC);
    // Save on change/blur
    answerSel.addEventListener('change', () => saveAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC));
    ownerSel.addEventListener('change', () => saveAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC));
    quillCSP.root.addEventListener('blur', () => saveAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC));
    quillCSC.root.addEventListener('blur', () => saveAnswers(storageKey, answerSel, ownerSel, quillCSP, quillCSC));
  });
});
</script> 