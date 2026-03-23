import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types'

export default antfu({
  lessOpinionated: true,
  typescript: true,
  vue: {
    overrides: {
      'vue/max-attributes-per-line': ['error', { singleline: { max: 1 }, multiline: { max: 1 } }],
      'vue/first-attribute-linebreak': ['error', { singleline: 'beside', multiline: 'below' }],
      // https://github.com/vuejs/eslint-plugin-vue/issues/1577
      'import/first': 'off',
    },
  },
}, {
  extends: [
    betterTailwindcss.configs.recommended,
  ],

  rules: {
    'better-tailwindcss/enforce-consistent-line-wrapping': ['error', { strictness: 'loose' }],
  },

  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/assets/global.css',
      selectors: [
        ...getDefaultSelectors(),
        {
          kind: SelectorKind.Attribute,
          match: [{ type: 'strings' }],
          name: '.*\-class$',
        },
      ],
    },
  },
}, {
  ignores: [
    // auto-generated code
    'src/api',
  ],
})
