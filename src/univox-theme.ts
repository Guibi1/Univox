import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const theme: CustomThemeConfig = {
    name: "univox-theme",
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base":
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "--theme-font-family-heading":
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "4px",
        "--theme-rounded-container": "4px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "255 255 255",
        "--on-secondary": "0 0 0",
        "--on-tertiary": "0 0 0",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "255 255 255",
        "--on-surface": "255 255 255",
        // =~= Theme Colors  =~=
        // primary | #744aa1
        "--color-primary-50": "234 228 241", // #eae4f1
        "--color-primary-100": "227 219 236", // #e3dbec
        "--color-primary-200": "220 210 232", // #dcd2e8
        "--color-primary-300": "199 183 217", // #c7b7d9
        "--color-primary-400": "158 128 189", // #9e80bd
        "--color-primary-500": "116 74 161", // #744aa1
        "--color-primary-600": "104 67 145", // #684391
        "--color-primary-700": "87 56 121", // #573879
        "--color-primary-800": "70 44 97", // #462c61
        "--color-primary-900": "57 36 79", // #39244f
        // secondary | #0672e5
        "--color-secondary-50": "218 234 251", // #daeafb
        "--color-secondary-100": "205 227 250", // #cde3fa
        "--color-secondary-200": "193 220 249", // #c1dcf9
        "--color-secondary-300": "155 199 245", // #9bc7f5
        "--color-secondary-400": "81 156 237", // #519ced
        "--color-secondary-500": "6 114 229", // #0672e5
        "--color-secondary-600": "5 103 206", // #0567ce
        "--color-secondary-700": "5 86 172", // #0556ac
        "--color-secondary-800": "4 68 137", // #044489
        "--color-secondary-900": "3 56 112", // #033870
        // tertiary | #7f78dd
        "--color-tertiary-50": "236 235 250", // #ecebfa
        "--color-tertiary-100": "229 228 248", // #e5e4f8
        "--color-tertiary-200": "223 221 247", // #dfddf7
        "--color-tertiary-300": "204 201 241", // #ccc9f1
        "--color-tertiary-400": "165 161 231", // #a5a1e7
        "--color-tertiary-500": "127 120 221", // #7f78dd
        "--color-tertiary-600": "114 108 199", // #726cc7
        "--color-tertiary-700": "95 90 166", // #5f5aa6
        "--color-tertiary-800": "76 72 133", // #4c4885
        "--color-tertiary-900": "62 59 108", // #3e3b6c
        // success | #72c585
        "--color-success-50": "234 246 237", // #eaf6ed
        "--color-success-100": "227 243 231", // #e3f3e7
        "--color-success-200": "220 241 225", // #dcf1e1
        "--color-success-300": "199 232 206", // #c7e8ce
        "--color-success-400": "156 214 170", // #9cd6aa
        "--color-success-500": "114 197 133", // #72c585
        "--color-success-600": "103 177 120", // #67b178
        "--color-success-700": "86 148 100", // #569464
        "--color-success-800": "68 118 80", // #447650
        "--color-success-900": "56 97 65", // #386141
        // warning | #e77f08
        "--color-warning-50": "251 236 218", // #fbecda
        "--color-warning-100": "250 229 206", // #fae5ce
        "--color-warning-200": "249 223 193", // #f9dfc1
        "--color-warning-300": "245 204 156", // #f5cc9c
        "--color-warning-400": "238 165 82", // #eea552
        "--color-warning-500": "231 127 8", // #e77f08
        "--color-warning-600": "208 114 7", // #d07207
        "--color-warning-700": "173 95 6", // #ad5f06
        "--color-warning-800": "139 76 5", // #8b4c05
        "--color-warning-900": "113 62 4", // #713e04
        // error | #8f0f22
        "--color-error-50": "238 219 222", // #eedbde
        "--color-error-100": "233 207 211", // #e9cfd3
        "--color-error-200": "227 195 200", // #e3c3c8
        "--color-error-300": "210 159 167", // #d29fa7
        "--color-error-400": "177 87 100", // #b15764
        "--color-error-500": "143 15 34", // #8f0f22
        "--color-error-600": "129 14 31", // #810e1f
        "--color-error-700": "107 11 26", // #6b0b1a
        "--color-error-800": "86 9 20", // #560914
        "--color-error-900": "70 7 17", // #460711
        // surface
        "--color-surface-50": "250 248 252",
        "--color-surface-100": "242 238 247",
        "--color-surface-200": "229 220 239",
        "--color-surface-300": "209 192 226",
        "--color-surface-400": "162 129 197",
        "--color-surface-500": "116 74 161",
        "--color-surface-600": "83 53 115",
        "--color-surface-700": "60 39 84",
        "--color-surface-800": "35 22 49",
        "--color-surface-900": "18 11 24",
    },
};
