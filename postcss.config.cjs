const lintCompatPlugin = () => ({
  postcssPlugin: "lint-compat-fixes",
  Once(root) {
    root.walkRules((rule) => {
      let displayValue = null;
      let hasAppearance = false;

      rule.walkDecls((decl) => {
        if (decl.prop === "display" && displayValue === null) {
          displayValue = decl.value.trim().toLowerCase();
        }
        if (decl.prop === "appearance") {
          hasAppearance = true;
        }
      });

      rule.walkDecls("-webkit-appearance", (decl) => {
        if (!hasAppearance) {
          decl.cloneAfter({ prop: "appearance" });
          hasAppearance = true;
        }
      });

      rule.walkDecls("vertical-align", (decl) => {
        if (displayValue === "block") {
          decl.remove();
        }
      });
    });
  }
});
lintCompatPlugin.postcss = true;

module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer"), lintCompatPlugin]
};
