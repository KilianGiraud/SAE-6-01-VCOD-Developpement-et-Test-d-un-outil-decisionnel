class FormationCompetencesForm extends HTMLElement {
    constructor() {
        super();
        this.formData = {
            langues: {
                francais: false,
                anglais: false,
                italien: false,
                espagnol: false,
                allemand: false,
                autres: ''
            },
            diplomes: '',
            documentsProvidedDiplomes: false,
            experienceProfessionnelle: ''
        };
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/formation-competences/formation-competences.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/formation-competences/formation-competences.css';
        document.head.appendChild(styleSheet);

        this.innerHTML = template;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Gestion des langues
        const langueCheckboxes = this.querySelectorAll('input[type="checkbox"][name^="langue"]');
        langueCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const langue = e.target.name.replace('langue_', '');
                this.formData.langues[langue] = e.target.checked;
                this.validateLangues();
            });
        });

        // Gestion des autres langues
        const autresLanguesInput = this.querySelector('input[name="autres_langues"]');
        if (autresLanguesInput) {
            autresLanguesInput.addEventListener('input', (e) => {
                this.formData.langues.autres = e.target.value;
            });
        }

        // Gestion des diplômes
        const diplomesTextarea = this.querySelector('textarea[name="diplomes"]');
        if (diplomesTextarea) {
            diplomesTextarea.addEventListener('input', (e) => {
                this.formData.diplomes = e.target.value;
                this.validateField('diplomes', e.target.value);
            });
        }

        // Gestion du checkbox documents fournis pour les diplômes
        const documentsCheckbox = this.querySelector('input[name="documents_provided_diplomes"]');
        if (documentsCheckbox) {
            documentsCheckbox.addEventListener('change', (e) => {
                this.formData.documentsProvidedDiplomes = e.target.checked;
            });
        }

        // Gestion de l'expérience professionnelle
        const experienceTextarea = this.querySelector('textarea[name="experience_professionnelle"]');
        if (experienceTextarea) {
            experienceTextarea.addEventListener('input', (e) => {
                this.formData.experienceProfessionnelle = e.target.value;
                this.validateField('experience_professionnelle', e.target.value);
            });
        }
    }

    validateLangues() {
        const errorElement = this.querySelector('[data-error="langues"]');
        const hasSelectedLanguage = Object.values(this.formData.langues).some(value => 
            value === true || (typeof value === 'string' && value.trim() !== ''));
        
        if (errorElement) {
            errorElement.textContent = hasSelectedLanguage ? '' : 'Veuillez sélectionner au moins une langue';
            errorElement.style.display = hasSelectedLanguage ? 'none' : 'block';
        }
        
        return hasSelectedLanguage;
    }

    validateField(field, value) {
        const errorElement = this.querySelector(`[data-error="${field}"]`);
        let errorMessage = '';

        if (!value.trim()) {
            errorMessage = 'Ce champ est requis';
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = errorMessage ? 'block' : 'none';
        }

        return !errorMessage;
    }

    getData() {
        return { ...this.formData };
    }

    setData(data) {
        this.formData = { ...this.formData, ...data };
        
        // Mise à jour des checkboxes des langues
        Object.entries(data.langues || {}).forEach(([langue, value]) => {
            const checkbox = this.querySelector(`input[name="langue_${langue}"]`);
            if (checkbox) {
                checkbox.checked = value;
            }
        });

        // Mise à jour des autres champs
        const diplomesTextarea = this.querySelector('textarea[name="diplomes"]');
        if (diplomesTextarea && data.diplomes) {
            diplomesTextarea.value = data.diplomes;
        }

        const documentsCheckbox = this.querySelector('input[name="documents_provided_diplomes"]');
        if (documentsCheckbox && data.documentsProvidedDiplomes !== undefined) {
            documentsCheckbox.checked = data.documentsProvidedDiplomes;
        }

        const experienceTextarea = this.querySelector('textarea[name="experience_professionnelle"]');
        if (experienceTextarea && data.experienceProfessionnelle) {
            experienceTextarea.value = data.experienceProfessionnelle;
        }
    }

    isValid() {
        // Vérification des langues
        const languesValid = this.validateLangues();
        
        // Vérification des diplômes
        const diplomesValid = this.validateField('diplomes', this.formData.diplomes);
        
        // Vérification de l'expérience professionnelle
        const experienceValid = this.validateField('experience_professionnelle', this.formData.experienceProfessionnelle);
        
        console.log('Formation et compétences - validation:', {
            languesValid,
            diplomesValid,
            experienceValid,
            formData: this.formData
        });
        
        return languesValid && diplomesValid && experienceValid;
    }
}

customElements.define('formation-competences-form', FormationCompetencesForm); 