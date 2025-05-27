class EmergencyContactForm extends HTMLElement {
    constructor() {
        super();
        this.formData = {
            materielFournis: [],
            identifiantsAcces: '',
            emailProfessionnel: '',
            carteCantine: '',
            nomContactUrgence: '',
            lienParente: '',
            telephoneContactUrgence: ''
        };
    }

    static get FIELD_NAMES() {
        return {
            MATERIEL_FOURNIS: 'materielFournis',
            IDENTIFIANTS_ACCES: 'identifiantsAcces',
            EMAIL_PROFESSIONNEL: 'emailProfessionnel',
            CARTE_CANTINE: 'carteCantine',
            NOM_CONTACT_URGENCE: 'nomContactUrgence',
            LIEN_PARENTE: 'lienParente',
            TELEPHONE_CONTACT_URGENCE: 'telephoneContactUrgence'
        };
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/emergency-contact/emergency-contact.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/emergency-contact/emergency-contact.css';
        document.head.appendChild(styleSheet);

        this.innerHTML = template;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Gestion des checkboxes pour le matériel fourni
        const checkboxes = this.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.formData.materielFournis.push(e.target.value);
                } else {
                    this.formData.materielFournis = this.formData.materielFournis.filter(item => item !== e.target.value);
                }
            });
        });

        // Gestion des autres champs
        const inputs = this.querySelectorAll('input[type="text"], input[type="tel"], select');
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
            case EmergencyContactForm.FIELD_NAMES.TELEPHONE_CONTACT_URGENCE:
                if (!value.match(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)) {
                    errorMessage = 'Format de téléphone invalide';
                }
                break;
            case EmergencyContactForm.FIELD_NAMES.IDENTIFIANTS_ACCES:
            case EmergencyContactForm.FIELD_NAMES.EMAIL_PROFESSIONNEL:
                if (!value && this.querySelector(`[name="${field}"]`).hasAttribute('required')) {
                    errorMessage = 'Veuillez sélectionner une option';
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
                if (input.type === 'checkbox') {
                    input.checked = this.formData[field].includes(input.value);
                } else {
                    input.value = data[field];
                }
                this.validateField(field, data[field]);
            }
        });
    }

    isValid() {
        const requiredFields = Array.from(this.querySelectorAll('[required]')).map(el => el.name);
        return requiredFields.every(field => {
            const input = this.querySelector(`[name="${field}"]`);
            return input && input.checkValidity();
        });
    }
}

customElements.define('emergency-contact-form', EmergencyContactForm); 