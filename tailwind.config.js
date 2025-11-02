/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1f2937',
          surface: '#374151',
          border: '#4b5563',
          hover: '#4b5563',
          text: {
            primary: '#f3f4f6',
            secondary: '#9ca3af',
            muted: '#6b7280'
          }
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: [
            {
            color: theme('colors.gray.300'),
            maxWidth: 'none',

            // 標題 - 冷色調（冰藍白）
            h1: {
              color: '#e6eef5',
              fontWeight: '700',
              borderBottom: `2px solid ${theme('colors.slate.600')}`,
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
            },
            h2: {
              color: '#d4dfe8',
              fontWeight: '600',
              borderBottom: `1px solid ${theme('colors.slate.600')}`,
              paddingBottom: '0.3rem',
              marginTop: '2rem',
            },
            h3: {
              color: '#c8d3de',
              fontWeight: '600',
              marginTop: '1.5rem',
            },
            h4: {
              color: '#b8c5d0',
              fontWeight: '500',
            },
            h5: { color: '#a8b5c1' },
            h6: { color: '#98a5b1' },

            // 段落和文字 - 冷色調（淡藍灰）
            p: {
              color: '#9dadbc',
              lineHeight: '1.75',
            },

            // 連結 - 明亮的淡藍色
            a: {
              color: '#7dd3fc',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: '#a5f3fc',
              },
            },

            // 強調 - 淡冰藍
            strong: {
              color: '#dbeafe',
              fontWeight: '600',
            },

            em: {
              color: '#bfdbfe',
            },
            code: {
              color: '#93c5fd',
              backgroundColor: '#1e293b',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#2d2d2d !important',
              padding: '1rem !important',
              borderRadius: '0.5rem',
              border: `1px solid ${theme('colors.dark.border')}`,
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
            },
            // 引用 - 淡紫藍灰
            blockquote: {
              color: '#94a3b8',
              borderLeftColor: '#60a5fa',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              backgroundColor: '#1e293b',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
            },

            // 列表 - 淡藍灰
            ul: {
              color: '#9dadbc',
            },
            ol: {
              color: '#9dadbc',
            },
            li: {
              color: '#9dadbc',
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
            },
            'li::marker': {
              color: '#64748b',
            },
            'li::before': {
              content: 'none',
            },

            // 水平線
            hr: {
              borderColor: theme('colors.dark.border'),
              marginTop: '2rem',
              marginBottom: '2rem',
            },

            // 表格
            table: {
              fontSize: '0.875rem',
            },
            thead: {
              borderBottomColor: theme('colors.dark.border'),
            },
            'thead th': {
              color: '#d4dfe8',
              fontWeight: '600',
              backgroundColor: '#1e293b',
            },
            'tbody tr': {
              borderBottomColor: theme('colors.slate.600'),
            },
            'tbody td': {
              color: '#9dadbc',
            },
          },
          ],
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
