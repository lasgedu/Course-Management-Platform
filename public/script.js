// Translation dictionary
const translations = {
    en: {
        title: "Student Course Reflection",
        greeting: "Welcome to your reflection page! Please share your thoughts about the course.",
        questions: [
            "What did you enjoy most about the course?",
            "What was the most challenging part?",
            "What could be improved?"
        ],
        submit: "Submit Reflection",
        success: "Thank you for your reflection!",
        footer: "© 2024 Course Management Platform. All rights reserved.",
        requiredField: "Please fill in all fields"
    },
    fr: {
        title: "Réflexion Étudiante sur le Cours",
        greeting: "Bienvenue sur votre page de réflexion! Veuillez partager vos impressions sur le cours.",
        questions: [
            "Qu'avez-vous le plus apprécié dans ce cours?",
            "Quelle a été la partie la plus difficile?",
            "Qu'est-ce qui pourrait être amélioré?"
        ],
        submit: "Soumettre la Réflexion",
        success: "Merci pour votre réflexion!",
        footer: "© 2024 Plateforme de Gestion des Cours. Tous droits réservés.",
        requiredField: "Veuillez remplir tous les champs"
    },
    es: {
        title: "Reflexión del Estudiante sobre el Curso",
        greeting: "¡Bienvenido a tu página de reflexión! Por favor comparte tus pensamientos sobre el curso.",
        questions: [
            "¿Qué fue lo que más disfrutaste del curso?",
            "¿Cuál fue la parte más desafiante?",
            "¿Qué podría mejorarse?"
        ],
        submit: "Enviar Reflexión",
        success: "¡Gracias por tu reflexión!",
        footer: "© 2024 Plataforma de Gestión de Cursos. Todos los derechos reservados.",
        requiredField: "Por favor complete todos los campos"
    }
};

// Current language (default to English or browser language)
let currentLanguage = localStorage.getItem('preferredLanguage') || detectBrowserLanguage() || 'en';

// Detect browser language
function detectBrowserLanguage() {
    const browserLang = navigator.language.substring(0, 2);
    return translations[browserLang] ? browserLang : 'en';
}

// Update page content with current language
function updateContent() {
    const trans = translations[currentLanguage];
    
    document.getElementById('page-title').textContent = trans.title;
    document.getElementById('greeting').textContent = trans.greeting;
    document.getElementById('question-1').textContent = trans.questions[0];
    document.getElementById('question-2').textContent = trans.questions[1];
    document.getElementById('question-3').textContent = trans.questions[2];
    document.getElementById('submit-btn').textContent = trans.submit;
    document.getElementById('success-text').textContent = trans.success;
    document.getElementById('footer-text').textContent = trans.footer;
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// Language switcher event listeners
document.querySelectorAll('.lang-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        currentLanguage = e.target.dataset.lang;
        localStorage.setItem('preferredLanguage', currentLanguage);
        updateContent();
    });
});

// Form submission
document.getElementById('reflection-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const answer1 = document.getElementById('answer-1').value.trim();
    const answer2 = document.getElementById('answer-2').value.trim();
    const answer3 = document.getElementById('answer-3').value.trim();
    
    // Validate
    if (!answer1 || !answer2 || !answer3) {
        alert(translations[currentLanguage].requiredField);
        return;
    }
    
    // Store reflection in localStorage (in a real app, this would be sent to the server)
    const reflection = {
        answer1,
        answer2,
        answer3,
        language: currentLanguage,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    reflections.push(reflection);
    localStorage.setItem('reflections', JSON.stringify(reflections));
    
    // Show success message
    document.getElementById('success-message').classList.remove('hidden');
    
    // Reset form
    document.getElementById('reflection-form').reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        document.getElementById('success-message').classList.add('hidden');
    }, 5000);
    
    // Log for demonstration
    console.log('Reflection submitted:', reflection);
});

// Initialize page content
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
});