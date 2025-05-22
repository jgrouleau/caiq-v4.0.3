---
layout: questionnaire
title: Domain 1 - Information Security
---

# Domain 1: Information Security

## Application & Interface Security

<div class="question-section">
    <h3>AIS-01: Application Security</h3>
    <div class="question">
        <p><strong>Question:</strong> Do you have a formal application security program that includes:</p>
        <ul>
            <li>Application security requirements</li>
            <li>Secure coding practices</li>
            <li>Application security testing</li>
            <li>Application security monitoring</li>
        </ul>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-01" id="AIS-01-yes" value="yes">
            <label class="form-check-label" for="AIS-01-yes">Yes</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-01" id="AIS-01-no" value="no">
            <label class="form-check-label" for="AIS-01-no">No</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-01" id="AIS-01-na" value="na">
            <label class="form-check-label" for="AIS-01-na">Not Applicable</label>
        </div>
    </div>

    <div class="question">
        <p><strong>Question:</strong> Do you have a formal process for testing and validating the security of your applications?</p>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-02" id="AIS-02-yes" value="yes">
            <label class="form-check-label" for="AIS-02-yes">Yes</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-02" id="AIS-02-no" value="no">
            <label class="form-check-label" for="AIS-02-no">No</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="AIS-02" id="AIS-02-na" value="na">
            <label class="form-check-label" for="AIS-02-na">Not Applicable</label>
        </div>
    </div>
</div>

<div class="navigation-buttons">
    <button class="btn btn-primary" onclick="saveProgress()">Save Progress</button>
    <a href="/domains/domain1/audit-assurance" class="btn btn-secondary">Next Section</a>
</div>

<script>
function saveProgress() {
    // Get all radio inputs
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    const answers = {};
    
    inputs.forEach(input => {
        answers[input.name] = input.value;
    });
    
    // Save to localStorage
    localStorage.setItem('domain1_answers', JSON.stringify(answers));
    
    // Update progress bar
    const totalQuestions = document.querySelectorAll('.question').length;
    const answeredQuestions = Object.keys(answers).length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}
</script> 