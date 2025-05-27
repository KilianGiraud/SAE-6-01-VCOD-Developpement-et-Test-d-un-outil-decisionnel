class AdministrativeInfoForm extends HTMLElement {
    constructor() {
        super();
        this.formData = {
            numeroMatricule: '',
            rib: '',
            mutuelle: '',
            permisConduire: '',
            documentsIdentite: '',
            autorisationTravail: ''
        };
    }

    static get FIELD_NAMES() {
        return {
            NUMERO_MATRICULE: 'numeroMatricule',
            RIB: 'rib',
            MUTUELLE: 'mutuelle',
            PERMIS_CONDUIRE: 'permisConduire',
            DOCUMENTS_IDENTITE: 'documentsIdentite',
            AUTORISATION_TRAVAIL: 'autorisationTravail'
        };
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/administrative-info/administrative-info.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/administrative-info/administrative-info.css';
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

        // Gestion spéciale pour l'autorisation de travail
        const documentsIdentiteSelect = this.querySelector('#documentsIdentite');
        const autorisationTravailGroup = this.querySelector('#autorisationTravail').closest('.form-group');
        
        documentsIdentiteSelect.addEventListener('change', (e) => {
            if (e.target.value === 'TitreSejour') {
                autorisationTravailGroup.style.display = 'block';
                this.querySelector('#autorisationTravail').required = true;
            } else {
                autorisationTravailGroup.style.display = 'none';
                this.querySelector('#autorisationTravail').required = false;
                this.querySelector('#autorisationTravail').value = '';
                this.formData.autorisationTravail = '';
            }
        });
    }

    validateField(field, value) {
        const errorElement = this.querySelector(`[data-error="${field}"]`);
        let errorMessage = '';

        switch (field) {
            case AdministrativeInfoForm.FIELD_NAMES.RIB:
                if (!value.match(/[0-9]{5,34}/)) {
                    errorMessage = 'Le RIB doit contenir entre 5 et 34 chiffres';
                }
                break;
            case AdministrativeInfoForm.FIELD_NAMES.MUTUELLE:
                if (!value) {
                    errorMessage = 'Veuillez sélectionner une option pour la mutuelle';
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
        return Object.keys(this.formData).every(field => {
            const input = this.querySelector(`[name="${field}"]`);
            return input && (!input.hasAttribute('required') || input.checkValidity());
        });
    }
}

customElements.define('administrative-info-form', AdministrativeInfoForm); 