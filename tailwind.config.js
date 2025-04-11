/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{css,xml,html,vue,ts}'],
  darkMode: ['class', '.ns-dark'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  safelist: [
    // Background colors
    { pattern: /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/ },
  
    // Text colors
    { pattern: /text-(white|black|slate|gray|zinc|neutral|red|yellow|green|blue|purple)-(100|200|300|400|500|600|700|800|900)/ },
  
    // Font size
    { pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/ },
  
    // Padding
    { pattern: /p[trblxy]?-([1-9]|1[0-2])/ },
  
    // Margin
    { pattern: /m[trblxy]?-([1-9]|1[0-2])/ },
  
    // Rounded corners
    { pattern: /rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?/ },
  
    // Border
    { pattern: /border(-(0|2|4|8))?/ },
    { pattern: /border-(slate|gray|red|yellow|green|blue|purple)-(100|200|300|400|500|600|700|800|900)/ },
  
    // Width and Height
    { pattern: /w-(1\/2|1\/3|2\/3|1\/4|3\/4|full|screen|min|max|auto)/ },
    { pattern: /h-(1\/2|1\/3|2\/3|1\/4|3\/4|full|screen|min|max|auto)/ },
  
    // Flexbox
    { pattern: /flex(-(row|col|wrap|nowrap|1))?/ },
    { pattern: /items-(start|center|end|stretch)/ },
    { pattern: /justify-(start|center|end|between|around|evenly)/ },
  
    // Grid
    { pattern: /grid-cols-(1|2|3|4|5|6)/ },
    { pattern: /col-span-(1|2|3|4|5|6)/ },
  
    // Display
    { pattern: /^(hidden|block|inline-block|flex|grid)$/ },
  
    // Shadow
    { pattern: /shadow(-(sm|md|lg|xl|2xl|inner|none))?/ },
  
    // Opacity
    { pattern: /opacity-(0|25|50|75|100)/ },
  
    // Positioning
    { pattern: /^(absolute|relative|sticky|fixed)$/ },
    { pattern: /top-([0-9]+)/ },
    { pattern: /left-([0-9]+)/ },
    { pattern: /right-([0-9]+)/ },
    { pattern: /bottom-([0-9]+)/ },
  ],
  
};
