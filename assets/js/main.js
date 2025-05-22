// Load saved answers when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedAnswers();
    updateProgressBar();
});

// Load saved answers from localStorage
function loadSavedAnswers() {
    const domain = window.location.pathname.split('/')[2]; // Get domain from URL
    const savedAnswers = localStorage.getItem(`${domain}_answers`);
    
    if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        Object.keys(answers).forEach(questionId => {
            const radio = document.querySelector(`input[name="${questionId}"][value="${answers[questionId]}"]`);
            if (radio) {
                radio.checked = true;
            }
        });
    }
}

// Update progress bar
function updateProgressBar() {
    const totalQuestions = document.querySelectorAll('.question').length;
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
}

// Save progress
function saveProgress() {
    const domain = window.location.pathname.split('/')[2];
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    const answers = {};
    
    inputs.forEach(input => {
        answers[input.name] = input.value;
    });
    
    localStorage.setItem(`${domain}_answers`, JSON.stringify(answers));
    updateProgressBar();
    
    // Show save confirmation
    const saveButton = document.querySelector('button[onclick="saveProgress()"]');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    setTimeout(() => {
        saveButton.textContent = originalText;
    }, 2000);
}

// Export answers as PDF
function exportAsPDF() {
    // This is a placeholder for PDF export functionality
    // You would typically use a library like jsPDF here
    alert('PDF export functionality will be implemented in a future version.');
}

// Add event listeners to radio buttons
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        updateProgressBar();
    });
}); 