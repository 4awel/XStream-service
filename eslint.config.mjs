import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Строгое сравнение: только === и !==
            eqeqeq: ['error', 'always'],

            // Неиспользуемые переменные / аргументы / импорты
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'all' },
            ],
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'error',

            // Мёртвый код
            'no-unreachable': 'error',
            'no-unreachable-loop': 'error',
            'no-constant-condition': 'error',
            'no-useless-return': 'error',
            'no-lonely-if': 'error',

            // Области видимости
            'no-var': 'error',
            'prefer-const': 'error',
            'block-scoped-var': 'error',
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': [
                'error',
                { functions: false, typedefs: false },
            ],

            // Максимум 2 аргумента у функции
            'max-params': ['error', 2],

            // Строгая типизация
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    // тип стора выводится из configureStore
                    allowedNames: ['makeStore'],
                },
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                { allowString: false, allowNumber: false, allowNullableObject: true },
            ],
        },
    },
    prettierRecommended,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
