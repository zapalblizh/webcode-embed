class WebCodeEmbed extends HTMLElement {
    static get observedAttributes() {
        return ['files']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'files' && newValue)
            this.files = newValue.split(' ').map(file => file.trim());
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.files = [];
        this.fileTypes = [];
        this.fileContents = [];
        this.activeIndex = 0;

        this.defaults = {
            breakpoint: '(max-width: 39.9375em)',
            codePreviewWidth: "50%",
        }
    }

    escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    async processFiles() {
        try {
            for (let file of this.files) {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                this.fileTypes.push(fileType);

                const response = await fetch(file);
                const content = await response.text();

                if (fileType === 'html') {
                    this.fileContents.push(this.escapeHTML(content));
                } else {
                    this.fileContents.push(content);
                }
            }
        } catch (e) {
            console.warn(`Error processing files: ${e.message}`)
        }
    }

    createButtons() {
        let buttons = [];

        for (let [index, type] of this.fileTypes.entries()) {
            if (index === this.activeIndex)
                buttons.push(`<button data-index="${index}" data-type="${type}" class="btn active">${type}</button>`)
            else
                buttons.push(`<button data-index="${index}" data-type="${type}" class="btn">${type}</button>`)
        }

        return buttons.join('');
    }

    toggleButton(clickedButton) {
        this.activeIndex = parseInt(clickedButton.dataset.index);

        if (clickedButton.classList.contains('active')) {
            clickedButton.classList.remove('active');
            this.shadowRoot.querySelector(`.code-box[data-index="${this.activeIndex}"]`).classList.replace('active', 'hidden');
            return;
        }

        this.shadowRoot.querySelectorAll('.file-previews .btn').forEach(btn => {
            btn.classList.remove('active');
        });

        clickedButton.classList.add('active');
        this.shadowRoot.querySelector('.code-box.active').classList.replace('active', 'hidden');
        this.shadowRoot.querySelector(`.code-box[data-index="${this.activeIndex}"]`).classList.replace('hidden', 'active');
    }

    render(buttons, codeBoxes) {
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    padding: 1rem;
                    background-color: #3e3e3e;
                    width: 100%;
                    height: 100%;
                }
                .hidden {
                    display: none;
                }
                .selections {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
                .file-previews {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1px;
                }
                .file-previews .btn {
                    text-transform: uppercase;
                }
                .file-previews > :first-child {
                    border-radius: 2px 0 0 2px;
                }
                .file-previews > :last-child {
                    border-radius: 0 2px 2px 0;
                }
                .btn {
                    padding: 10px 14px;
                    background-color: #666666;
                    border: 0;
                    font-size: 14px;
                    color: #fff;
                    cursor: pointer;
                    text-decoration: none;
                    display: block;
                    font-family: Arial, sans-serif;
                    transition: 0.1s ease;
                }
               .btn:hover {
                    opacity: 0.9;
               }
               .btn.active {
                    box-shadow: inset 0 3px 0 #ddd;
                    background-color: #b3b3b3;
                    color: #000;
               }
               .code-container {
                    width: 50%; 
                    display: flex; 
                    flex-direction: column;
                    gap: 8px;
                    overflow: hidden;
               }
               
               .result {
                    display: flex;
                    align-items: center;
               }
               .result .btn {
                    border-radius: 2px;
               }
               .preview-box {
                    width: 100% !important;
                    height: 100% !important;
               }
               iframe {
                    border: 0;
               }
               .code-box {
                    background: #111;
                    color: #fff;
                    padding: 12px;
                    overflow: auto;
                    height: 100%;
               }
               .active {
                    display: block;
               }
               pre {
                    margin: 0;
               }
               code {
                    text-wrap: wrap;
                    white-space: pre;
               }
               .btn:active {
                    -webkit-transform: translateY(1px);
                    transform: translateY(1px);
               }
            </style>
            <div class="container" style="height: 500px">
                <div class="selections">
                    <div class="code-container">
                        <div class="file-previews">
                            ${buttons}
                        </div>
                        ${codeBoxes}
                    </div>
                    <div class="code-container">
                        <div class="result">
                            <a href="#" type="button" class="btn">Result</a>
                        </div>
                        <div class="preview-box">
                            <iframe class="preview-box" title="Experiment 2" src="example/example.html" loading="lazy" allowtransparency="true"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.processFiles();

        const buttons = this.createButtons();
        let codeBoxes = this.fileContents.map((content, index) => `<div class="code-box hidden" data-index="${index}"><pre><code>${content}</code></pre></div>`).join('');
        this.render(buttons, codeBoxes);

        this.shadowRoot.querySelector(`.code-box[data-index="${this.activeIndex}"]`).classList.replace('hidden', 'active');

        this.shadowRoot.querySelector('.file-previews').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
                this.toggleButton(e.target);
            }
        });
    }
}

customElements.define("webcode-embed", WebCodeEmbed);