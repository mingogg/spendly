import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReact from "eslint-plugin-react";

export default [
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            import: eslintPluginImport,
            react: eslintPluginReact,
        },
        rules: {
            "react/prop-types": "off",
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    alphabetize: { order: "asc", caseInsensitive: true },
                    "newlines-between": "always",
                },
            ],
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
