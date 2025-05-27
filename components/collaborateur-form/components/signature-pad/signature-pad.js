class SignaturePadComponent extends HTMLElement {
    constructor() {
        super();
        this.isValid = false;
    }

    async connectedCallback() {
        const templateResponse = await fetch('./components/signature-pad/signature-pad.html');
        const template = await templateResponse.text();
        
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = './components/signature-pad/signature-pad.css';
        document.head.appendChild(styleSheet);

        this.innerHTML = template;
        this.setupCanvas();
    }

    setupCanvas() {
        const canvas = this.querySelector('#signaturePad');
        const clearButton = this.querySelector('#clearSignature');
        const errorMessage = this.querySelector('#signatureError');
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;

            // Configuration du style de dessin
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            const validateSignature = () => {
                const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                this.isValid = pixels.some(pixel => pixel !== 0);
                errorMessage.textContent = this.isValid ? '' : 'La signature est obligatoire';
            };

            // Gestionnaire d'événements pour le dessin
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', () => {
                stopDrawing();
                validateSignature();
            });
            canvas.addEventListener('mouseout', stopDrawing);

            // Support tactile
            canvas.addEventListener('touchstart', handleTouch);
            canvas.addEventListener('touchmove', handleTouch);
            canvas.addEventListener('touchend', () => {
                stopDrawing();
                validateSignature();
            });

            // Bouton pour effacer
            clearButton.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.isValid = false;
                errorMessage.textContent = 'La signature est obligatoire';
            });

            function startDrawing(e) {
                isDrawing = true;
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }

            function draw(e) {
                if (!isDrawing) return;
                
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }

            function stopDrawing() {
                isDrawing = false;
            }

            function handleTouch(e) {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const offsetX = touch.clientX - rect.left;
                const offsetY = touch.clientY - rect.top;

                if (e.type === 'touchstart') {
                    isDrawing = true;
                    [lastX, lastY] = [offsetX, offsetY];
                } else if (e.type === 'touchmove' && isDrawing) {
                    ctx.beginPath();
                    ctx.moveTo(lastX, lastY);
                    ctx.lineTo(offsetX, offsetY);
                    ctx.stroke();
                    [lastX, lastY] = [offsetX, offsetY];
                }
            }

            // Afficher le message d'erreur initial
            errorMessage.textContent = 'La signature est obligatoire';
        }
    }

    hasSignature() {
        console.log('Signature - validation:', { isValid: this.isValid });
        return this.isValid;
    }

    getSignatureData() {
        const canvas = this.querySelector('#signaturePad');
        return canvas ? canvas.toDataURL() : null;
    }
}

customElements.define('signature-pad-component', SignaturePadComponent); 