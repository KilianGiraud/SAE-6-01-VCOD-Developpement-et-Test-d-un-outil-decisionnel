class ProfessionalInfoForm extends HTMLElement {
    constructor() {
        super();
        this.formData = {
            poste: '',
            departement: '',
            manager: '',
            lieuTravail: '',
            typeContrat: '',
            dateEmbauche: '',
            dureeEssai: '',
            statut: '',
            horaires: ''
        };
    }

    static get FIELD_NAMES() {
        return {
            POSTE: 'poste',
            DEPARTEMENT: 'departement',
            MANAGER: 'manager',
            LIEU_TRAVAIL: 'lieuTravail',
            TYPE_CONTRAT: 'typeContrat',
            DATE_EMBAUCHE: 'dateEmbauche',
            DUREE_ESSAI: 'dureeEssai',
            STATUT: 'statut',
            HORAIRES: 'horaires'
        };
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/professional-info/professional-info.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/professional-info/professional-info.css';
        document.head.appendChild(styleSheet);

        this.innerHTML = template;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const inputs = this.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.name;
                this.formData[field] = e.target.value;
                this.validateField(field, e.target.value);
            });
        });
    }

    validateField(field, value) {
        const errorElement = this.querySelector(`[data-error="${field}"]`);
        let errorMessage = '';

        switch (field) {
            case ProfessionalInfoForm.FIELD_NAMES.TYPE_CONTRAT:
                if (!value) {
                    errorMessage = 'Veuillez sélectionner un type de contrat';
                }
                break;
            case ProfessionalInfoForm.FIELD_NAMES.DUREE_ESSAI:
                if (value && (isNaN(value) || value < 0)) {
                    errorMessage = 'La durée doit être un nombre positif';
                }
                break;
            default:
                if (!value.trim() && this.querySelector(`[name="${field}"]`).hasAttribute('required')) {
                    errorMessage = 'Ce champ est requis';
                }
        }

        if (errorMessage) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('visible');
        } else {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }

    getData() {
        return { ...this.formData };
    }

    setData(data) {
        this.formData = { ...this.formData, ...data };
        Object.keys(data).forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (input) {
                input.value = data[field];
                this.validateField(field, data[field]);
            }
        });
    }

    isValid() {
        const validationResults = {};
        
        Object.keys(this.formData).forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            validationResults[field] = {
                exists: !!input,
                required: input ? input.hasAttribute('required') : false,
                valid: input ? (!input.hasAttribute('required') || input.checkValidity()) : false
            };
        });
        
        console.log('Professional info - validation:', validationResults);
        
        return Object.keys(this.formData).every(field => {
            const input = this.querySelector(`[name="${field}"]`);
            return input && (!input.hasAttribute('required') || input.checkValidity());
        });
    }
}

customElements.define('professional-info-form', ProfessionalInfoForm); 