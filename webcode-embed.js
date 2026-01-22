class WebCodeEmbed extends HTMLElement {
    constructor() {
        super();

        this.attrs = {
            breakpoint: "breakpoint",
            codeCollection: "code-collection",
            htmlPreview: "html-preview",
            height: "height",
            width: "width",
            csp: "csp",
            ratio: "ratio",
            loading: "loading"
        }

        this.defaults = {
            breakpoint: '(max-width: 39.9375em)',
            ratio: "1:1"
        }
    }

    render() {
        this.innerHTML = `
            <style>
                .container {
                    padding: 1rem;
                    background-color: #3e3e3e;
                    width: 100%;
                    height: 100%;
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
               .btn:active {
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
            </style>
            <div class="container" style="height: 500px">
                <div class="selections">
                    <div class="code-container">
                        <div class="file-previews">
                            <a href="#" type="button" class="btn">HTML</a>
                            <a href="#" type="button" class="btn">CSS</a>
                            <a href="#" type="button" class="btn">JS</a>
                        </div>
                        <pre>
                            <code>
                                Hello World
                            </code>
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
    connectedCallback() {
        this.render();
    }

}

if("customElements" in window) {
    window.customElements.define("webcode-embed", WebCodeEmbed);
}

export { WebCodeEmbed }