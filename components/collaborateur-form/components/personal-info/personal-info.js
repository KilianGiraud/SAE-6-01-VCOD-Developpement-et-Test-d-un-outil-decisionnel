class PersonalInfoForm extends HTMLElement {
    constructor() {
        super();
        this.formData = {
            nom: '',
            prenom: '',
            dateNaissance: '',
            lieuNaissance: '',
            adresse: '',
            telephone: '',
            email: '',
            situationFamiliale: '',
            age: ''
        };
    }

    static get FIELD_NAMES() {
        return {
            NOM: 'nom',
            PRENOM: 'prenom',
            DATE_NAISSANCE: 'dateNaissance',
            LIEU_NAISSANCE : 'lieuNaissance',
            ADRESSE: 'adresse',
            TELEPHONE: 'telephone',
            EMAIL: 'email',
            SITUATION_FAMILILALE: 'situationFamiliale',
            AGE: 'age'
        };
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/personal-info/personal-info.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/personal-info/personal-info.css';
        document.head.appendChild(styleSheet);

        this.innerHTML = template;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const inputs = this.querySelectorAll('input, textarea, select');
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
            case 'email':
                if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    errorMessage = 'Format d\'email invalide';
                }
                break;
            case 'telephone':
                if (!value.match(/^(0|\+33|0033)[1-9][0-9]{8}$/)) {
                    errorMessage = 'Format de téléphone invalide (ex: 0612345678 ou +33612345678)';
                }
                break;
            case 'age':
                const age = parseInt(value);
                if (isNaN(age) || age < 16 || age > 100) {
                    errorMessage = 'L\'âge doit être compris entre 16 et 100 ans';
                }
                break;
            default:
                if (!value.trim()) {
                    errorMessage = 'Ce champ est requis';
                }
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = errorMessage ? 'block' : 'none';
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
        const requiredFields = ['nom', 'prenom', 'dateNaissance', 'lieuNaissance', 'adresse', 'telephone', 'email', 'situationFamiliale', 'age'];
        return requiredFields.every(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (!input) return false;
            
            const value = this.formData[field];
            if (!value) return false;

            if (field === 'telephone') {
                return /^(0|\+33|0033)[1-9][0-9]{8}$/.test(value);
            }
            
            if (field === 'email') {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }

            return true;
        });
    }
}

customElements.define('personal-info-form', PersonalInfoForm); 