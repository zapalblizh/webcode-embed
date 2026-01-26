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
        this.previewFilePath = "";
        this.activeIndex = 0;

        this.defaults = {
            breakpoint: '(max-width: 39.9375em)',
            ratio: "1:1"
        }
    }

    async processFiles() {
        try {
            for (let file of this.files) {
                this.fileTypes.push(file.slice(file.lastIndexOf('.') + 1))
                const response = await fetch(file);
                const content = await response.text();

                this.fileContents.push(content);
            }
        } catch (e) {
            console.warn(`Error processing files: ${e.message}`)
        }
    }

    createButtons() {
        let buttons = [];

        for (let [index, type] of this.fileTypes.entries()) {
            if (index === 0)
                buttons.push(`<a href="#" type="button" data-index="${index}" data-type="${type}" class="btn active">${type}</a>`)
            else
                buttons.push(`<a href="#" type="button" data-index="${index}" data-type="${type}" class="btn">${type}</a>`)
        }

        return buttons.join('');
    }

    toggleButton(clickedButton) {
        const index = parseInt(clickedButton.dataset.index);

        // Remove active class from all buttons
        this.shadowRoot.querySelectorAll('.file-previews .btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        clickedButton.classList.add('active');

        // Update active index
        this.activeIndex = index;

        // Update the code display with the corresponding file content
        const codeElement = this.shadowRoot.querySelector('pre code');

        codeElement.textContent = this.fileContents[index];
    }

    render(buttons) {
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
                    flex-wrap: wrap;
                    gap: 1px;
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
                    text-transform: uppercase;
                    display: block;
                }
               .btn:hover {
                    opacity: 0.9;
               }
               .btn.active {
                    box-shadow: inset 0 4px 0 #ddd;
                    background-color: #b3b3b3;
                    color: #000;
               }
               .code-container {
                    width: 50%; 
                    display: flex; 
                    flex-direction: column;
                    gap: 8px;
               }
               
               .result {
                    display: flex;
               }
               .result .btn {
                    border-radius: 2px;
               }
               #preview-box{
                    width: 100% !important;
                    height: 100% !important;
               }
               iframe {
                    border: 0;
               }
               
               pre {
                    overflow: hidden;
                    scroll-behavior: smooth;
               }
            </style>
            <div class="container" style="height: 500px">
                <div class="selections">
                    <div class="code-container">
                        <div class="file-previews">
                            ${buttons}
                        </div>
                        <pre style="color: white;">
                            <code>${this.fileContents[0] || ''}</code>
                        </pre>
                    </div>
                    <div class="code-container">
                        <div class="result">
                            <a href="#" type="button" class="btn">RESULT</a>
                        </div>
                        <div id="preview-box">
                            <iframe id="preview-box" title="Experiment 2" src="example/example.html" loading="lazy" allowtransparency="true"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.processFiles();

        const buttons = this.createButtons();

        this.render(buttons);

        this.shadowRoot.querySelector('.file-previews').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
                this.toggleButton(e.target);
            }
        });
    }
}

customElements.define("webcode-embed", WebCodeEmbed);