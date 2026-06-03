const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const cssDir = path.join(publicDir, 'css');

// 1. Combine CSS
const cssFiles = [
    'variables.css',
    'base.css',
    'layout.css',
    'components.css',
    'navbar.css',
    'terminal.css',
    'veille.css',
    'animations.css'
];

let combinedCss = '';
for (const file of cssFiles) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
    combinedCss += content + '\n';
}

// Simple CSS minification
const minifiedCss = combinedCss
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // Remove spaces around syntax
    .replace(/;\}/g, '}')             // Remove trailing semicolons
    .trim();

fs.writeFileSync(path.join(cssDir, 'style.min.css'), minifiedCss);
console.log('Created style.min.css');

// 2. Combine & Minify JS
const jsFile = path.join(publicDir, 'script.js');
const jsContent = fs.readFileSync(jsFile, 'utf8');

// Very basic JS minification (remove single line comments, collapse spaces)
// Note: This is risky if regexes or strings contain // but for this file it might be okay.
// A safer approach for JS without a real minifier is just to remove multi-line comments and unnecessary whitespace.
const minifiedJs = jsContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^\s+/gm, '') // Remove leading whitespace per line
    .replace(/\n+/g, '\n') // Collapse empty lines
    .trim();

fs.writeFileSync(path.join(publicDir, 'script.min.js'), minifiedJs);
console.log('Created script.min.js');

// 3. Create print.css
const printCss = `
@media print {
    body { background: #fff !important; color: #000 !important; }
    .hero-badge, .nav-links, .social-links, .terminal-container, .scroll-indicator, .floating-nav, .theme-toggle, .mouse-follower, .matrix-bg, .splash-screen, .back-to-top { display: none !important; }
    .glass-nav { background: transparent !important; border: none !important; backdrop-filter: none !important; box-shadow: none !important; }
    .project-card-modern, .skill-card, .timeline-content, .article-card { background: transparent !important; border: 1px solid #ccc !important; box-shadow: none !important; break-inside: avoid; }
    * { color: #000 !important; text-shadow: none !important; box-shadow: none !important; }
}
`.replace(/\s+/g, ' ').trim();

fs.writeFileSync(path.join(cssDir, 'print.css'), printCss);
console.log('Created print.css');
