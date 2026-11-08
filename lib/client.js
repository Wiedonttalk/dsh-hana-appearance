// dsh-hana-appearance — browser half (client plugin bundle).
// Loaded by dsh-client-modules at /plugins/dsh-hana-appearance/client.js and
// executed through the vendored cordis Loader's lazy-CJS module table.
// The factory body is plain CJS with require() resolved against the shell's
// module table (same shape the shipped ui-* packages' tsdown bundles emit).
//
// Visual language ported from HanaAgent (openhanako, Apache-2.0):
// https://github.com/liliMozi/openhanako — theme palettes and the settings
// structure (SettingsSection / SettingsRow typography) are adapted from
// desktop/src/themes/*, desktop/src/shared/theme-registry-data.json and
// desktop/src/react/settings/**.
window.__ModuleLoader__.load({
	id: "dsh-hana-appearance",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");

		//#region dsh-hana-appearance: constants
		const STORAGE_KEY = "dsh-hana-appearance:state";
		const STATE_ROUTE = "/api/hana-appearance/state";
		const DEFAULT_SKIN = "system";

		/** Theme catalog generated from HanaAgent's desktop/src/themes/*.css. */
		const THEMES = [{"id":"hana-warm-paper","name":"暖纸","mode":"白天","colorScheme":"light","pageColor":"#F8F4ED","tokens":{"--dsw-alias-bg-base":"#F8F4ED","--dsw-alias-bg-layer-1":"#FCFAF5","--dsw-alias-bg-layer-2":"#FBF9F3","--dsw-alias-bg-layer-3":"#FAF8F2","--dsw-alias-bg-overlay":"#FCFAF5","--dsw-alias-bg-module-platform":"#F8F4ED","--dsw-alias-bg-multi-select":"rgba(83, 125, 150, 0.08)","--dsw-alias-bg-skeleton":"rgba(59, 61, 63, 0.08)","--dsw-alias-bg-mask-1":"rgba(248, 244, 237, 0.35)","--dsw-alias-bg-mask-2":"rgba(248, 244, 237, 0.6)","--dsw-alias-bg-mask-3":"rgba(248, 244, 237, 0.78)","--dsw-alias-bg-mask-photo":"rgba(248, 244, 237, 0.55)","--dsw-alias-bg-mask-drop":"rgba(248, 244, 237, 0.75)","--dsw-alias-border-l1":"rgba(122, 96, 88, 0.18)","--dsw-alias-border-l2":"rgba(122, 96, 88, 0.18)","--dsw-alias-border-l3":"#6F5A54","--dsw-alias-border-l4":"#665550","--dsw-alias-border-l2-darkmode-thin":"rgba(122, 96, 88, 0.18)","--dsw-alias-border-inverted":"#F8F4ED","--dsw-alias-border-inverted2":"#F8F4ED","--dsw-alias-separator-primary":"rgba(122, 96, 88, 0.18)","--dsw-alias-label-primary":"#3B3D3F","--dsw-alias-label-secondary":"#6B6F73","--dsw-alias-label-tertiary":"#8E9196","--dsw-alias-label-caption":"#8E9196","--dsw-alias-label-dimmed":"rgba(142, 145, 150, 0.75)","--dsw-alias-label-primary-bluish":"#3B3D3F","--dsw-alias-label-primary-dimmed":"#6B6F73","--dsw-alias-label-primary-foreground":"#F8F4ED","--dsw-alias-label-primary-inverted":"#F8F4ED","--dsw-alias-brand-primary":"#537D96","--dsw-alias-brand-primary-invert":"#F8F4ED","--dsw-alias-brand-primary-new-colorprimary-new-color":"#537D96","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#537D96","--dsw-alias-button-primary-hover":"#456A80","--dsw-alias-button-primary-dimmed":"rgba(83, 125, 150, 0.08)","--dsw-alias-button-elevated-fill":"#FCFAF5","--dsw-alias-button-floating-fill":"#FCFAF5","--dsw-alias-button-floating-hover":"#F2F1EC","--dsw-alias-button-ghost-active-border":"#537D96","--dsw-alias-button-ghost-active-fill":"rgba(83, 125, 150, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(83, 125, 150, 0.16)","--dsw-alias-button-contrast-fill":"#3B3D3F","--dsw-alias-button-info-fill":"#537D96","--dsw-alias-button-info-hover":"#456A80","--dsw-alias-button-tool-bar-fill":"#FCFAF5","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(59, 61, 63, 0.06)","--dsw-alias-state-business-primary":"#537D96","--dsw-alias-state-business-tertiary":"rgba(83, 125, 150, 0.08)","--dsw-alias-state-error-primary":"#8B3A3A","--dsw-alias-state-error-secondary":"rgba(139, 58, 58, 0.6)","--dsw-alias-state-success-primary":"#7BAE7F","--dsw-alias-state-success-secondary":"rgba(123, 174, 127, 0.6)","--dsw-alias-state-success-tertiary":"rgba(123, 174, 127, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(59, 61, 63, 0.05)","--dsw-alias-interactive-bg-active":"rgba(59, 61, 63, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(83, 125, 150, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 58, 58, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(59, 61, 63, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(59, 61, 63, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(59, 61, 63, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(83, 125, 150, 0.08)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#8E9196","--dsw-alias-markdown-tag":"rgba(83, 125, 150, 0.08)","--dsw-alias-toast-bg":"#FCFAF5","--dsw-alias-tooltip-bg":"#3B3D3F","--dsw-alias-scrollbar-bg-l1":"rgba(59, 61, 63, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(59, 61, 63, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(59, 61, 63, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(59, 61, 63, 0.22)","--dsw-specific-sidebar-fill":"#F4F0EA","--dsw-specific-sidebar-nav-item-active":"rgba(83, 125, 150, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#537D96","--dsw-specific-sidebar-nav-item-hover":"rgba(59, 61, 63, 0.05)","--dsw-specific-bubble":"rgba(83, 125, 150, 0.08)","--dsw-specific-bubble-highlight":"rgba(83, 125, 150, 0.2)","--dsw-specific-input-major":"#FCFAF5","--dsw-specific-login-input":"#FCFAF5","--dsw-specific-menu":"#FCFAF5","--dsw-specific-selector":"#FCFAF5","--dsw-specific-tip":"#FCFAF5","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#3B3D3F","--shiki-token-constant":"#537D96","--shiki-token-string":"#7BAE7F","--shiki-token-comment":"rgba(142, 145, 150, 0.9)","--shiki-token-keyword":"#51778D","--shiki-token-parameter":"#6B6F73","--shiki-token-function":"#527A92","--shiki-token-string-expression":"#7BAE7F","--shiki-token-punctuation":"#8E9196","--shiki-token-link":"#537D96","--shiki-token-inserted":"#7BAE7F","--shiki-token-deleted":"#8B3A3A","--shiki-token-changed":"#B0802A"}},{"id":"hana-midnight","name":"青夜","mode":"夜间","colorScheme":"dark","pageColor":"#3B4A54","tokens":{"--dsw-alias-bg-base":"#3B4A54","--dsw-alias-bg-layer-1":"#445560","--dsw-alias-bg-layer-2":"#43545F","--dsw-alias-bg-layer-3":"#42525D","--dsw-alias-bg-overlay":"#445560","--dsw-alias-bg-module-platform":"#3B4A54","--dsw-alias-bg-multi-select":"rgba(201, 154, 175, 0.11)","--dsw-alias-bg-skeleton":"rgba(225, 234, 240, 0.08)","--dsw-alias-bg-mask-1":"rgba(59, 74, 84, 0.35)","--dsw-alias-bg-mask-2":"rgba(59, 74, 84, 0.6)","--dsw-alias-bg-mask-3":"rgba(59, 74, 84, 0.78)","--dsw-alias-bg-mask-photo":"rgba(59, 74, 84, 0.55)","--dsw-alias-bg-mask-drop":"rgba(59, 74, 84, 0.75)","--dsw-alias-border-l1":"rgba(170, 121, 141, 0.16)","--dsw-alias-border-l2":"rgba(170, 121, 141, 0.16)","--dsw-alias-border-l3":"#B48D9F","--dsw-alias-border-l4":"#BC9DAD","--dsw-alias-border-l2-darkmode-thin":"rgba(170, 121, 141, 0.16)","--dsw-alias-border-inverted":"#3B4A54","--dsw-alias-border-inverted2":"#3B4A54","--dsw-alias-separator-primary":"rgba(170, 121, 141, 0.16)","--dsw-alias-label-primary":"#E1EAF0","--dsw-alias-label-secondary":"#B7C5CE","--dsw-alias-label-tertiary":"#A3B5C0","--dsw-alias-label-caption":"#A3B5C0","--dsw-alias-label-dimmed":"rgba(163, 181, 192, 0.75)","--dsw-alias-label-primary-bluish":"#E1EAF0","--dsw-alias-label-primary-dimmed":"#B7C5CE","--dsw-alias-label-primary-foreground":"#3B4A54","--dsw-alias-label-primary-inverted":"#3B4A54","--dsw-alias-brand-primary":"#C99AAF","--dsw-alias-brand-primary-invert":"#3B4A54","--dsw-alias-brand-primary-new-colorprimary-new-color":"#C99AAF","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#C99AAF","--dsw-alias-button-primary-hover":"#D8AFC0","--dsw-alias-button-primary-dimmed":"rgba(201, 154, 175, 0.11)","--dsw-alias-button-elevated-fill":"#445560","--dsw-alias-button-floating-fill":"#445560","--dsw-alias-button-floating-hover":"#4C5C67","--dsw-alias-button-ghost-active-border":"#C99AAF","--dsw-alias-button-ghost-active-fill":"rgba(201, 154, 175, 0.11)","--dsw-alias-button-ghost-active-hover":"rgba(201, 154, 175, 0.16)","--dsw-alias-button-contrast-fill":"#E1EAF0","--dsw-alias-button-info-fill":"#C99AAF","--dsw-alias-button-info-hover":"#D8AFC0","--dsw-alias-button-tool-bar-fill":"#445560","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(225, 234, 240, 0.06)","--dsw-alias-state-business-primary":"#C99AAF","--dsw-alias-state-business-tertiary":"rgba(201, 154, 175, 0.11)","--dsw-alias-state-error-primary":"#C77070","--dsw-alias-state-error-secondary":"rgba(199, 112, 112, 0.6)","--dsw-alias-state-success-primary":"#8CC790","--dsw-alias-state-success-secondary":"rgba(140, 199, 144, 0.6)","--dsw-alias-state-success-tertiary":"rgba(140, 199, 144, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(225, 234, 240, 0.05)","--dsw-alias-interactive-bg-active":"rgba(225, 234, 240, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(201, 154, 175, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(199, 112, 112, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(225, 234, 240, 0.08)","--dsw-alias-markdown-code-block":"rgba(255, 255, 255, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(225, 234, 240, 0.06)","--dsw-alias-markdown-code-segment-selected":"rgba(225, 234, 240, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(201, 154, 175, 0.11)","--dsw-alias-markdown-inline-code":"rgba(255, 255, 255, 0.03)","--dsw-alias-markdown-placeholder":"#A3B5C0","--dsw-alias-markdown-tag":"rgba(201, 154, 175, 0.11)","--dsw-alias-toast-bg":"#445560","--dsw-alias-tooltip-bg":"#445560","--dsw-alias-scrollbar-bg-l1":"rgba(225, 234, 240, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(225, 234, 240, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(225, 234, 240, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(225, 234, 240, 0.22)","--dsw-specific-sidebar-fill":"#34424B","--dsw-specific-sidebar-nav-item-active":"rgba(201, 154, 175, 0.11)","--dsw-specific-sidebar-nav-item-active-accent":"#C99AAF","--dsw-specific-sidebar-nav-item-hover":"rgba(225, 234, 240, 0.05)","--dsw-specific-bubble":"rgba(170, 121, 141, 0.1)","--dsw-specific-bubble-highlight":"rgba(201, 154, 175, 0.2)","--dsw-specific-input-major":"#445560","--dsw-specific-login-input":"#445560","--dsw-specific-menu":"#445560","--dsw-specific-selector":"#445560","--dsw-specific-tip":"#445560","--shiki-background":"rgba(255, 255, 255, 0.03)","--shiki-foreground":"#E1EAF0","--shiki-token-constant":"#C99AAF","--shiki-token-string":"#8CC790","--shiki-token-comment":"rgba(163, 181, 192, 0.9)","--shiki-token-keyword":"#CFAEBF","--shiki-token-parameter":"#B7C5CE","--shiki-token-function":"#CDA6B9","--shiki-token-string-expression":"#8CC790","--shiki-token-punctuation":"#A3B5C0","--shiki-token-link":"#C99AAF","--shiki-token-inserted":"#8CC790","--shiki-token-deleted":"#C77070","--shiki-token-changed":"#B0802A"}},{"id":"hana-high-contrast","name":"素白","mode":"高对比","colorScheme":"light","pageColor":"#FAF8F7","tokens":{"--dsw-alias-bg-base":"#FAF8F7","--dsw-alias-bg-layer-1":"#FDFBFA","--dsw-alias-bg-layer-2":"#FCFAF9","--dsw-alias-bg-layer-3":"#FCFAF9","--dsw-alias-bg-overlay":"#FDFBFA","--dsw-alias-bg-module-platform":"#FAF8F7","--dsw-alias-bg-multi-select":"rgba(58, 107, 133, 0.08)","--dsw-alias-bg-skeleton":"rgba(26, 28, 30, 0.08)","--dsw-alias-bg-mask-1":"rgba(250, 248, 247, 0.35)","--dsw-alias-bg-mask-2":"rgba(250, 248, 247, 0.6)","--dsw-alias-bg-mask-3":"rgba(250, 248, 247, 0.78)","--dsw-alias-bg-mask-photo":"rgba(250, 248, 247, 0.55)","--dsw-alias-bg-mask-drop":"rgba(250, 248, 247, 0.75)","--dsw-alias-border-l1":"rgba(92, 75, 70, 0.22)","--dsw-alias-border-l2":"rgba(92, 75, 70, 0.22)","--dsw-alias-border-l3":"#50433F","--dsw-alias-border-l4":"#473C39","--dsw-alias-border-l2-darkmode-thin":"rgba(92, 75, 70, 0.22)","--dsw-alias-border-inverted":"#FAF8F7","--dsw-alias-border-inverted2":"#FAF8F7","--dsw-alias-separator-primary":"rgba(92, 75, 70, 0.22)","--dsw-alias-label-primary":"#1A1C1E","--dsw-alias-label-secondary":"#4A4E52","--dsw-alias-label-tertiary":"#6B6F73","--dsw-alias-label-caption":"#6B6F73","--dsw-alias-label-dimmed":"rgba(107, 111, 115, 0.75)","--dsw-alias-label-primary-bluish":"#1A1C1E","--dsw-alias-label-primary-dimmed":"#4A4E52","--dsw-alias-label-primary-foreground":"#FAF8F7","--dsw-alias-label-primary-inverted":"#FAF8F7","--dsw-alias-brand-primary":"#3A6B85","--dsw-alias-brand-primary-invert":"#FAF8F7","--dsw-alias-brand-primary-new-colorprimary-new-color":"#3A6B85","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#3A6B85","--dsw-alias-button-primary-hover":"#2E5870","--dsw-alias-button-primary-dimmed":"rgba(58, 107, 133, 0.08)","--dsw-alias-button-elevated-fill":"#FDFBFA","--dsw-alias-button-floating-fill":"#FDFBFA","--dsw-alias-button-floating-hover":"#F2F0EF","--dsw-alias-button-ghost-active-border":"#3A6B85","--dsw-alias-button-ghost-active-fill":"rgba(58, 107, 133, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(58, 107, 133, 0.16)","--dsw-alias-button-contrast-fill":"#1A1C1E","--dsw-alias-button-info-fill":"#3A6B85","--dsw-alias-button-info-hover":"#2E5870","--dsw-alias-button-tool-bar-fill":"#FDFBFA","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(26, 28, 30, 0.06)","--dsw-alias-state-business-primary":"#3A6B85","--dsw-alias-state-business-tertiary":"rgba(58, 107, 133, 0.08)","--dsw-alias-state-error-primary":"#7A3030","--dsw-alias-state-error-secondary":"rgba(122, 48, 48, 0.6)","--dsw-alias-state-success-primary":"#5A9A5E","--dsw-alias-state-success-secondary":"rgba(90, 154, 94, 0.6)","--dsw-alias-state-success-tertiary":"rgba(90, 154, 94, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(26, 28, 30, 0.05)","--dsw-alias-interactive-bg-active":"rgba(26, 28, 30, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(58, 107, 133, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(122, 48, 48, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(26, 28, 30, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.04)","--dsw-alias-markdown-code-block-banner":"rgba(26, 28, 30, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(26, 28, 30, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(58, 107, 133, 0.08)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.04)","--dsw-alias-markdown-placeholder":"#6B6F73","--dsw-alias-markdown-tag":"rgba(58, 107, 133, 0.08)","--dsw-alias-toast-bg":"#FDFBFA","--dsw-alias-tooltip-bg":"#1A1C1E","--dsw-alias-scrollbar-bg-l1":"rgba(26, 28, 30, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(26, 28, 30, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(26, 28, 30, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(26, 28, 30, 0.22)","--dsw-specific-sidebar-fill":"#F3F1F0","--dsw-specific-sidebar-nav-item-active":"rgba(58, 107, 133, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#3A6B85","--dsw-specific-sidebar-nav-item-hover":"rgba(26, 28, 30, 0.05)","--dsw-specific-bubble":"rgba(58, 107, 133, 0.08)","--dsw-specific-bubble-highlight":"rgba(58, 107, 133, 0.2)","--dsw-specific-input-major":"#FDFBFA","--dsw-specific-login-input":"#FDFBFA","--dsw-specific-menu":"#FDFBFA","--dsw-specific-selector":"#FDFBFA","--dsw-specific-tip":"#FDFBFA","--shiki-background":"rgba(0, 0, 0, 0.04)","--shiki-foreground":"#1A1C1E","--shiki-token-constant":"#3A6B85","--shiki-token-string":"#5A9A5E","--shiki-token-comment":"rgba(107, 111, 115, 0.9)","--shiki-token-keyword":"#37637B","--shiki-token-parameter":"#4A4E52","--shiki-token-function":"#386780","--shiki-token-string-expression":"#5A9A5E","--shiki-token-punctuation":"#6B6F73","--shiki-token-link":"#3A6B85","--shiki-token-inserted":"#5A9A5E","--shiki-token-deleted":"#7A3030","--shiki-token-changed":"#B0802A"}},{"id":"hana-grass-aroma","name":"草香","mode":"Butter","colorScheme":"light","pageColor":"#F5F8F3","tokens":{"--dsw-alias-bg-base":"#F5F8F3","--dsw-alias-bg-layer-1":"#F9FBF7","--dsw-alias-bg-layer-2":"#F8FAF6","--dsw-alias-bg-layer-3":"#F7FAF5","--dsw-alias-bg-overlay":"#F9FBF7","--dsw-alias-bg-module-platform":"#F5F8F3","--dsw-alias-bg-multi-select":"rgba(91, 168, 140, 0.08)","--dsw-alias-bg-skeleton":"rgba(46, 56, 50, 0.08)","--dsw-alias-bg-mask-1":"rgba(245, 248, 243, 0.35)","--dsw-alias-bg-mask-2":"rgba(245, 248, 243, 0.6)","--dsw-alias-bg-mask-3":"rgba(245, 248, 243, 0.78)","--dsw-alias-bg-mask-photo":"rgba(245, 248, 243, 0.55)","--dsw-alias-bg-mask-drop":"rgba(245, 248, 243, 0.75)","--dsw-alias-border-l1":"rgba(91, 168, 140, 0.22)","--dsw-alias-border-l2":"rgba(91, 168, 140, 0.22)","--dsw-alias-border-l3":"#53947C","--dsw-alias-border-l4":"#4D846F","--dsw-alias-border-l2-darkmode-thin":"rgba(91, 168, 140, 0.22)","--dsw-alias-border-inverted":"#F5F8F3","--dsw-alias-border-inverted2":"#F5F8F3","--dsw-alias-separator-primary":"rgba(91, 168, 140, 0.22)","--dsw-alias-label-primary":"#2E3832","--dsw-alias-label-secondary":"#5E6B63","--dsw-alias-label-tertiary":"#8A9490","--dsw-alias-label-caption":"#8A9490","--dsw-alias-label-dimmed":"rgba(138, 148, 144, 0.75)","--dsw-alias-label-primary-bluish":"#2E3832","--dsw-alias-label-primary-dimmed":"#5E6B63","--dsw-alias-label-primary-foreground":"#F5F8F3","--dsw-alias-label-primary-inverted":"#F5F8F3","--dsw-alias-brand-primary":"#5BA88C","--dsw-alias-brand-primary-invert":"#F5F8F3","--dsw-alias-brand-primary-new-colorprimary-new-color":"#5BA88C","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#5BA88C","--dsw-alias-button-primary-hover":"#4D9179","--dsw-alias-button-primary-dimmed":"rgba(91, 168, 140, 0.08)","--dsw-alias-button-elevated-fill":"#F9FBF7","--dsw-alias-button-floating-fill":"#F9FBF7","--dsw-alias-button-floating-hover":"#EFF1ED","--dsw-alias-button-ghost-active-border":"#5BA88C","--dsw-alias-button-ghost-active-fill":"rgba(91, 168, 140, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(91, 168, 140, 0.16)","--dsw-alias-button-contrast-fill":"#2E3832","--dsw-alias-button-info-fill":"#5BA88C","--dsw-alias-button-info-hover":"#4D9179","--dsw-alias-button-tool-bar-fill":"#F9FBF7","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(46, 56, 50, 0.06)","--dsw-alias-state-business-primary":"#5BA88C","--dsw-alias-state-business-tertiary":"rgba(91, 168, 140, 0.08)","--dsw-alias-state-error-primary":"#8B4A3A","--dsw-alias-state-error-secondary":"rgba(139, 74, 58, 0.6)","--dsw-alias-state-success-primary":"#7BAE7F","--dsw-alias-state-success-secondary":"rgba(123, 174, 127, 0.6)","--dsw-alias-state-success-tertiary":"rgba(123, 174, 127, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(46, 56, 50, 0.05)","--dsw-alias-interactive-bg-active":"rgba(46, 56, 50, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(91, 168, 140, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 74, 58, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(46, 56, 50, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(46, 56, 50, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(46, 56, 50, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(91, 168, 140, 0.08)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#8A9490","--dsw-alias-markdown-tag":"rgba(91, 168, 140, 0.08)","--dsw-alias-toast-bg":"#F9FBF7","--dsw-alias-tooltip-bg":"#2E3832","--dsw-alias-scrollbar-bg-l1":"rgba(46, 56, 50, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(46, 56, 50, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(46, 56, 50, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(46, 56, 50, 0.22)","--dsw-specific-sidebar-fill":"#EFF3EC","--dsw-specific-sidebar-nav-item-active":"rgba(91, 168, 140, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#5BA88C","--dsw-specific-sidebar-nav-item-hover":"rgba(46, 56, 50, 0.05)","--dsw-specific-bubble":"rgba(91, 168, 140, 0.08)","--dsw-specific-bubble-highlight":"rgba(91, 168, 140, 0.2)","--dsw-specific-input-major":"#F9FBF7","--dsw-specific-login-input":"#F9FBF7","--dsw-specific-menu":"#F9FBF7","--dsw-specific-selector":"#F9FBF7","--dsw-specific-tip":"#F9FBF7","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#2E3832","--shiki-token-constant":"#5BA88C","--shiki-token-string":"#7BAE7F","--shiki-token-comment":"rgba(138, 148, 144, 0.9)","--shiki-token-keyword":"#579D83","--shiki-token-parameter":"#5E6B63","--shiki-token-function":"#59A288","--shiki-token-string-expression":"#7BAE7F","--shiki-token-punctuation":"#8A9490","--shiki-token-link":"#5BA88C","--shiki-token-inserted":"#7BAE7F","--shiki-token-deleted":"#8B4A3A","--shiki-token-changed":"#B0802A"}},{"id":"hana-contemplation","name":"沉思","mode":"Ming","colorScheme":"light","pageColor":"#F3F5F7","tokens":{"--dsw-alias-bg-base":"#F3F5F7","--dsw-alias-bg-layer-1":"#F8F9FB","--dsw-alias-bg-layer-2":"#F7F8FA","--dsw-alias-bg-layer-3":"#F6F7F9","--dsw-alias-bg-overlay":"#F8F9FB","--dsw-alias-bg-module-platform":"#F3F5F7","--dsw-alias-bg-multi-select":"rgba(126, 153, 168, 0.08)","--dsw-alias-bg-skeleton":"rgba(44, 50, 56, 0.08)","--dsw-alias-bg-mask-1":"rgba(243, 245, 247, 0.35)","--dsw-alias-bg-mask-2":"rgba(243, 245, 247, 0.6)","--dsw-alias-bg-mask-3":"rgba(243, 245, 247, 0.78)","--dsw-alias-bg-mask-photo":"rgba(243, 245, 247, 0.55)","--dsw-alias-bg-mask-drop":"rgba(243, 245, 247, 0.75)","--dsw-alias-border-l1":"rgba(126, 153, 168, 0.22)","--dsw-alias-border-l2":"rgba(126, 153, 168, 0.22)","--dsw-alias-border-l3":"#6F8694","--dsw-alias-border-l4":"#647884","--dsw-alias-border-l2-darkmode-thin":"rgba(126, 153, 168, 0.22)","--dsw-alias-border-inverted":"#F3F5F7","--dsw-alias-border-inverted2":"#F3F5F7","--dsw-alias-separator-primary":"rgba(126, 153, 168, 0.22)","--dsw-alias-label-primary":"#2C3238","--dsw-alias-label-secondary":"#5A6570","--dsw-alias-label-tertiary":"#869098","--dsw-alias-label-caption":"#869098","--dsw-alias-label-dimmed":"rgba(134, 144, 152, 0.75)","--dsw-alias-label-primary-bluish":"#2C3238","--dsw-alias-label-primary-dimmed":"#5A6570","--dsw-alias-label-primary-foreground":"#F3F5F7","--dsw-alias-label-primary-inverted":"#F3F5F7","--dsw-alias-brand-primary":"#7E99A8","--dsw-alias-brand-primary-invert":"#F3F5F7","--dsw-alias-brand-primary-new-colorprimary-new-color":"#7E99A8","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#7E99A8","--dsw-alias-button-primary-hover":"#6B8594","--dsw-alias-button-primary-dimmed":"rgba(126, 153, 168, 0.08)","--dsw-alias-button-elevated-fill":"#F8F9FB","--dsw-alias-button-floating-fill":"#F8F9FB","--dsw-alias-button-floating-hover":"#EEEFF1","--dsw-alias-button-ghost-active-border":"#7E99A8","--dsw-alias-button-ghost-active-fill":"rgba(126, 153, 168, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(126, 153, 168, 0.16)","--dsw-alias-button-contrast-fill":"#2C3238","--dsw-alias-button-info-fill":"#7E99A8","--dsw-alias-button-info-hover":"#6B8594","--dsw-alias-button-tool-bar-fill":"#F8F9FB","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(44, 50, 56, 0.06)","--dsw-alias-state-business-primary":"#7E99A8","--dsw-alias-state-business-tertiary":"rgba(126, 153, 168, 0.08)","--dsw-alias-state-error-primary":"#8B4040","--dsw-alias-state-error-secondary":"rgba(139, 64, 64, 0.6)","--dsw-alias-state-success-primary":"#6FA87E","--dsw-alias-state-success-secondary":"rgba(111, 168, 126, 0.6)","--dsw-alias-state-success-tertiary":"rgba(111, 168, 126, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(44, 50, 56, 0.05)","--dsw-alias-interactive-bg-active":"rgba(44, 50, 56, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(126, 153, 168, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 64, 64, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(44, 50, 56, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(44, 50, 56, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(44, 50, 56, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(126, 153, 168, 0.08)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#869098","--dsw-alias-markdown-tag":"rgba(126, 153, 168, 0.08)","--dsw-alias-toast-bg":"#F8F9FB","--dsw-alias-tooltip-bg":"#2C3238","--dsw-alias-scrollbar-bg-l1":"rgba(44, 50, 56, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(44, 50, 56, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(44, 50, 56, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(44, 50, 56, 0.22)","--dsw-specific-sidebar-fill":"#ECEFF2","--dsw-specific-sidebar-nav-item-active":"rgba(126, 153, 168, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#7E99A8","--dsw-specific-sidebar-nav-item-hover":"rgba(44, 50, 56, 0.05)","--dsw-specific-bubble":"rgba(126, 153, 168, 0.08)","--dsw-specific-bubble-highlight":"rgba(126, 153, 168, 0.2)","--dsw-specific-input-major":"#F8F9FB","--dsw-specific-login-input":"#F8F9FB","--dsw-specific-menu":"#F8F9FB","--dsw-specific-selector":"#F8F9FB","--dsw-specific-tip":"#F8F9FB","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#2C3238","--shiki-token-constant":"#7E99A8","--shiki-token-string":"#6FA87E","--shiki-token-comment":"rgba(134, 144, 152, 0.9)","--shiki-token-keyword":"#768F9D","--shiki-token-parameter":"#5A6570","--shiki-token-function":"#7A94A2","--shiki-token-string-expression":"#6FA87E","--shiki-token-punctuation":"#869098","--shiki-token-link":"#7E99A8","--shiki-token-inserted":"#6FA87E","--shiki-token-deleted":"#8B4040","--shiki-token-changed":"#B0802A"}},{"id":"hana-absolutely","name":"Absolutely","mode":"有一点点熟悉","colorScheme":"light","pageColor":"#F4F3EE","tokens":{"--dsw-alias-bg-base":"#F4F3EE","--dsw-alias-bg-layer-1":"#FAF9F5","--dsw-alias-bg-layer-2":"#F9F8F4","--dsw-alias-bg-layer-3":"#F8F7F2","--dsw-alias-bg-overlay":"#FAF9F5","--dsw-alias-bg-module-platform":"#F4F3EE","--dsw-alias-bg-multi-select":"rgba(181, 132, 110, 0.08)","--dsw-alias-bg-skeleton":"rgba(45, 43, 40, 0.08)","--dsw-alias-bg-mask-1":"rgba(244, 243, 238, 0.35)","--dsw-alias-bg-mask-2":"rgba(244, 243, 238, 0.6)","--dsw-alias-bg-mask-3":"rgba(244, 243, 238, 0.78)","--dsw-alias-bg-mask-photo":"rgba(244, 243, 238, 0.55)","--dsw-alias-bg-mask-drop":"rgba(244, 243, 238, 0.75)","--dsw-alias-border-l1":"rgba(177, 173, 161, 0.28)","--dsw-alias-border-l2":"rgba(177, 173, 161, 0.28)","--dsw-alias-border-l3":"#99968B","--dsw-alias-border-l4":"#87837A","--dsw-alias-border-l2-darkmode-thin":"rgba(177, 173, 161, 0.28)","--dsw-alias-border-inverted":"#F4F3EE","--dsw-alias-border-inverted2":"#F4F3EE","--dsw-alias-separator-primary":"rgba(177, 173, 161, 0.28)","--dsw-alias-label-primary":"#2D2B28","--dsw-alias-label-secondary":"#6B6864","--dsw-alias-label-tertiary":"#9B9793","--dsw-alias-label-caption":"#9B9793","--dsw-alias-label-dimmed":"rgba(155, 151, 147, 0.75)","--dsw-alias-label-primary-bluish":"#2D2B28","--dsw-alias-label-primary-dimmed":"#6B6864","--dsw-alias-label-primary-foreground":"#F4F3EE","--dsw-alias-label-primary-inverted":"#F4F3EE","--dsw-alias-brand-primary":"#B5846E","--dsw-alias-brand-primary-invert":"#F4F3EE","--dsw-alias-brand-primary-new-colorprimary-new-color":"#B5846E","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#B5846E","--dsw-alias-button-primary-hover":"#A27460","--dsw-alias-button-primary-dimmed":"rgba(181, 132, 110, 0.08)","--dsw-alias-button-elevated-fill":"#FAF9F5","--dsw-alias-button-floating-fill":"#FAF9F5","--dsw-alias-button-floating-hover":"#F0EFEB","--dsw-alias-button-ghost-active-border":"#B5846E","--dsw-alias-button-ghost-active-fill":"rgba(181, 132, 110, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(181, 132, 110, 0.16)","--dsw-alias-button-contrast-fill":"#2D2B28","--dsw-alias-button-info-fill":"#B5846E","--dsw-alias-button-info-hover":"#A27460","--dsw-alias-button-tool-bar-fill":"#FAF9F5","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(45, 43, 40, 0.06)","--dsw-alias-state-business-primary":"#B5846E","--dsw-alias-state-business-tertiary":"rgba(181, 132, 110, 0.08)","--dsw-alias-state-error-primary":"#8B3A3A","--dsw-alias-state-error-secondary":"rgba(139, 58, 58, 0.6)","--dsw-alias-state-success-primary":"#7BAE7F","--dsw-alias-state-success-secondary":"rgba(123, 174, 127, 0.6)","--dsw-alias-state-success-tertiary":"rgba(123, 174, 127, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(45, 43, 40, 0.05)","--dsw-alias-interactive-bg-active":"rgba(45, 43, 40, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(181, 132, 110, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 58, 58, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(45, 43, 40, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(45, 43, 40, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(45, 43, 40, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(181, 132, 110, 0.08)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#9B9793","--dsw-alias-markdown-tag":"rgba(181, 132, 110, 0.08)","--dsw-alias-toast-bg":"#FAF9F5","--dsw-alias-tooltip-bg":"#2D2B28","--dsw-alias-scrollbar-bg-l1":"rgba(45, 43, 40, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(45, 43, 40, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(45, 43, 40, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(45, 43, 40, 0.22)","--dsw-specific-sidebar-fill":"#EDEAE2","--dsw-specific-sidebar-nav-item-active":"rgba(181, 132, 110, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#B5846E","--dsw-specific-sidebar-nav-item-hover":"rgba(45, 43, 40, 0.05)","--dsw-specific-bubble":"rgba(0, 0, 0, 0.035)","--dsw-specific-bubble-highlight":"rgba(181, 132, 110, 0.2)","--dsw-specific-input-major":"#FAF9F5","--dsw-specific-login-input":"#FAF9F5","--dsw-specific-menu":"#FAF9F5","--dsw-specific-selector":"#FAF9F5","--dsw-specific-tip":"#FAF9F5","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#2D2B28","--shiki-token-constant":"#B5846E","--shiki-token-string":"#7BAE7F","--shiki-token-comment":"rgba(155, 151, 147, 0.9)","--shiki-token-keyword":"#A77B67","--shiki-token-parameter":"#6B6864","--shiki-token-function":"#AE806B","--shiki-token-string-expression":"#7BAE7F","--shiki-token-punctuation":"#9B9793","--shiki-token-link":"#B5846E","--shiki-token-inserted":"#7BAE7F","--shiki-token-deleted":"#8B3A3A","--shiki-token-changed":"#B0802A"}},{"id":"hana-delve","name":"随时准备接住你","mode":"探究一下","colorScheme":"light","pageColor":"#FFFFFF","tokens":{"--dsw-alias-bg-base":"#FFFFFF","--dsw-alias-bg-layer-1":"#F7F7F8","--dsw-alias-bg-layer-2":"#F9F9F9","--dsw-alias-bg-layer-3":"#FAFAFB","--dsw-alias-bg-overlay":"#F7F7F8","--dsw-alias-bg-module-platform":"#FFFFFF","--dsw-alias-bg-multi-select":"rgba(0, 0, 0, 0.05)","--dsw-alias-bg-skeleton":"rgba(26, 26, 26, 0.08)","--dsw-alias-bg-mask-1":"rgba(255, 255, 255, 0.35)","--dsw-alias-bg-mask-2":"rgba(255, 255, 255, 0.6)","--dsw-alias-bg-mask-3":"rgba(255, 255, 255, 0.78)","--dsw-alias-bg-mask-photo":"rgba(255, 255, 255, 0.55)","--dsw-alias-bg-mask-drop":"rgba(255, 255, 255, 0.75)","--dsw-alias-border-l1":"rgba(0, 0, 0, 0.1)","--dsw-alias-border-l2":"rgba(0, 0, 0, 0.1)","--dsw-alias-border-l3":"#050505","--dsw-alias-border-l4":"#080808","--dsw-alias-border-l2-darkmode-thin":"rgba(0, 0, 0, 0.1)","--dsw-alias-border-inverted":"#FFFFFF","--dsw-alias-border-inverted2":"#FFFFFF","--dsw-alias-separator-primary":"rgba(0, 0, 0, 0.1)","--dsw-alias-label-primary":"#1A1A1A","--dsw-alias-label-secondary":"#6E6E6E","--dsw-alias-label-tertiary":"#999999","--dsw-alias-label-caption":"#999999","--dsw-alias-label-dimmed":"rgba(153, 153, 153, 0.75)","--dsw-alias-label-primary-bluish":"#1A1A1A","--dsw-alias-label-primary-dimmed":"#6E6E6E","--dsw-alias-label-primary-foreground":"#FFFFFF","--dsw-alias-label-primary-inverted":"#FFFFFF","--dsw-alias-brand-primary":"#1A1A1A","--dsw-alias-brand-primary-invert":"#FFFFFF","--dsw-alias-brand-primary-new-colorprimary-new-color":"#1A1A1A","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#1A1A1A","--dsw-alias-button-primary-hover":"#000000","--dsw-alias-button-primary-dimmed":"rgba(0, 0, 0, 0.05)","--dsw-alias-button-elevated-fill":"#F7F7F8","--dsw-alias-button-floating-fill":"#F7F7F8","--dsw-alias-button-floating-hover":"#ECECED","--dsw-alias-button-ghost-active-border":"#1A1A1A","--dsw-alias-button-ghost-active-fill":"rgba(0, 0, 0, 0.05)","--dsw-alias-button-ghost-active-hover":"rgba(26, 26, 26, 0.16)","--dsw-alias-button-contrast-fill":"#1A1A1A","--dsw-alias-button-info-fill":"#1A1A1A","--dsw-alias-button-info-hover":"#000000","--dsw-alias-button-tool-bar-fill":"#F7F7F8","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(26, 26, 26, 0.06)","--dsw-alias-state-business-primary":"#1A1A1A","--dsw-alias-state-business-tertiary":"rgba(0, 0, 0, 0.05)","--dsw-alias-state-error-primary":"#8B3A3A","--dsw-alias-state-error-secondary":"rgba(139, 58, 58, 0.6)","--dsw-alias-state-success-primary":"#5CB85C","--dsw-alias-state-success-secondary":"rgba(92, 184, 92, 0.6)","--dsw-alias-state-success-tertiary":"rgba(92, 184, 92, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(26, 26, 26, 0.05)","--dsw-alias-interactive-bg-active":"rgba(26, 26, 26, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(26, 26, 26, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 58, 58, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(26, 26, 26, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(26, 26, 26, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(26, 26, 26, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(0, 0, 0, 0.05)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#999999","--dsw-alias-markdown-tag":"rgba(0, 0, 0, 0.05)","--dsw-alias-toast-bg":"#F7F7F8","--dsw-alias-tooltip-bg":"#1A1A1A","--dsw-alias-scrollbar-bg-l1":"rgba(26, 26, 26, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(26, 26, 26, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(26, 26, 26, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(26, 26, 26, 0.22)","--dsw-specific-sidebar-fill":"#F0F0F0","--dsw-specific-sidebar-nav-item-active":"rgba(0, 0, 0, 0.05)","--dsw-specific-sidebar-nav-item-active-accent":"#1A1A1A","--dsw-specific-sidebar-nav-item-hover":"rgba(26, 26, 26, 0.05)","--dsw-specific-bubble":"rgba(0, 0, 0, 0.035)","--dsw-specific-bubble-highlight":"rgba(26, 26, 26, 0.2)","--dsw-specific-input-major":"#F7F7F8","--dsw-specific-login-input":"#F7F7F8","--dsw-specific-menu":"#F7F7F8","--dsw-specific-selector":"#F7F7F8","--dsw-specific-tip":"#F7F7F8","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#1A1A1A","--shiki-token-constant":"#1A1A1A","--shiki-token-string":"#5CB85C","--shiki-token-comment":"rgba(153, 153, 153, 0.9)","--shiki-token-keyword":"#1A1A1A","--shiki-token-parameter":"#6E6E6E","--shiki-token-function":"#1A1A1A","--shiki-token-string-expression":"#5CB85C","--shiki-token-punctuation":"#999999","--shiki-token-link":"#1A1A1A","--shiki-token-inserted":"#5CB85C","--shiki-token-deleted":"#8B3A3A","--shiki-token-changed":"#B0802A"}},{"id":"hana-deep-think","name":"用户彻底怒了","mode":"小鲸鱼","colorScheme":"light","pageColor":"#FCFCFD","tokens":{"--dsw-alias-bg-base":"#FCFCFD","--dsw-alias-bg-layer-1":"#F8F8FA","--dsw-alias-bg-layer-2":"#F9F9FB","--dsw-alias-bg-layer-3":"#FAFAFB","--dsw-alias-bg-overlay":"#F8F8FA","--dsw-alias-bg-module-platform":"#FCFCFD","--dsw-alias-bg-multi-select":"rgba(99, 106, 232, 0.06)","--dsw-alias-bg-skeleton":"rgba(29, 29, 31, 0.08)","--dsw-alias-bg-mask-1":"rgba(252, 252, 253, 0.35)","--dsw-alias-bg-mask-2":"rgba(252, 252, 253, 0.6)","--dsw-alias-bg-mask-3":"rgba(252, 252, 253, 0.78)","--dsw-alias-bg-mask-photo":"rgba(252, 252, 253, 0.55)","--dsw-alias-bg-mask-drop":"rgba(252, 252, 253, 0.75)","--dsw-alias-border-l1":"rgba(0, 0, 0, 0.09)","--dsw-alias-border-l2":"rgba(0, 0, 0, 0.09)","--dsw-alias-border-l3":"#050506","--dsw-alias-border-l4":"#09090A","--dsw-alias-border-l2-darkmode-thin":"rgba(0, 0, 0, 0.09)","--dsw-alias-border-inverted":"#FCFCFD","--dsw-alias-border-inverted2":"#FCFCFD","--dsw-alias-separator-primary":"rgba(0, 0, 0, 0.09)","--dsw-alias-label-primary":"#1D1D1F","--dsw-alias-label-secondary":"#65656B","--dsw-alias-label-tertiary":"#95959C","--dsw-alias-label-caption":"#95959C","--dsw-alias-label-dimmed":"rgba(149, 149, 156, 0.75)","--dsw-alias-label-primary-bluish":"#1D1D1F","--dsw-alias-label-primary-dimmed":"#65656B","--dsw-alias-label-primary-foreground":"#FCFCFD","--dsw-alias-label-primary-inverted":"#FCFCFD","--dsw-alias-brand-primary":"#636AE8","--dsw-alias-brand-primary-invert":"#FCFCFD","--dsw-alias-brand-primary-new-colorprimary-new-color":"#636AE8","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#636AE8","--dsw-alias-button-primary-hover":"#5158D4","--dsw-alias-button-primary-dimmed":"rgba(99, 106, 232, 0.06)","--dsw-alias-button-elevated-fill":"#F8F8FA","--dsw-alias-button-floating-fill":"#F8F8FA","--dsw-alias-button-floating-hover":"#EDEDEF","--dsw-alias-button-ghost-active-border":"#636AE8","--dsw-alias-button-ghost-active-fill":"rgba(99, 106, 232, 0.06)","--dsw-alias-button-ghost-active-hover":"rgba(99, 106, 232, 0.16)","--dsw-alias-button-contrast-fill":"#1D1D1F","--dsw-alias-button-info-fill":"#636AE8","--dsw-alias-button-info-hover":"#5158D4","--dsw-alias-button-tool-bar-fill":"#F8F8FA","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(29, 29, 31, 0.06)","--dsw-alias-state-business-primary":"#636AE8","--dsw-alias-state-business-tertiary":"rgba(99, 106, 232, 0.06)","--dsw-alias-state-error-primary":"#8B3A3A","--dsw-alias-state-error-secondary":"rgba(139, 58, 58, 0.6)","--dsw-alias-state-success-primary":"#34A853","--dsw-alias-state-success-secondary":"rgba(52, 168, 83, 0.6)","--dsw-alias-state-success-tertiary":"rgba(52, 168, 83, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(29, 29, 31, 0.05)","--dsw-alias-interactive-bg-active":"rgba(29, 29, 31, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(99, 106, 232, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 58, 58, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(29, 29, 31, 0.08)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(29, 29, 31, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(29, 29, 31, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(99, 106, 232, 0.06)","--dsw-alias-markdown-inline-code":"rgba(0, 0, 0, 0.03)","--dsw-alias-markdown-placeholder":"#95959C","--dsw-alias-markdown-tag":"rgba(99, 106, 232, 0.06)","--dsw-alias-toast-bg":"#F8F8FA","--dsw-alias-tooltip-bg":"#1D1D1F","--dsw-alias-scrollbar-bg-l1":"rgba(29, 29, 31, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(29, 29, 31, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(29, 29, 31, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(29, 29, 31, 0.22)","--dsw-specific-sidebar-fill":"#F0F0F2","--dsw-specific-sidebar-nav-item-active":"rgba(99, 106, 232, 0.06)","--dsw-specific-sidebar-nav-item-active-accent":"#636AE8","--dsw-specific-sidebar-nav-item-hover":"rgba(29, 29, 31, 0.05)","--dsw-specific-bubble":"rgba(0, 0, 0, 0.035)","--dsw-specific-bubble-highlight":"rgba(99, 106, 232, 0.2)","--dsw-specific-input-major":"#F8F8FA","--dsw-specific-login-input":"#F8F8FA","--dsw-specific-menu":"#F8F8FA","--dsw-specific-selector":"#F8F8FA","--dsw-specific-tip":"#F8F8FA","--shiki-background":"rgba(0, 0, 0, 0.03)","--shiki-foreground":"#1D1D1F","--shiki-token-constant":"#636AE8","--shiki-token-string":"#34A853","--shiki-token-comment":"rgba(149, 149, 156, 0.9)","--shiki-token-keyword":"#5C62D4","--shiki-token-parameter":"#65656B","--shiki-token-function":"#6066DE","--shiki-token-string-expression":"#34A853","--shiki-token-punctuation":"#95959C","--shiki-token-link":"#636AE8","--shiki-token-inserted":"#34A853","--shiki-token-deleted":"#8B3A3A","--shiki-token-changed":"#B0802A"}},{"id":"hana-new-warm-paper","name":"新暖纸","mode":"纸本","colorScheme":"light","pageColor":"#F5EFE4","tokens":{"--dsw-alias-bg-base":"#F5EFE4","--dsw-alias-bg-layer-1":"#FBF7EE","--dsw-alias-bg-layer-2":"#FAF5EC","--dsw-alias-bg-layer-3":"#F9F4EA","--dsw-alias-bg-overlay":"#FBF7EE","--dsw-alias-bg-module-platform":"#F5EFE4","--dsw-alias-bg-multi-select":"rgba(83, 125, 150, 0.08)","--dsw-alias-bg-skeleton":"rgba(42, 38, 34, 0.08)","--dsw-alias-bg-mask-1":"rgba(245, 239, 228, 0.35)","--dsw-alias-bg-mask-2":"rgba(245, 239, 228, 0.6)","--dsw-alias-bg-mask-3":"rgba(245, 239, 228, 0.78)","--dsw-alias-bg-mask-photo":"rgba(245, 239, 228, 0.55)","--dsw-alias-bg-mask-drop":"rgba(245, 239, 228, 0.75)","--dsw-alias-border-l1":"#D8CFBE","--dsw-alias-border-l2":"#D8CFBE","--dsw-alias-border-l3":"#B9B1A2","--dsw-alias-border-l4":"#A0998C","--dsw-alias-border-l2-darkmode-thin":"#D8CFBE","--dsw-alias-border-inverted":"#F5EFE4","--dsw-alias-border-inverted2":"#F5EFE4","--dsw-alias-separator-primary":"#D8CFBE","--dsw-alias-label-primary":"#2A2622","--dsw-alias-label-secondary":"#4A433C","--dsw-alias-label-tertiary":"#6B6158","--dsw-alias-label-caption":"#6B6158","--dsw-alias-label-dimmed":"rgba(107, 97, 88, 0.75)","--dsw-alias-label-primary-bluish":"#2A2622","--dsw-alias-label-primary-dimmed":"#4A433C","--dsw-alias-label-primary-foreground":"#F5EFE4","--dsw-alias-label-primary-inverted":"#F5EFE4","--dsw-alias-brand-primary":"#537D96","--dsw-alias-brand-primary-invert":"#F5EFE4","--dsw-alias-brand-primary-new-colorprimary-new-color":"#537D96","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#537D96","--dsw-alias-button-primary-hover":"#3F6179","--dsw-alias-button-primary-dimmed":"rgba(83, 125, 150, 0.08)","--dsw-alias-button-elevated-fill":"#FBF7EE","--dsw-alias-button-floating-fill":"#FBF7EE","--dsw-alias-button-floating-hover":"#F1EDE4","--dsw-alias-button-ghost-active-border":"#537D96","--dsw-alias-button-ghost-active-fill":"rgba(83, 125, 150, 0.08)","--dsw-alias-button-ghost-active-hover":"rgba(83, 125, 150, 0.16)","--dsw-alias-button-contrast-fill":"#2A2622","--dsw-alias-button-info-fill":"#537D96","--dsw-alias-button-info-hover":"#3F6179","--dsw-alias-button-tool-bar-fill":"#FBF7EE","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(42, 38, 34, 0.06)","--dsw-alias-state-business-primary":"#537D96","--dsw-alias-state-business-tertiary":"rgba(83, 125, 150, 0.08)","--dsw-alias-state-error-primary":"#8B2C1F","--dsw-alias-state-error-secondary":"rgba(139, 44, 31, 0.6)","--dsw-alias-state-success-primary":"#4A6B4A","--dsw-alias-state-success-secondary":"rgba(74, 107, 74, 0.6)","--dsw-alias-state-success-tertiary":"rgba(74, 107, 74, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(42, 38, 34, 0.05)","--dsw-alias-interactive-bg-active":"rgba(42, 38, 34, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(83, 125, 150, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(139, 44, 31, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(42, 38, 34, 0.08)","--dsw-alias-markdown-code-block":"rgba(42, 38, 34, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(42, 38, 34, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(42, 38, 34, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(83, 125, 150, 0.08)","--dsw-alias-markdown-inline-code":"rgba(42, 38, 34, 0.03)","--dsw-alias-markdown-placeholder":"#6B6158","--dsw-alias-markdown-tag":"rgba(83, 125, 150, 0.08)","--dsw-alias-toast-bg":"#FBF7EE","--dsw-alias-tooltip-bg":"#2A2622","--dsw-alias-scrollbar-bg-l1":"rgba(42, 38, 34, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(42, 38, 34, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(42, 38, 34, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(42, 38, 34, 0.22)","--dsw-specific-sidebar-fill":"#EFE8DB","--dsw-specific-sidebar-nav-item-active":"rgba(83, 125, 150, 0.08)","--dsw-specific-sidebar-nav-item-active-accent":"#537D96","--dsw-specific-sidebar-nav-item-hover":"rgba(42, 38, 34, 0.05)","--dsw-specific-bubble":"rgba(83, 125, 150, 0.08)","--dsw-specific-bubble-highlight":"rgba(83, 125, 150, 0.2)","--dsw-specific-input-major":"#FBF7EE","--dsw-specific-login-input":"#FBF7EE","--dsw-specific-menu":"#FBF7EE","--dsw-specific-selector":"#FBF7EE","--dsw-specific-tip":"#FBF7EE","--shiki-background":"rgba(42, 38, 34, 0.03)","--shiki-foreground":"#2A2622","--shiki-token-constant":"#537D96","--shiki-token-string":"#4A6B4A","--shiki-token-comment":"rgba(107, 97, 88, 0.9)","--shiki-token-keyword":"#4F748A","--shiki-token-parameter":"#4A433C","--shiki-token-function":"#517990","--shiki-token-string-expression":"#4A6B4A","--shiki-token-punctuation":"#6B6158","--shiki-token-link":"#537D96","--shiki-token-inserted":"#4A6B4A","--shiki-token-deleted":"#8B2C1F","--shiki-token-changed":"#B0802A"}},{"id":"hana-midnight-contrast","name":"青夜·高对比","mode":"清晰","colorScheme":"dark","pageColor":"#26343D","tokens":{"--dsw-alias-bg-base":"#26343D","--dsw-alias-bg-layer-1":"#30414B","--dsw-alias-bg-layer-2":"#2F3F49","--dsw-alias-bg-layer-3":"#2E3E48","--dsw-alias-bg-overlay":"#30414B","--dsw-alias-bg-module-platform":"#26343D","--dsw-alias-bg-multi-select":"rgba(230, 177, 196, 0.14)","--dsw-alias-bg-skeleton":"rgba(240, 246, 250, 0.08)","--dsw-alias-bg-mask-1":"rgba(38, 52, 61, 0.35)","--dsw-alias-bg-mask-2":"rgba(38, 52, 61, 0.6)","--dsw-alias-bg-mask-3":"rgba(38, 52, 61, 0.78)","--dsw-alias-bg-mask-photo":"rgba(38, 52, 61, 0.55)","--dsw-alias-bg-mask-drop":"rgba(38, 52, 61, 0.75)","--dsw-alias-border-l1":"rgba(230, 177, 196, 0.26)","--dsw-alias-border-l2":"rgba(230, 177, 196, 0.26)","--dsw-alias-border-l3":"#E8BDCE","--dsw-alias-border-l4":"#E9C7D5","--dsw-alias-border-l2-darkmode-thin":"rgba(230, 177, 196, 0.26)","--dsw-alias-border-inverted":"#26343D","--dsw-alias-border-inverted2":"#26343D","--dsw-alias-separator-primary":"rgba(230, 177, 196, 0.26)","--dsw-alias-label-primary":"#F0F6FA","--dsw-alias-label-secondary":"#D3E0E8","--dsw-alias-label-tertiary":"#B7C8D3","--dsw-alias-label-caption":"#B7C8D3","--dsw-alias-label-dimmed":"rgba(183, 200, 211, 0.75)","--dsw-alias-label-primary-bluish":"#F0F6FA","--dsw-alias-label-primary-dimmed":"#D3E0E8","--dsw-alias-label-primary-foreground":"#26343D","--dsw-alias-label-primary-inverted":"#26343D","--dsw-alias-brand-primary":"#E6B1C4","--dsw-alias-brand-primary-invert":"#26343D","--dsw-alias-brand-primary-new-colorprimary-new-color":"#E6B1C4","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#E6B1C4","--dsw-alias-button-primary-hover":"#F0C4D3","--dsw-alias-button-primary-dimmed":"rgba(230, 177, 196, 0.14)","--dsw-alias-button-elevated-fill":"#30414B","--dsw-alias-button-floating-fill":"#30414B","--dsw-alias-button-floating-hover":"#3A4A54","--dsw-alias-button-ghost-active-border":"#E6B1C4","--dsw-alias-button-ghost-active-fill":"rgba(230, 177, 196, 0.14)","--dsw-alias-button-ghost-active-hover":"rgba(230, 177, 196, 0.16)","--dsw-alias-button-contrast-fill":"#F0F6FA","--dsw-alias-button-info-fill":"#E6B1C4","--dsw-alias-button-info-hover":"#F0C4D3","--dsw-alias-button-tool-bar-fill":"#30414B","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(240, 246, 250, 0.06)","--dsw-alias-state-business-primary":"#E6B1C4","--dsw-alias-state-business-tertiary":"rgba(230, 177, 196, 0.14)","--dsw-alias-state-error-primary":"#E28B8B","--dsw-alias-state-error-secondary":"rgba(226, 139, 139, 0.6)","--dsw-alias-state-success-primary":"#A8DDAA","--dsw-alias-state-success-secondary":"rgba(168, 221, 170, 0.6)","--dsw-alias-state-success-tertiary":"rgba(168, 221, 170, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(240, 246, 250, 0.05)","--dsw-alias-interactive-bg-active":"rgba(240, 246, 250, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(230, 177, 196, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(226, 139, 139, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(240, 246, 250, 0.08)","--dsw-alias-markdown-code-block":"rgba(255, 255, 255, 0.04)","--dsw-alias-markdown-code-block-banner":"rgba(240, 246, 250, 0.06)","--dsw-alias-markdown-code-segment-selected":"rgba(240, 246, 250, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(230, 177, 196, 0.14)","--dsw-alias-markdown-inline-code":"rgba(255, 255, 255, 0.04)","--dsw-alias-markdown-placeholder":"#B7C8D3","--dsw-alias-markdown-tag":"rgba(230, 177, 196, 0.14)","--dsw-alias-toast-bg":"#30414B","--dsw-alias-tooltip-bg":"#30414B","--dsw-alias-scrollbar-bg-l1":"rgba(240, 246, 250, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(240, 246, 250, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(240, 246, 250, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(240, 246, 250, 0.22)","--dsw-specific-sidebar-fill":"#202C34","--dsw-specific-sidebar-nav-item-active":"rgba(230, 177, 196, 0.14)","--dsw-specific-sidebar-nav-item-active-accent":"#E6B1C4","--dsw-specific-sidebar-nav-item-hover":"rgba(240, 246, 250, 0.05)","--dsw-specific-bubble":"rgba(230, 177, 196, 0.15)","--dsw-specific-bubble-highlight":"rgba(230, 177, 196, 0.2)","--dsw-specific-input-major":"#30414B","--dsw-specific-login-input":"#30414B","--dsw-specific-menu":"#30414B","--dsw-specific-selector":"#30414B","--dsw-specific-tip":"#30414B","--shiki-background":"rgba(255, 255, 255, 0.04)","--shiki-foreground":"#F0F6FA","--shiki-token-constant":"#E6B1C4","--shiki-token-string":"#A8DDAA","--shiki-token-comment":"rgba(183, 200, 211, 0.9)","--shiki-token-keyword":"#E9C2D2","--shiki-token-parameter":"#D3E0E8","--shiki-token-function":"#E8BBCC","--shiki-token-string-expression":"#A8DDAA","--shiki-token-punctuation":"#B7C8D3","--shiki-token-link":"#E6B1C4","--shiki-token-inserted":"#A8DDAA","--shiki-token-deleted":"#E28B8B","--shiki-token-changed":"#B0802A"}},{"id":"hana-coral","name":"珊瑚","mode":"春日和纸","colorScheme":"light","pageColor":"#FDF6EC","tokens":{"--dsw-alias-bg-base":"#FDF6EC","--dsw-alias-bg-layer-1":"#FFFBF3","--dsw-alias-bg-layer-2":"#FFFAF2","--dsw-alias-bg-layer-3":"#FEF9F0","--dsw-alias-bg-overlay":"#FFFBF3","--dsw-alias-bg-module-platform":"#FDF6EC","--dsw-alias-bg-multi-select":"rgba(26, 48, 73, 0.07)","--dsw-alias-bg-skeleton":"rgba(26, 48, 73, 0.08)","--dsw-alias-bg-mask-1":"rgba(253, 246, 236, 0.35)","--dsw-alias-bg-mask-2":"rgba(253, 246, 236, 0.6)","--dsw-alias-bg-mask-3":"rgba(253, 246, 236, 0.78)","--dsw-alias-bg-mask-photo":"rgba(253, 246, 236, 0.55)","--dsw-alias-bg-mask-drop":"rgba(253, 246, 236, 0.75)","--dsw-alias-border-l1":"rgba(243, 126, 99, 0.18)","--dsw-alias-border-l2":"rgba(243, 126, 99, 0.18)","--dsw-alias-border-l3":"#CC705E","--dsw-alias-border-l4":"#AE655B","--dsw-alias-border-l2-darkmode-thin":"rgba(243, 126, 99, 0.18)","--dsw-alias-border-inverted":"#FDF6EC","--dsw-alias-border-inverted2":"#FDF6EC","--dsw-alias-separator-primary":"rgba(243, 126, 99, 0.18)","--dsw-alias-label-primary":"#1A3049","--dsw-alias-label-secondary":"#314153","--dsw-alias-label-tertiary":"#727F89","--dsw-alias-label-caption":"#727F89","--dsw-alias-label-dimmed":"rgba(114, 127, 137, 0.75)","--dsw-alias-label-primary-bluish":"#1A3049","--dsw-alias-label-primary-dimmed":"#314153","--dsw-alias-label-primary-foreground":"#FDF6EC","--dsw-alias-label-primary-inverted":"#FDF6EC","--dsw-alias-brand-primary":"#1A3049","--dsw-alias-brand-primary-invert":"#FDF6EC","--dsw-alias-brand-primary-new-colorprimary-new-color":"#1A3049","--dsw-alias-brand-text":"#FFFFFF","--dsw-alias-button-primary-fill":"#1A3049","--dsw-alias-button-primary-hover":"#243A55","--dsw-alias-button-primary-dimmed":"rgba(26, 48, 73, 0.07)","--dsw-alias-button-elevated-fill":"#FFFBF3","--dsw-alias-button-floating-fill":"#FFFBF3","--dsw-alias-button-floating-hover":"#F4F1EB","--dsw-alias-button-ghost-active-border":"#1A3049","--dsw-alias-button-ghost-active-fill":"rgba(26, 48, 73, 0.07)","--dsw-alias-button-ghost-active-hover":"rgba(26, 48, 73, 0.16)","--dsw-alias-button-contrast-fill":"#1A3049","--dsw-alias-button-info-fill":"#1A3049","--dsw-alias-button-info-hover":"#243A55","--dsw-alias-button-tool-bar-fill":"#FFFBF3","--dsw-alias-button-tool-bar-fill-invisible":"transparent","--dsw-alias-button-tool-bar-hover":"rgba(26, 48, 73, 0.06)","--dsw-alias-state-business-primary":"#1A3049","--dsw-alias-state-business-tertiary":"rgba(26, 48, 73, 0.07)","--dsw-alias-state-error-primary":"#A3483B","--dsw-alias-state-error-secondary":"rgba(163, 72, 59, 0.6)","--dsw-alias-state-success-primary":"#6E8C7A","--dsw-alias-state-success-secondary":"rgba(110, 140, 122, 0.6)","--dsw-alias-state-success-tertiary":"rgba(110, 140, 122, 0.16)","--dsw-alias-state-warn-label":"#B0802A","--dsw-alias-state-warn-primary":"#B0802A","--dsw-alias-state-warn-secondary":"rgba(176, 128, 42, 0.6)","--dsw-alias-state-warn-tertiary":"rgba(176, 128, 42, 0.16)","--dsw-alias-interactive-bg-hover":"rgba(26, 48, 73, 0.05)","--dsw-alias-interactive-bg-active":"rgba(26, 48, 73, 0.09)","--dsw-alias-interactive-bg-hover-accent":"rgba(26, 48, 73, 0.1)","--dsw-alias-interactive-bg-hover-danger":"rgba(163, 72, 59, 0.1)","--dsw-alias-interactive-bg-hover-solid":"rgba(26, 48, 73, 0.08)","--dsw-alias-markdown-code-block":"rgba(26, 48, 73, 0.03)","--dsw-alias-markdown-code-block-banner":"rgba(26, 48, 73, 0.04)","--dsw-alias-markdown-code-segment-selected":"rgba(26, 48, 73, 0.1)","--dsw-alias-markdown-code-segment-unselected":"transparent","--dsw-alias-markdown-citation":"rgba(26, 48, 73, 0.07)","--dsw-alias-markdown-inline-code":"rgba(26, 48, 73, 0.03)","--dsw-alias-markdown-placeholder":"#727F89","--dsw-alias-markdown-tag":"rgba(26, 48, 73, 0.07)","--dsw-alias-toast-bg":"#FFFBF3","--dsw-alias-tooltip-bg":"#1A3049","--dsw-alias-scrollbar-bg-l1":"rgba(26, 48, 73, 0.08)","--dsw-alias-scrollbar-bg-l2":"rgba(26, 48, 73, 0.12)","--dsw-alias-scrollbar-hover-l1":"rgba(26, 48, 73, 0.16)","--dsw-alias-scrollbar-hover-l2":"rgba(26, 48, 73, 0.22)","--dsw-specific-sidebar-fill":"#FCF1E4","--dsw-specific-sidebar-nav-item-active":"rgba(26, 48, 73, 0.07)","--dsw-specific-sidebar-nav-item-active-accent":"#1A3049","--dsw-specific-sidebar-nav-item-hover":"rgba(26, 48, 73, 0.05)","--dsw-specific-bubble":"rgba(26, 48, 73, 0.07)","--dsw-specific-bubble-highlight":"rgba(26, 48, 73, 0.2)","--dsw-specific-input-major":"#FFFBF3","--dsw-specific-login-input":"#FFFBF3","--dsw-specific-menu":"#FFFBF3","--dsw-specific-selector":"#FFFBF3","--dsw-specific-tip":"#FFFBF3","--shiki-background":"rgba(26, 48, 73, 0.03)","--shiki-foreground":"#1A3049","--shiki-token-constant":"#1A3049","--shiki-token-string":"#6E8C7A","--shiki-token-comment":"rgba(114, 127, 137, 0.9)","--shiki-token-keyword":"#1A3049","--shiki-token-parameter":"#314153","--shiki-token-function":"#1A3049","--shiki-token-string-expression":"#6E8C7A","--shiki-token-punctuation":"#727F89","--shiki-token-link":"#1A3049","--shiki-token-inserted":"#6E8C7A","--shiki-token-deleted":"#A3483B","--shiki-token-changed":"#B0802A"}}];
		const THEME_BY_ID = new Map(THEMES.map((theme) => [theme.id, theme]));
		const AUTO_LIGHT = THEMES.find((theme) => theme.id === "hana-warm-paper")?.pageColor ?? "#F8F4ED";
		const AUTO_DARK = THEMES.find((theme) => theme.id === "hana-midnight")?.pageColor ?? "#3B4A54";

		/** Static page stylesheet, ported from HanaAgent's settings components. */
		const PAGE_CSS = "﻿/* HanaUI page 鈥?ported from HanaAgent's settings styles.\n * Source: openhanako desktop/src/react/settings/components/settings-components.module.css\n * and desktop/src/react/settings/Settings.module.css (Apache-2.0).\n * Every selector is scoped under .hana-ui-page; Hana's own CSS variables are\n * bound to DeepSeek Harness --dsw-* tokens here so the page follows the active\n * theme. */\n\n.hana-ui-page {\n    --bg: var(--dsw-alias-bg-base, #f8f4ed);\n    --bg-card: var(--dsw-alias-bg-layer-1, #fbf7ee);\n    --text: var(--dsw-alias-label-primary, #2a2622);\n    --text-light: var(--dsw-alias-label-secondary, #4a433c);\n    --text-muted: var(--dsw-alias-label-tertiary, #6b6158);\n    --border: var(--dsw-alias-border-l2, #d8cfbe);\n    --border-width: 1px;\n    --accent: var(--dsw-alias-brand-primary, #537d96);\n    --danger: var(--dsw-alias-state-error-primary, #8b2c1f);\n    --overlay-light: var(--dsw-alias-interactive-bg-hover, rgba(42, 38, 34, 0.05));\n    --radius-card: 10px;\n    --radius-input: 6px;\n    --space-4: 4px;\n    --space-8: 8px;\n    --space-12: 12px;\n    --space-16: 16px;\n    --space-24: 24px;\n    --space-32: 32px;\n    --space-40: 40px;\n    --fs-title: 14px;\n    --fs-body: 13px;\n    --fs-caption: 12px;\n    --fs-hint: 11px;\n    --fs-ui: 13px;\n    --duration-fast: 120ms;\n    --duration-slow: 200ms;\n    --ease-out: ease;\n\n    width: 100%;\n    max-width: 780px;\n    min-width: 0;\n    padding-bottom: var(--space-32);\n    color: var(--text);\n    font-size: var(--fs-body);\n}\n\n/* 鈹€鈹€鈹€ Section 鈹€鈹€鈹€ */\n.hana-ui-page .hana-section {\n    margin-bottom: var(--space-40);\n}\n.hana-ui-page .hana-section:last-child {\n    margin-bottom: 0;\n}\n.hana-ui-page .hana-section-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: var(--space-16);\n    margin-bottom: var(--space-16);\n}\n.hana-ui-page .hana-section-header.has-description {\n    margin-bottom: var(--space-4);\n}\n.hana-ui-page .hana-section-title {\n    font-size: var(--fs-title);\n    font-weight: 600;\n    color: var(--text);\n    letter-spacing: 0.05em;\n    margin: 0;\n}\n.hana-ui-page .hana-section-description {\n    margin: 0 0 var(--space-16);\n    color: var(--text-muted);\n    font-size: var(--fs-caption);\n    line-height: 1.5;\n}\n.hana-ui-page .hana-surface-card {\n    display: flex;\n    flex-direction: column;\n    background: var(--bg-card);\n    border: var(--border-width) solid var(--border);\n    border-radius: var(--radius-card);\n}\n.hana-ui-page .hana-surface-body {\n    display: flex;\n    flex-direction: column;\n}\n\n/* 鈹€鈹€鈹€ Grid 鈹€鈹€鈹€ */\n.hana-ui-page .hana-grid {\n    display: grid;\n    min-width: 0;\n}\n.hana-ui-page .hana-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.hana-ui-page .hana-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.hana-ui-page .hana-gap-sm { gap: var(--space-8); }\n.hana-ui-page .hana-gap-md { gap: var(--space-16); }\n\n/* 鈹€鈹€鈹€ Row 鈹€鈹€鈹€ */\n.hana-ui-page .hana-row {\n    padding: var(--space-8) var(--space-16);\n    position: relative;\n}\n.hana-ui-page .hana-row + .hana-row::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: var(--border-width);\n    background: var(--border);\n}\n.hana-ui-page .hana-row-inline {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: var(--space-16);\n}\n.hana-ui-page .hana-row-stacked {\n    display: flex;\n    flex-direction: column;\n    gap: var(--space-16);\n}\n.hana-ui-page .hana-row-text {\n    display: flex;\n    flex-direction: column;\n    gap: 2px;\n    flex: 1;\n    min-width: 0;\n}\n.hana-ui-page .hana-row-label {\n    font-size: var(--fs-body);\n    color: var(--text);\n    font-weight: 500;\n}\n.hana-ui-page .hana-row-hint {\n    font-size: var(--fs-hint);\n    color: var(--text-muted);\n    line-height: 1.4;\n}\n.hana-ui-page .hana-row-control {\n    flex-shrink: 0;\n    display: flex;\n    align-items: center;\n    gap: var(--space-8);\n}\n\n/* Plain surface rows: no card inset, no divider */\n.hana-ui-page .hana-section-plain .hana-surface-body > .hana-row {\n    padding-left: 0;\n    padding-right: 0;\n}\n.hana-ui-page .hana-section-plain .hana-surface-body > .hana-row + .hana-row::before {\n    display: none;\n}\n\n/* 鈹€鈹€鈹€ Theme cards (Settings.module.css .theme-options / .theme-card) 鈹€鈹€鈹€ */\n.hana-ui-page .hana-theme-options {\n    gap: var(--space-8);\n}\n.hana-ui-page .hana-theme-card {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 3px;\n    min-height: 64px;\n    padding: var(--space-8);\n    border-radius: var(--radius-card);\n    border: 2px solid transparent;\n    cursor: pointer;\n    font-family: inherit;\n    transition:\n        transform var(--duration-fast) var(--ease-out),\n        box-shadow var(--duration-fast) var(--ease-out),\n        border-color var(--duration-fast) var(--ease-out);\n}\n.hana-ui-page .hana-theme-card:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n.hana-ui-page .hana-theme-card.is-active {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);\n}\n.hana-ui-page .hana-theme-card-name {\n    font-size: 13px;\n    font-weight: 600;\n    line-height: 1.3;\n}\n.hana-ui-page .hana-theme-card-mode {\n    font-size: 11px;\n    line-height: 1.3;\n    opacity: 0.7;\n}\n\n/* 鈹€鈹€鈹€ Font cards (Settings.module.css .font-options / .font-card) 鈹€鈹€鈹€ */\n.hana-ui-page .hana-font-options {\n    margin-bottom: var(--space-16);\n}\n.hana-ui-page .hana-font-card {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 4px;\n    min-height: 84px;\n    padding: var(--space-12) var(--space-16);\n    background: var(--bg-card);\n    border: var(--border-width) solid var(--border);\n    border-radius: var(--radius-card);\n    cursor: pointer;\n    font-family: inherit;\n    color: var(--text);\n    transition:\n        border-color var(--duration-fast) var(--ease-out),\n        box-shadow var(--duration-fast) var(--ease-out);\n}\n.hana-ui-page .hana-font-card:hover {\n    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));\n}\n.hana-ui-page .hana-font-card.is-active {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);\n}\n.hana-ui-page .hana-font-card-sample {\n    font-size: 18px;\n    line-height: 1.5;\n    color: var(--text);\n    letter-spacing: 0.02em;\n}\n.hana-ui-page .hana-font-card-name {\n    font-size: var(--fs-body);\n    font-weight: 600;\n}\n.hana-ui-page .hana-font-card-desc {\n    font-size: var(--fs-hint);\n    color: var(--text-muted);\n    line-height: 1.4;\n}\n\n/* 鈹€鈹€鈹€ Segmented control (texture modes / strength) 鈹€鈹€鈹€ */\n.hana-ui-page .hana-segmented {\n    display: inline-flex;\n    align-items: center;\n    gap: 2px;\n    padding: 2px;\n    border-radius: var(--radius-input);\n    background: var(--dsw-alias-bg-layer-2, rgba(42, 38, 34, 0.04));\n}\n.hana-ui-page .hana-segmented-btn {\n    border: none;\n    background: transparent;\n    color: var(--text-muted);\n    font-family: inherit;\n    font-size: var(--fs-body);\n    line-height: 1.4;\n    padding: 4px 10px;\n    border-radius: calc(var(--radius-input) - 2px);\n    cursor: pointer;\n    transition:\n        background var(--duration-fast) var(--ease-out),\n        color var(--duration-fast) var(--ease-out);\n}\n.hana-ui-page .hana-segmented-btn:hover {\n    color: var(--text);\n}\n.hana-ui-page .hana-segmented-btn.is-active {\n    background: var(--bg-card);\n    color: var(--text);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);\n}\n.hana-ui-page .hana-segmented.hana-segmented-small .hana-segmented-btn {\n    min-width: 26px;\n    padding: 3px 6px;\n    text-align: center;\n}\n\n/* 鈹€鈹€鈹€ Footer / reset 鈹€鈹€鈹€ */\n.hana-ui-page .hana-page-footer {\n    display: flex;\n    justify-content: flex-end;\n    margin-top: var(--space-8);\n}\n.hana-ui-page .hana-reset-button {\n    border: none;\n    background: transparent;\n    color: var(--text-muted);\n    font-family: inherit;\n    font-size: var(--fs-caption);\n    cursor: pointer;\n    padding: 4px 6px;\n    border-radius: var(--radius-input);\n    transition: color var(--duration-fast) var(--ease-out);\n}\n.hana-ui-page .hana-reset-button:hover {\n    color: var(--text);\n}\n\n/* ═══════════════════════════════════════════\n * Paper texture layer — ported 1:1 from HanaAgent's PaperTextureLayer\n * (CapabilitiesPanel CSS block + preview-paper-texture-preference module).\n * The three masks (mottle / fiber / grain) come from the same generated\n * paper textures shipped by HanaAgent; the hi/lo layers paint the surface\n * color lightened/darkened by --paper-texture-peak * strength, so the effect\n * is paper grain rather than a colour wash.\n * ═══════════════════════════════════════════ */\n\n.hana-paper-layer {\n    --paper-texture-peak: 0.09;\n    --paper-texture-mottle-tile: 1024px;\n    --paper-texture-fiber-tile: 720px;\n    --paper-texture-grain-tile: 256px;\n    --hana-paper-surface: var(--dsw-alias-bg-base, #F8F4ED);\n    position: fixed;\n    inset: 0;\n    z-index: 2147483000;\n    pointer-events: none;\n    display: none;\n}\nhtml[data-hana-paper-texture] .hana-paper-layer {\n    display: block;\n}\n.hana-paper-hi,\n.hana-paper-lo {\n    position: absolute;\n    inset: 0;\n    -webkit-mask-repeat: repeat;\n    mask-repeat: repeat;\n    -webkit-mask-composite: source-over;\n    mask-composite: add;\n    -webkit-mask-size: var(--paper-texture-mottle-tile), var(--paper-texture-fiber-tile),\n        var(--paper-texture-grain-tile);\n    mask-size: var(--paper-texture-mottle-tile), var(--paper-texture-fiber-tile),\n        var(--paper-texture-grain-tile);\n}\n.hana-paper-hi {\n    background: color-mix(in oklch, var(--hana-paper-surface), #ffffff 5%);\n    background: oklch(\n        from var(--hana-paper-surface)\n            calc(l + var(--paper-texture-peak) * var(--paper-texture-strength, 1)) c h\n    );\n}\n.hana-paper-lo {\n    background: color-mix(in oklch, var(--hana-paper-surface), #000000 5%);\n    background: oklch(\n        from var(--hana-paper-surface)\n            calc(l - var(--paper-texture-peak) * var(--paper-texture-strength, 1)) c h\n    );\n}\n\n/* rice (宣纸) */\nhtml[data-hana-paper-texture=\"rice\"] .hana-paper-hi {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-rice-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-rice-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n}\nhtml[data-hana-paper-texture=\"rice\"] .hana-paper-lo {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-rice-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-rice-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-rice-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n}\n\n/* cotton (棉纸) */\nhtml[data-hana-paper-texture=\"cotton\"] .hana-paper-hi {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n}\nhtml[data-hana-paper-texture=\"cotton\"] .hana-paper-lo {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-cotton-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n}\n\n/* fine (细颗粒) */\nhtml[data-hana-paper-texture=\"fine\"] .hana-paper-hi {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-fine-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-fine-mottle-hi.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-hi@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-hi@2x.png\") 2x\n        );\n}\nhtml[data-hana-paper-texture=\"fine\"] .hana-paper-lo {\n    -webkit-mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-fine-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n    mask-image: url(\"/plugins/dsh-hana-appearance/assets/paper-fine-mottle-lo.png\"),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-fine-fiber-lo@2x.png\") 2x\n        ),\n        image-set(\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@1x.png\") 1x,\n            url(\"/plugins/dsh-hana-appearance/assets/paper-grain-lo@2x.png\") 2x\n        );\n}\n/* StepSlider — 逐条移植自 HanaAgent 1.5.118 已安装版本的 SettingsModalShell 构建产物\n   （design tokens: space-24=1.5rem, space-4=.25rem, space-2=.125rem, radius-sm=5px,\n    fs-hint=.7rem, duration-paper-spring=.172s, ease-paper-spring=linear(...)，\n    颜色换成 HanaUI 的主题变量）。 */\n.hana-step-slider {\n  --hana-step-handle: 1.5rem;\n  --hana-step-track: 0.25rem;\n  --hana-step-inset: 1.5rem;\n  --hana-step-thumb: calc(var(--hana-step-inset) * 2);\n  --hana-step-border: 2px;\n  --hana-ease-paper-spring: linear(0, 0.01, 0.036, 0.075, 0.125, 0.182, 0.244, 0.309, 0.375, 0.441, 0.506, 0.568, 0.627, 0.682, 0.733, 0.78, 0.823, 0.862, 0.896, 0.925, 0.951, 0.974, 0.992, 1.008, 1.02, 1.03, 1.038, 1.043, 1.047, 1.049, 1.05, 1.05, 1.049, 1.047, 1.045, 1.042, 1.039, 1.036, 1.032, 1.029, 1.026, 1.022, 1.019, 1.017, 1.014, 1.012, 1.009, 1.007, 1);\n  width: 198px;\n  max-width: 100%;\n}\n.hana-step-rail { position: relative; isolation: isolate; height: var(--hana-step-handle); }\n.hana-step-underlay { position: absolute; inset: 0; z-index: 0; pointer-events: none; }\n.hana-step-segments {\n  position: absolute;\n  left: var(--hana-step-inset);\n  right: var(--hana-step-inset);\n  top: calc(var(--hana-step-handle) / 2 - var(--hana-step-track) / 2);\n  height: var(--hana-step-track);\n  display: flex;\n  gap: 0.125rem;\n}\n.hana-step-segment { flex: 1; border-radius: 999px; background: var(--hana-border); transition: background-color 0.15s ease; }\n.hana-step-segment[data-on=\"1\"] { background: var(--hana-accent); }\n.hana-step-input { width: 100%; height: var(--hana-step-handle); margin: 0; padding: 0; border: 0; appearance: none; -webkit-appearance: none; background: transparent; cursor: default; }\n.hana-step-input::-webkit-slider-runnable-track { height: var(--hana-step-track); background: transparent; }\n.hana-step-input::-webkit-slider-thumb {\n  appearance: none;\n  -webkit-appearance: none;\n  width: var(--hana-step-thumb);\n  height: var(--hana-step-handle);\n  margin-top: calc((var(--hana-step-track) - var(--hana-step-handle)) / 2);\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.hana-step-input::-moz-range-track { height: var(--hana-step-track); border: 0; background: transparent; }\n.hana-step-input::-moz-range-progress { background: transparent; }\n.hana-step-input::-moz-range-thumb { width: var(--hana-step-thumb); height: var(--hana-step-handle); border: 0; border-radius: 0; background: transparent; box-shadow: none; }\n.hana-step-handle-layer { position: absolute; top: 0; bottom: 0; left: var(--hana-step-inset); right: var(--hana-step-inset); pointer-events: none; }\n.hana-step-handle {\n  position: absolute;\n  top: 50%;\n  left: calc(var(--hana-step-progress, 0) * 100%);\n  transform: translate(-50%, -50%);\n  height: var(--hana-step-handle);\n  min-width: var(--hana-step-handle);\n  width: calc(var(--hana-step-label-width, 0px) + 0.25rem * 2 + var(--hana-step-border) * 2);\n  padding: 0 0.25rem;\n  border: var(--hana-step-border) solid var(--hana-card);\n  border-radius: calc(5px + 0.25rem);\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  background: var(--hana-accent);\n  color: var(--hana-on-accent, #fff);\n  font-size: 0.7rem;\n  line-height: 1;\n  font-variant-numeric: tabular-nums;\n}\n.hana-step-handle[data-animate-width] {\n  transition:\n    width 0.172s var(--hana-ease-paper-spring),\n    box-shadow 0.15s ease;\n}\n.hana-step-input:hover ~ .hana-step-handle-layer .hana-step-handle,\n.hana-step-input:focus-visible ~ .hana-step-handle-layer .hana-step-handle {\n  box-shadow:\n    0 1px 3px var(--hana-shadow, rgba(59, 61, 63, 0.09)),\n    0 0 0 4px color-mix(in srgb, var(--hana-accent) 16%, transparent);\n}\n.hana-step-value { display: grid; place-items: center; overflow: hidden; height: 1.15em; line-height: 1; }\n.hana-step-roll-layer { grid-area: 1 / 1; white-space: nowrap; will-change: transform, opacity; }\n.hana-step-sizer { position: absolute; top: 0; left: 0; white-space: nowrap; visibility: hidden; pointer-events: none; }\n@media (prefers-reduced-motion: reduce) {\n  .hana-step-segment { transition: none; }\n  .hana-step-handle[data-animate-width] { transition: none; }\n  .hana-step-roll-layer { will-change: auto; }\n}\n\n/* Fade decorative overlays out while DSH's image lightbox is open. */\n.hana-paper-layer,\n#dsh-hana-appearance-sunny,\n#dsh-hana-appearance-sunny-warm {\n  transition: opacity 240ms ease;\n}\nhtml[data-hana-media-open] .hana-paper-layer,\nhtml[data-hana-media-open] #dsh-hana-appearance-sunny,\nhtml[data-hana-media-open] #dsh-hana-appearance-sunny-warm {\n  opacity: 0 !important;\n  pointer-events: none !important;\n}\n";

		/** Default appearance state (theme / font / texture / extras). */
		const DEFAULT_STATE = {
			theme: DEFAULT_SKIN,
			font: "serif",
			texture: "off",
			textureStrength: 3,
			showSticker: true,
			toolIcon: "svg",
			appIcon: "default",
			language: "zh-CN",
			timezone: "Asia/Shanghai",
			fontSizeOffset: 0,
			contrastOffset: 0,
			chatWidth: "720",
			sunnyMode: false,
			sunnySeed: 0,
			sunnySavedSeeds: [],
			customFontName: "",
			customFontLabel: "",
			editorFont: "follow",
			editorBodySize: 16,
			editorContentWidth: "720",
			editorH1: 28,
			editorH2: 21,
			editorH3: 18,
			editorLineHeight: 1.5,
			editorContentPadding: 24,
			previewTexture: "off",
			previewTextureStrength: 3,
			wenkaiReady: false,
			updatedAt: 0,
		};

		/** Resolve the reading-font family for the current state. */
		function resolveFontStack(next) {
			if (next.font === "custom" && next.customFontName) return `'${next.customFontName}', ${FONT_STACKS.serif}`;
			if (next.font === "wenkai") return "'HanaLXGWNeoZhiSong', ";
			return FONT_STACKS[next.font] ?? FONT_STACKS.serif;
		}

		/** Font stacks (HanaAgent serif / sans presets, CJK fallbacks widened). */
		const FONT_STACKS = {
			serif: "Georgia, 'Times New Roman', 'Songti SC', SimSun, 'Noto Serif CJK SC', 'Source Han Serif SC', serif",
			sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif",
		};

		/** HanaAgent paper-texture strength steps (picker labels 1-5 map here). */
		const TEXTURE_STRENGTH_VALUES = [0.5, 0.75, 1, 1.25, 1.5];

		/** Texture picker options (first entry turns the texture off). */
		const TEXTURE_OPTIONS = [
			{ value: "off", label: "关闭" },
			{ value: "rice", label: "宣纸" },
			{ value: "cotton", label: "棉纸" },
			{ value: "fine", label: "细颗粒" },
		];

		const STRENGTH_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }));

		/** Bundled HanaUI desktop app icons (Windows-only shortcut/window icon sync). */
		const APP_ICON_IDS = ["orchid", "classic", "plum", "bot"];
		const APP_ICON_ROUTE = "/api/hana-appearance/app-icon";
		const APP_ICONS = [
			{ id: "orchid", name: "兰", file: "orchid.png" },
			{ id: "classic", name: "经典", file: "classic.png" },
			{ id: "plum", name: "梅", file: "plum.png" },
			{ id: "bot", name: "Bot", file: "bot.png" },
		];

		/** Asset URL served by the harness client-module asset route. */
		function iconAssetUrl(file) {
			return `/plugins/dsh-hana-appearance/assets/icons/${file}`;
		}

		/** Clamp helper for the texture strength (1..5, indexes TEXTURE_STRENGTH_VALUES). */
		function clampStrength(value) {
			const parsed = Number(value);
			if (!Number.isFinite(parsed)) return 3;
			return Math.min(5, Math.max(1, Math.round(parsed)));
		}
		function isDarkMode(themeId) {
			if (themeId === DEFAULT_SKIN) return document.body?.hasAttribute("data-ds-dark-theme") === true;
			return THEME_BY_ID.get(themeId)?.colorScheme === "dark";
		}

		/** Coerce arbitrary storage/route JSON into a valid state object. */
		function normalizeState(raw) {
			if (typeof raw !== "object" || raw === null) return { ...DEFAULT_STATE };
			const theme = typeof raw.theme === "string" && (raw.theme === DEFAULT_SKIN || THEME_BY_ID.has(raw.theme)) ? raw.theme : DEFAULT_STATE.theme;
			const texture = raw.texture === "rice" || raw.texture === "cotton" || raw.texture === "fine" ? raw.texture : "off";
			const clampOffset = (value) => Math.max(-2, Math.min(2, Math.round(Number(value) || 0)));
			const font = raw.font === "sans" || raw.font === "wenkai" || raw.font === "custom" ? raw.font : "serif";
			return {
				theme,
				font,
				texture,
				textureStrength: clampStrength(raw.textureStrength),
				showSticker: raw.showSticker !== false,
				toolIcon: raw.toolIcon === "emoji" ? "emoji" : "svg",
				appIcon: APP_ICON_IDS.includes(raw.appIcon) ? raw.appIcon : "default",
				language: typeof raw.language === "string" && raw.language !== "" ? raw.language : "zh-CN",
				timezone: typeof raw.timezone === "string" && raw.timezone !== "" ? raw.timezone : "Asia/Shanghai",
				fontSizeOffset: clampOffset(raw.fontSizeOffset),
				contrastOffset: clampOffset(raw.contrastOffset),
				chatWidth: ["640", "720", "800", "unlimited"].includes(raw.chatWidth) ? raw.chatWidth : "720",
				sunnyMode: raw.sunnyMode === true,
				sunnySeed: typeof raw.sunnySeed === "number" && Number.isFinite(raw.sunnySeed) ? Math.max(0, Math.min(999999999, Math.round(raw.sunnySeed))) : 0,
				sunnySavedSeeds: Array.isArray(raw.sunnySavedSeeds)
					? raw.sunnySavedSeeds.filter((seed) => typeof seed === "number" && Number.isFinite(seed))
					: [],
				customFontName: typeof raw.customFontName === "string" ? raw.customFontName : "",
				customFontLabel: typeof raw.customFontLabel === "string" ? raw.customFontLabel : "",
				editorFont: ["follow", "serif", "sans", "wenkai", "custom"].includes(raw.editorFont) ? raw.editorFont : "follow",
				editorBodySize: Number.isFinite(Number(raw.editorBodySize)) ? Number(raw.editorBodySize) : 16,
				editorContentWidth: ["640", "720", "800", "unlimited"].includes(raw.editorContentWidth) ? raw.editorContentWidth : "720",
				editorH1: Number.isFinite(Number(raw.editorH1)) ? Number(raw.editorH1) : 28,
				editorH2: Number.isFinite(Number(raw.editorH2)) ? Number(raw.editorH2) : 21,
				editorH3: Number.isFinite(Number(raw.editorH3)) ? Number(raw.editorH3) : 18,
				editorLineHeight: Number.isFinite(Number(raw.editorLineHeight)) ? Number(raw.editorLineHeight) : 1.5,
				editorContentPadding: Number.isFinite(Number(raw.editorContentPadding)) ? Number(raw.editorContentPadding) : 24,
				previewTexture: raw.previewTexture === "rice" || raw.previewTexture === "cotton" || raw.previewTexture === "fine" ? raw.previewTexture : "off",
				previewTextureStrength: clampStrength(raw.previewTextureStrength),
				wenkaiReady: raw.wenkaiReady === true,
				updatedAt: Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : 0,
			};
		}

		//#endregion

		//#region dsh-hana-appearance: persistence store
		/**
		 * Appearance store: localStorage is the instant layer (survives
		 * reloads), the host route writes a JSON file under $DSH_HOME so the
		 * selection survives Desktop's per-launch loopback port churn.
		 */
		const listeners = new Set();
		let state = { ...DEFAULT_STATE };
		let repaint = null;

		function readLocal() {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw === null) return null;
				return normalizeState(JSON.parse(raw));
			} catch {
				return null;
			}
		}

		/* Cookie mirror: cookies are host-scoped (not port-scoped), so the last
		 * chosen theme is available synchronously on the next launch even before
		 * the durable host file is fetched — this removes the startup theme flash. */
		const BOOT_COOKIE = "hana-appearance-boot";

		function writeBootCookie(next) {
			try {
				const payload = JSON.stringify({ theme: next.theme, updatedAt: next.updatedAt });
				document.cookie = BOOT_COOKIE + "=" + encodeURIComponent(payload) + "; path=/; max-age=31536000; SameSite=Lax";
			} catch {
				// cookies may be unavailable; the other layers still work
			}
		}

		function readBootCookie() {
			try {
				const match = new RegExp("(?:^|; )" + BOOT_COOKIE + "=([^;]*)").exec(document.cookie ?? "");
				if (match === null) return null;
				const parsed = JSON.parse(decodeURIComponent(match[1]));
				if (typeof parsed !== "object" || parsed === null || typeof parsed.theme !== "string") return null;
				return normalizeState(parsed);
			} catch {
				return null;
			}
		}

		function writeLocal(next) {
			writeBootCookie(next);
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {
				// storage may be unavailable in private contexts; route layer still works
			}
		}

		function notify() {
			for (const listener of listeners) listener();
			if (repaint !== null) repaint();
		}
				/* ── DSH built-in locale bridge ──
		 * The 语言 row mirrors DSH's own 设置 → 通用 → 语言 row: reading the
		 * runtime locale snapshot keeps both in sync, writing through
		 * locale.setLocale() switches the whole UI and persists the preference. */
		let localeFace = null;

		/** Options for the language dropdown, sourced from the runtime catalog. */
		function getDshLanguageOptions() {
			try {
				const snapshot = localeFace?.getSnapshot?.();
				if (snapshot !== undefined && Array.isArray(snapshot.locales) && snapshot.locales.length > 0) {
					return snapshot.locales.map((entry) => ({ value: entry.id, label: entry.label }));
				}
			} catch {
				// fall through to the static catalog
			}
			return LANGUAGE_OPTIONS;
		}

		/** Snapshot of the runtime locale, or null when the runtime has none. */
		function readDshLocale() {
			try {
				const snapshot = localeFace?.getSnapshot?.();
				if (snapshot === undefined || typeof snapshot.active !== "string") return null;
				return { active: snapshot.active };
			} catch {
				return null;
			}
		}

		/** Change the language: update our state and switch the runtime locale. */
		function chooseLanguage(id) {
			lastLocaleChangeAt = Date.now();
			setState({ language: id });
			try {
				localeFace?.setLocale?.(id);
				// Keep the Hana skin even if the runtime re-emits its built-in theme.
				setTimeout(() => {
					if (state.theme === DEFAULT_SKIN) return;
					try {
						if (ctx.theme.getTheme().preference !== state.theme) {
							lastSelfSetAt = Date.now();
							ctx.theme.setTheme(state.theme);
						}
					} catch {
						// ignore: theme runtime may be tearing down
					}
				}, 400);
			} catch {
				// unknown/unsupported id: keep the plugin preference only
			}
		}

/* Optional 霞鹜新致宋 (LXGW Neo ZhiSong) reading font: installed on demand,
		 * cached by the host half under $DSH_HOME, registered as a FontFace. */
		const WENKAI_FAMILY = "HanaLXGWNeoZhiSong";
		let fontStatus = { status: "idle", progress: 0 };

		function getFontStatus() {
			return fontStatus;
		}

		function setFontStatus(patch) {
			fontStatus = { ...fontStatus, ...patch };
			notify();
		}

		/** Register the cached font bytes under the HanaAgent family name. */
		function registerWenkaiBuffer(buffer) {
			return new FontFace(WENKAI_FAMILY, buffer)
				.load()
				.then((face) => {
					document.fonts.add(face);
					return true;
				})
				.catch(() => false);
		}

		/** Load the cached font file from the host (after a previous install). */
		async function loadCachedWenkaiFont() {
			try {
				const response = await fetch("/api/hana-appearance/font");
				if (!response.ok) return false;
				const buffer = await response.arrayBuffer();
				return await registerWenkaiBuffer(buffer);
			} catch {
				return false;
			}
		}

		/** Start the host-side download and poll its progress, then activate it. */
		async function installWenkaiFont() {
			if (fontStatus.status === "downloading" || fontStatus.status === "verifying") return;
			setFontStatus({ status: "downloading", progress: 0 });
			try {
				const start = await fetch("/api/hana-appearance/font/install", { method: "POST" });
				if (!start.ok) throw new Error("install failed");
				for (let attempt = 0; attempt < 1600; attempt++) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					let info;
					try {
						const response = await fetch("/api/hana-appearance/font/status");
						if (!response.ok) continue;
						info = await response.json();
					} catch {
						continue;
					}
					if (info.status === "failed") throw new Error(info.error ?? "download failed");
					if (info.status === "verifying") setFontStatus({ status: "verifying", progress: 100 });
					else if (info.status === "downloading") setFontStatus({ status: "downloading", progress: Number(info.progress) || 0 });
					if (info.ready === true || info.status === "ready") {
						const loaded = await loadCachedWenkaiFont();
						if (!loaded) throw new Error("font load failed");
						setState({ wenkaiReady: true, font: "wenkai" });
						setFontStatus({ status: "ready", progress: 100 });
						return;
					}
				}
				throw new Error("timeout");
			} catch {
				setFontStatus({ status: "failed", progress: 0 });
			}
		}

		/** On boot, re-register a previously installed font file. */
		async function restoreWenkaiFont() {
			if (state.wenkaiReady !== true) return;
			const loaded = await loadCachedWenkaiFont();
			if (!loaded) setState({ wenkaiReady: false });
		}

		/* Bundled HanaUI app icons: the host half rewrites the Windows desktop,
		 * Start-menu and pinned-taskbar shortcuts and keeps the window icon
		 * (taskbar thumbnail / Alt+Tab) in sync — see lib/app-icon.js. */
		let appIconStatus = null;

		function getAppIconStatus() {
			return appIconStatus;
		}

		function appIconErrorMessage(message) {
			if (message.includes("unknown-app-icon")) return "未知的应用图标";
			if (message.includes("app-icon-powershell")) return "系统调用失败：" + message.replace(/^app-icon-powershell:\s*/, "");
			return message;
		}

		async function refreshAppIconStatus() {
			try {
				const response = await fetch(APP_ICON_ROUTE);
				if (!response.ok) {
					const notReady = response.status === 401 || response.status === 403 || response.status === 404 || response.status === 405;
					appIconStatus = {
						supported: !notReady,
						ok: false,
						error: notReady ? "应用图标服务未就绪（重启 DSH 一次后生效）" : "HTTP " + response.status,
					};
					return appIconStatus;
				}
				appIconStatus = await response.json();
			} catch (error) {
				appIconStatus = { supported: true, ok: false, error: error instanceof Error ? error.message : String(error) };
			}
			return appIconStatus;
		}

		async function applyAppIcon(iconId) {
			const response = await fetch(APP_ICON_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ iconId }),
			});
			let info = {};
			try {
				info = await response.json();
			} catch {
				info = {};
			}
			if (!response.ok || info.ok === false) {
				const notReady = response.status === 401 || response.status === 403 || response.status === 404 || response.status === 405;
				throw new Error(notReady ? "应用图标服务未就绪（重启 DSH 一次后生效）" : appIconErrorMessage(String(info.error ?? "HTTP " + response.status)));
			}
			appIconStatus = { ...info, supported: info.supported !== false, ok: true };
			return appIconStatus;
		}

		/** @returns the current appearance state (stable reference until changed). */
		function getState() {
			return state;
		}

		/** Subscribe to appearance changes; @returns the disposer. */
		function subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}

		let flushTimer = null;
		function scheduleFlush() {
			if (flushTimer !== null) clearTimeout(flushTimer);
			flushTimer = setTimeout(() => {
				flushTimer = null;
				void fetch(STATE_ROUTE, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(state),
				}).catch(() => {});
			}, 400);
		}

		/** Merge a patch into the state, persist both layers, repaint. */
		function setState(patch) {
			state = normalizeState({ ...state, ...patch });
			state.updatedAt = Date.now();
			writeLocal(state);
			updateSunny(state);
			applyChatWidth(state);
			scheduleFlush();
			notify();
			return state;
		}

		/** Pull the durable host state once (older hosts may lack the route). */
		async function hydrate() {
			try {
				const response = await fetch(STATE_ROUTE);
				if (!response.ok) return;
				const body = await response.json();
				const local = readLocal();
				const hostAt = Number(body?.updatedAt) || 0;
				const localAt = Number(local?.updatedAt) || 0;
				if (local !== null && localAt >= hostAt) {
					if (localAt > hostAt) scheduleFlush();
					return;
				}
				state = normalizeState(body);
				state.updatedAt = hostAt > 0 ? hostAt : Date.now();
				writeLocal(state);
				updateSunny(state);
				applyChatWidth(state);
				notify();
			} catch {
				// route absent — localStorage-only mode
			}
		}
		//#endregion

		//#region dsh-hana-appearance: applier
		let styleEl = null;
		let pageStyleEl = null;
		let paperLayer = null;
		let lastSelfSetAt = 0;
		/** Timestamp of the latest locale switch (DSH re-emits a built-in theme around it). */
		let lastLocaleChangeAt = 0;
		/* ── 晴天模式：HanaAgent 的程序化树影渲染器（按其构建产物逐函数移植） ── */
		const SUNNY_INK = "rgb(58, 66, 82)";
		const SUNNY_UNIT = 900;
		const SUNNY_SWAY_DEG = 3.9;
		const SUNNY_TIME_RATE = 1;
		const SUNNY_BLUR = 2.5;
		const SUNNY_SCALE = 1.6;
		const SUNNY_GROWTH = -0.2;
		const SUNNY_FPS = 30;
		const SUNNY_GUST_RISE = 2.5;
		const SUNNY_GUST_FALL = 3.5;
		const SUNNY_GUST_DECAY = 2.2;
		const SUNNY_GUST_MIN_GAP = 14;
		const SUNNY_GUST_GAP = 18;
		const SUNNY_GUST_NEXT = 6;
		const SUNNY_GUST_MAX = 0.9;
		const SUNNY_STEPS = 14;
		const SUNNY_AE = Math.PI / 180;
		const SUNNY_LAYERS = [
			{ name: "far", scale: 0.85, blur: 1.3, alpha: 0.6, sway: 1.15 },
			{ name: "mid", scale: 1, blur: 1, alpha: 0.82, sway: 1 },
			{ name: "near", scale: 1.15, blur: 0.75, alpha: 1, sway: 0.8 },
		];

		/** Seeded PRNG (exactly HanaAgent's mulberry32 variant). */
		function sunnyRng(seed) {
			let n = seed;
			return () => {
				n |= 0;
				n = (n + 1831565813) | 0;
				let t = Math.imul(n ^ (n >>> 15), 1 | n);
				t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		const lerp = (a, b, t) => a + (b - a) * t;
		const smoothstep = (value) => {
			const t = Math.min(1, Math.max(0, value));
			return t * t * (3 - 2 * t);
		};

		function bezierPoint(limb, t) {
			const o = 1 - t;
			return {
				x: o * o * limb.p0.x + 2 * o * t * limb.c.x + t * t * limb.p1.x,
				y: o * o * limb.p0.y + 2 * o * t * limb.c.y + t * t * limb.p1.y,
			};
		}

		function bezierAngle(limb, t) {
			const dx = 2 * (1 - t) * (limb.c.x - limb.p0.x) + 2 * t * (limb.p1.x - limb.c.x);
			const dy = 2 * (1 - t) * (limb.c.y - limb.p0.y) + 2 * t * (limb.p1.y - limb.c.y);
			return Math.atan2(dy, dx);
		}

		function limbPoint(limb, t) {
			const point = bezierPoint(limb, t);
			const angle = bezierAngle(limb, t);
			const scaled = t * SUNNY_STEPS;
			const index = Math.min(SUNNY_STEPS - 1, Math.floor(scaled));
			const kink = lerp(limb.kinks[index], limb.kinks[index + 1], scaled - index);
			return { x: point.x - Math.sin(angle) * kink, y: point.y + Math.cos(angle) * kink };
		}

		function angleBlend(a, b, t) {
			return Math.atan2(
				Math.sin(a) * (1 - t) + Math.sin(b) * t,
				Math.cos(a) * (1 - t) + Math.cos(b) * t
			);
		}

		function pushLeaves(rng, limb, x, y, angle, scale, along, count, parentAngle) {
			for (let i = 0; i < count; i++) {
				const length = lerp(24, 74, Math.pow(rng(), 1.4)) * scale * lerp(1, 0.8, along);
				const widthFactor = 0.45 + 0.55 * rng();
				limb.leaves.push({
					x: x + (rng() - 0.5) * 4 * scale,
					y: y + (rng() - 0.5) * 4 * scale,
					a: angleBlend(angle + (rng() - 0.5) * 110 * SUNNY_AE, parentAngle, 0.5),
					l: length,
					w: length * (0.2 + rng() * 0.08) * widthFactor,
					asym: 0.65 + rng() * 0.7,
				});
			}
		}

		function buildLimb(rng, length, scale, t, depth, angle) {
			const baseAngle = Math.PI / 2 - angle;
			const cosA = Math.cos(baseAngle);
			const sinA = Math.sin(baseAngle);
			const bow = length * (depth === 0 ? 0.3 : 0.4) * (0.7 + rng() * 0.6);
			const limb = {
				p0: { x: 0, y: 0 },
				c: { x: length * 0.55 + cosA * bow * 0.12, y: sinA * bow * 0.12 },
				p1: {
					x: length * 0.88 + cosA * bow,
					y: sinA * bow + (rng() - 0.5) * length * 0.06,
				},
				width: (depth === 0 ? 8 : 4) * scale,
				kinks: Array.from({ length: SUNNY_STEPS + 1 }, (_, index) =>
					index === 0 ? 0 : (rng() - 0.5) * length * 0.022
				),
				leaves: [],
				twigs: [],
				children: [],
				phase: [rng() * 99, rng() * 99, rng() * 99],
			};
			let step = length * (depth === 0 ? 0.3 : 0.1);
			while (step < length * 0.95) {
				const t0 = step / length;
				const point = limbPoint(limb, t0);
				const twist = bezierAngle(limb, t0);
				const side = rng() < 0.5 ? -1 : 1;
				const twigAngle = angleBlend(twist + side * (25 + rng() * 45) * SUNNY_AE, baseAngle, 0.3);
				const twigLength = (4 + rng() * 16) * scale;
				const tip = { x: point.x + Math.cos(twigAngle) * twigLength, y: point.y + Math.sin(twigAngle) * twigLength };
				limb.twigs.push({
					x0: point.x,
					y0: point.y,
					x1: tip.x,
					y1: tip.y,
					w: limb.width * lerp(0.5, 0.3, t0),
				});
				pushLeaves(rng, limb, tip.x, tip.y, twigAngle, scale, t0, 2 + Math.floor(rng() * 4), baseAngle);
				step += (12 + Math.pow(rng(), 2) * 46) * scale / 0.6;
			}
			const tip = limbPoint(limb, 1);
			pushLeaves(rng, limb, tip.x, tip.y, bezierAngle(limb, 1), scale, 1, 3 + Math.floor(rng() * 2), baseAngle);
			const leafBurn = Math.round(limb.leaves.length * 0.035);
			for (let i = 0; i < leafBurn * 4; i++) rng();
			if (depth === 0) {
				const childCount = 2 + Math.floor(rng() * 3);
				for (let i = 0; i < childCount; i++) {
					const at = 0.18 + (i / childCount) * 0.62 + rng() * 0.08;
					const point = limbPoint(limb, at);
					const side = rng() < 0.5 ? 1 : -1;
					const childAngle = bezierAngle(limb, at) + side * (20 + rng() * 25) * SUNNY_AE;
					const child = buildLimb(rng, length * (0.3 + rng() * 0.3), scale * lerp(1, 0.85, at), 0.6, 1, childAngle);
					child.width = Math.min(child.width, limb.width * lerp(0.8, 0.4, at));
					limb.children.push({ ...child, attach: { x: point.x, y: point.y, a: childAngle } });
				}
			}
			return limb;
		}

		/** Build the seeded tree: clusters with layer / anchor / limb (HanaAgent Or). */
		function buildSunnyTree(seed) {
			const rng = sunnyRng(seed);
			const clusterCount = Math.round(3 + 6 * SUNNY_GROWTH);
			const branchTaper = 0.6 + 0.4 * SUNNY_GROWTH;
			const clusters = [];
			for (let index = 0; index < clusterCount; index++) {
				const layerIndex = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 2;
				const layer = SUNNY_LAYERS[layerIndex];
				const anchor =
					rng() < 0.55
						? {
								fx: 0.5 + Math.pow(rng(), 0.6) * 0.58,
								fy: -0.04,
								a: (125 + rng() * 25) * SUNNY_AE,
							}
						: { fx: 1.04, fy: rng() * 0.4, a: (168 + rng() * 22) * SUNNY_AE };
				const scale = layer.scale;
				const length = SUNNY_UNIT * (0.32 + Math.pow(rng(), 1.2) * 0.45) * scale;
				const limb = buildLimb(rng, length, scale, branchTaper, 0, anchor.a);
				clusters.push({
					layerIndex,
					layer,
					anchor,
					limb,
					gustDelay: (1 - Math.min(1, anchor.fx)) * 2.2,
				});
			}
			clusters.sort((a, b) => a.layerIndex - b.layerIndex);
			return { seed, clusters };
		}

		const sunnyTreeScale = (height) => (height / SUNNY_UNIT) * SUNNY_SCALE;

		/** Bounds of one limb (HanaAgent Dr). */
		function limbBounds(limb) {
			let minX = 0;
			let minY = 0;
			let maxX = 0;
			let maxY = 0;
			const include = (x, y, pad) => {
				minX = Math.min(minX, x - pad);
				minY = Math.min(minY, y - pad);
				maxX = Math.max(maxX, x + pad);
				maxY = Math.max(maxY, y + pad);
			};
			for (let i = 0; i <= SUNNY_STEPS; i++) {
				const point = limbPoint(limb, i / SUNNY_STEPS);
				include(point.x, point.y, limb.width);
			}
			for (const leaf of limb.leaves) include(leaf.x, leaf.y, leaf.l + 2);
			return { minX, minY, maxX, maxY };
		}

		/** Render one limb (with its twigs + leaves) into a blurred offscreen canvas. */
		function renderLimb(limb, layer, scale, dpr) {
			const canvasScale = dpr * scale;
			const blur = (SUNNY_BLUR * layer.blur) / scale;
			const bounds = limbBounds(limb);
			const pad = blur * 2.5 + 6;
			const width = bounds.maxX - bounds.minX + pad * 2;
			const height = bounds.maxY - bounds.minY + pad * 2;
			const pixelWidth = Math.ceil(width * canvasScale);
			const pixelHeight = Math.ceil(height * canvasScale);
			const offsetX = pad - bounds.minX;
			const offsetY = pad - bounds.minY;
			const raw = document.createElement("canvas");
			raw.width = pixelWidth;
			raw.height = pixelHeight;
			const g = raw.getContext("2d");
			if (g === null) throw new Error("2D canvas is unavailable");
			g.scale(canvasScale, canvasScale);
			g.translate(offsetX, offsetY);
			g.fillStyle = SUNNY_INK;
			g.strokeStyle = SUNNY_INK;
			g.lineCap = "round";
			for (let i = 0; i < SUNNY_STEPS; i++) {
				const current = limbPoint(limb, i / SUNNY_STEPS);
				const next = limbPoint(limb, (i + 1) / SUNNY_STEPS);
				g.lineWidth = lerp(limb.width, limb.width * 0.3, i / SUNNY_STEPS);
				g.beginPath();
				g.moveTo(current.x, current.y);
				g.lineTo(next.x, next.y);
				g.stroke();
			}
			for (const twig of limb.twigs) {
				g.lineWidth = Math.max(0.8, twig.w);
				g.beginPath();
				g.moveTo(twig.x0, twig.y0);
				g.lineTo(twig.x1, twig.y1);
				g.stroke();
			}
			for (const leaf of limb.leaves) {
				const length = leaf.l;
				const breadth = leaf.w;
				g.save();
				g.translate(leaf.x, leaf.y);
				g.rotate(leaf.a);
				g.lineWidth = 0.8;
				g.beginPath();
				g.moveTo(0, 0);
				g.lineTo(length * 0.12, 0);
				g.stroke();
				g.beginPath();
				g.moveTo(length * 0.1, 0);
				g.bezierCurveTo(length * 0.25, -breadth * 1.15, length * 0.7, -breadth * 0.95, length, 0);
				g.bezierCurveTo(length * 0.7, breadth * 0.95 * leaf.asym, length * 0.25, breadth * 1.15 * leaf.asym, length * 0.1, 0);
				g.fill();
				g.restore();
			}
			const blurred = document.createElement("canvas");
			blurred.width = pixelWidth;
			blurred.height = pixelHeight;
			const b = blurred.getContext("2d");
			if (b === null) throw new Error("2D canvas is unavailable");
			if (blur > 0) b.filter = `blur(${blur * canvasScale}px)`;
			b.drawImage(raw, 0, 0);
			raw.width = 0;
			raw.height = 0;
			return { canvas: blurred, ox: offsetX, oy: offsetY, w: width, h: height };
		}

		/** Build the per-cluster canvas set (HanaAgent Hr). */
		function buildSunnyCanvases(tree, scale, dpr) {
			return tree.clusters.map((cluster) => ({
				main: renderLimb(cluster.limb, cluster.layer, scale, dpr),
				children: cluster.limb.children.map((child) => renderLimb(child, cluster.layer, scale, dpr)),
			}));
		}

		/** Sum-of-sines wind wave (HanaAgent St). */
		function sunnyWave(time, phase, rate) {
			return (
				Math.sin(time * 0.41 * rate + phase[0]) * 0.6 +
				Math.sin(time * 0.67 * rate + phase[1]) * 0.3 +
				Math.sin(time * 1.13 * rate + phase[2]) * 0.1
			);
		}

		/** Gust envelope: 0 lift, 1 hold, then exponential fade (HanaAgent Wr). */
		function sunnyGustEnvelope(value) {
			if (value < 0) return 0;
			if (value < SUNNY_GUST_RISE) return smoothstep(value / SUNNY_GUST_RISE);
			if (value < SUNNY_GUST_FALL) return 1;
			return Math.exp(-(value - SUNNY_GUST_FALL) / SUNNY_GUST_DECAY);
		}

		/** Schedule the next gust (HanaAgent $r). */
		function nextSunnyGust(gust, time, random = Math.random) {
			if (time <= gust.next) return gust;
			return { start: time, next: time + SUNNY_GUST_MIN_GAP + random() * SUNNY_GUST_GAP };
		}

		/** Draw one animated frame (HanaAgent Ur). */
		function drawSunnyFrame(ctx, tree, canvases, options) {
			const { time, gust, width, height, dpr, scale } = options;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const swayBase = SUNNY_SWAY_DEG * SUNNY_AE;
			tree.clusters.forEach((cluster, index) => {
				const layers = canvases[index];
				if (!layers) return;
				const gustStrength = sunnyGustEnvelope(time - gust.start - cluster.gustDelay) * SUNNY_GUST_MAX;
				const limb = cluster.limb;
				const sway = swayBase * cluster.layer.sway * (sunnyWave(time, limb.phase, 1) * (1 + gustStrength) + gustStrength * 0.8);
				ctx.save();
				ctx.globalAlpha = cluster.layer.alpha;
				ctx.translate(cluster.anchor.fx * width, cluster.anchor.fy * height);
				ctx.rotate(cluster.anchor.a + sway);
				ctx.scale(scale, scale);
				ctx.drawImage(layers.main.canvas, -layers.main.ox, -layers.main.oy, layers.main.w, layers.main.h);
				limb.children.forEach((child, childIndex) => {
					const childLayers = layers.children[childIndex];
					if (!childLayers) return;
					const childSway =
						swayBase * cluster.layer.sway * 1.3 * (sunnyWave(time, child.phase, 1.7) * (1 + gustStrength * 1.4) + gustStrength * 0.6);
					ctx.save();
					ctx.translate(child.attach.x, child.attach.y);
					ctx.rotate(child.attach.a + childSway);
					ctx.drawImage(childLayers.canvas, -childLayers.ox, -childLayers.oy, childLayers.w, childLayers.h);
					ctx.restore();
				});
				ctx.restore();
			});
		}

		/* ── Sunny mode overlay lifecycle ── */
		let sunnyWarmEl = null;
		let sunnyShadeEl = null;
		let sunnyTree = null;
		let sunnySeedKey = null;
		let sunnyCanvases = [];
		let sunnyFrame = 0;
		let sunnyTime = 0;
		let sunnyGust = { start: -999, next: SUNNY_GUST_NEXT };
		let sunnyLast = 0;
		let sunnyAcc = 0;
		let sunnyW = 0;
		let sunnyH = 0;
		let sunnyDpr = 1;
		let sunnyScale = 1;
		let sunnyResizeBound = false;

		function clearSunnyCanvases() {
			for (const layer of sunnyCanvases) {
				for (const item of [layer.main, ...layer.children]) {
					if (item && item.canvas) {
						item.canvas.width = 0;
						item.canvas.height = 0;
					}
				}
			}
			sunnyCanvases = [];
		}

		function resizeSunny() {
			if (sunnyShadeEl === null || sunnyTree === null) return;
			sunnyDpr = Math.min(window.devicePixelRatio || 1, 2);
			sunnyW = window.innerWidth;
			sunnyH = window.innerHeight || 800;
			sunnyShadeEl.width = Math.round(sunnyW * sunnyDpr);
			sunnyShadeEl.height = Math.round(sunnyH * sunnyDpr);
			sunnyScale = sunnyTreeScale(sunnyH);
			clearSunnyCanvases();
			sunnyCanvases = buildSunnyCanvases(sunnyTree, sunnyScale, sunnyDpr);
		}

		function drawSunny() {
			if (sunnyShadeEl === null || sunnyTree === null) return;
			const ctx = sunnyShadeEl.getContext("2d");
			if (ctx === null) return;
			drawSunnyFrame(ctx, sunnyTree, sunnyCanvases, {
				time: sunnyTime,
				gust: sunnyGust,
				width: sunnyW,
				height: sunnyH,
				dpr: sunnyDpr,
				scale: sunnyScale,
			});
		}

		function sunnyTick(now) {
			if (sunnyShadeEl === null) return;
			sunnyFrame = requestAnimationFrame(sunnyTick);
			const delta = Math.min(100, now - sunnyLast);
			sunnyLast = now;
			sunnyAcc += delta;
			const frameMs = 1000 / SUNNY_FPS;
			if (sunnyAcc < frameMs) return;
			const seconds = sunnyAcc / 1000;
			sunnyAcc = 0;
			if (document.hidden) return;
			sunnyTime += seconds * SUNNY_TIME_RATE;
			sunnyGust = nextSunnyGust(sunnyGust, sunnyTime);
			drawSunny();
		}

		/** Remove the sunny overlay layers and stop its animation. */
		function stopSunny() {
			if (sunnyFrame !== 0) cancelAnimationFrame(sunnyFrame);
			sunnyFrame = 0;
			clearSunnyCanvases();
			sunnyTree = null;
			sunnySeedKey = null;
			if (sunnyResizeBound) window.removeEventListener("resize", resizeSunny);
			sunnyResizeBound = false;
			if (sunnyWarmEl !== null) sunnyWarmEl.remove();
			sunnyWarmEl = null;
			if (sunnyShadeEl !== null) sunnyShadeEl.remove();
			sunnyShadeEl = null;
			for (const id of ["dsh-hana-appearance-sunny", "dsh-hana-appearance-sunny-warm"]) {
				const leftover = document.getElementById?.(id);
				if (leftover) leftover.remove();
			}
			try {
				const staleLayers = document.querySelectorAll?.('canvas[style*="21474829"], div[style*="21474829"]') ?? [];
				for (const stale of staleLayers) stale.remove();
			} catch {
				// cleanup is best-effort
			}
		}

		/** Start or refresh the sunny-mode tree-shadow overlay. */
		function updateSunny(next) {
			if (next.sunnyMode !== true) {
				stopSunny();
				return;
			}
			const seed = typeof next.sunnySeed === "number" && Number.isFinite(next.sunnySeed) ? next.sunnySeed : 0;
			const key = String(seed);
			if (sunnyWarmEl === null) {
				sunnyWarmEl = document.createElement("div");
				sunnyWarmEl.id = "dsh-hana-appearance-sunny-warm";
				sunnyWarmEl.style.cssText =
					"position:fixed;inset:0;z-index:2147482980;pointer-events:none;mix-blend-mode:soft-light;background:radial-gradient(120% 90% at 100% 0%, rgba(255, 214, 150, .32), rgba(255, 214, 150, 0) 70%);";
				document.body.appendChild(sunnyWarmEl);
			}
			if (sunnyShadeEl === null) {
				sunnyShadeEl = document.createElement("canvas");
				sunnyShadeEl.id = "dsh-hana-appearance-sunny";
				sunnyShadeEl.style.cssText =
					"position:fixed;inset:0;width:100%;height:100%;z-index:2147482981;pointer-events:none;mix-blend-mode:multiply;opacity:0.1;";
				document.body.appendChild(sunnyShadeEl);
			}
			if (sunnySeedKey !== key || sunnyTree === null) {
				sunnySeedKey = key;
				sunnyTree = buildSunnyTree(seed);
				sunnyTime = 0;
				sunnyGust = { start: -999, next: SUNNY_GUST_NEXT };
				resizeSunny();
				drawSunny();
			} else if (sunnyShadeEl.width === 0) {
				resizeSunny();
				drawSunny();
			}
			if (!sunnyResizeBound) {
				window.addEventListener("resize", resizeSunny);
				sunnyResizeBound = true;
			}
			if (sunnyFrame === 0) {
				sunnyLast = performance.now();
				sunnyAcc = 0;
				sunnyFrame = requestAnimationFrame(sunnyTick);
			}
		}

				/** DSH content typography variables consumed by the shipped chat UI. */
		const CONTENT_BASE_FONT_SIZE = 14;
		const CONTENT_BASE_SECONDARY_SIZE = 13;

		/** Chat width options → DSH's own conversation width preference (px). */
		const CHAT_WIDTH_PX = { "640": 640, "720": 720, "800": 800, unlimited: 99999 };
		const DSH_CONTENT_WIDTH_KEY = "dsh.conversation.contentWidth";

		/** Hide decorative overlays (paper texture, sunny light) over media viewers. */
		function syncMediaViewer() {
			try {
				const root = document.documentElement;
				if (root === null || root === undefined) return;
				const viewportArea = (window.innerWidth || 1) * (window.innerHeight || 1);
				let open = false;
				const dialogs = document.querySelectorAll?.('[role="dialog"][aria-modal="true"]') ?? [];
				for (const dialog of dialogs) {
					if (dialog.hidden === true || dialog.getAttribute?.("aria-hidden") === "true") continue;
					const box = dialog.getBoundingClientRect?.();
					if (box !== undefined && (box.width === 0 || box.height === 0)) continue;
					for (const image of dialog.querySelectorAll?.("img") ?? []) {
						const rect = image.getBoundingClientRect?.();
						if (rect !== undefined && rect.width * rect.height >= viewportArea * 0.45) {
							open = true;
							break;
						}
					}
					if (open) break;
				}
				if (open) root.setAttribute("data-hana-media-open", "");
				else root.removeAttribute("data-hana-media-open");
			} catch {
				// detection is best-effort
			}
		}

		/** Build the dynamic CSS sheet: reading font + content typography. */
		function buildCss(next) {
			const offset = Math.max(-2, Math.min(2, Number(next.fontSizeOffset) || 0));
			const bodySize = CONTENT_BASE_FONT_SIZE + offset;
			const secondarySize = CONTENT_BASE_SECONDARY_SIZE + offset;
			const font = resolveFontStack(next);
			return [
				// DSH's official font hooks (ui-theme base.css passes these through body).
				`:root { --dsh-font-family-text: ${font}; --dsw-font-family: ${font}; }`,
				`body { --dsh-font-family-text: ${font}; --dsw-font-family: ${font}; font-family: ${font} !important; }`,
				// Reading surface scoped variable for components that read it inside chat.
				`[data-slot^="conversation."] { --dsw-font-family: ${font}; }`,
				// DSH content typography variables consumed by the shipped chat UI.
				`:root {`,
				`  --dsh-content-font-size: ${bodySize}px;`,
				`  --dsh-content-font-delta: ${offset}px;`,
				`  --dsh-content-font-size-secondary: ${secondarySize}px;`,
				`  --dsh-content-font-delta-secondary: ${offset}px;`,
				`}`,
			].join("\n");
		}

		/** Write the content typography + chat width variables onto the live DOM. */
		function syncChatDom() {
			try {
				const offset = Math.max(-2, Math.min(2, Number(state.fontSizeOffset) || 0));
				const bodySize = CONTENT_BASE_FONT_SIZE + offset;
				const secondarySize = CONTENT_BASE_SECONDARY_SIZE + offset;
				const width = CHAT_WIDTH_PX[state.chatWidth] ?? 720;
				const root = document.documentElement;
				root.style.setProperty("--dsh-content-font-size", bodySize + "px");
				root.style.setProperty("--dsh-content-font-delta", offset + "px");
				root.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
				root.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
				if (document.body !== null && document.body !== undefined) {
					document.body.style.setProperty("--dsh-content-font-size", bodySize + "px");
					document.body.style.setProperty("--dsh-content-font-delta", offset + "px");
					document.body.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
					document.body.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
				}
				// DSH declares its chat width on the conversation body element, which
				// inherits over any :root value — mirror the variables down the chain.
				const slots = document.querySelectorAll?.('[data-slot^="conversation."]') ?? [];
				for (const slot of slots) {
					let node = slot;
					for (let depth = 0; depth < 12 && node !== null && node !== undefined && node !== document.body; depth++) {
						node.style.setProperty("--dsh-chat-content-width", width + "px");
						node.style.setProperty("--dsh-composer-card-max-width", (width + 32) + "px");
						node.style.setProperty("--dsh-content-font-size", bodySize + "px");
						node.style.setProperty("--dsh-content-font-delta", offset + "px");
						node.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
						node.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
						node = node.parentElement;
					}
				}
			} catch {
				// DOM sync is best-effort
			}
		}

		let chatDomObserver = null;
		let chatDomTimer = 0;

		/** Debounced re-sync (chat mounts after boot, resize is cheap to follow). */
		function scheduleChatDomSync() {
			if (chatDomTimer !== 0) return;
			chatDomTimer = setTimeout(() => {
				chatDomTimer = 0;
				syncChatDom();
				syncMediaViewer();
			}, 120);
		}

		/** Keep the live DOM in sync as the conversation surface mounts and resizes. */
		function watchChatDom() {
			syncChatDom();
			if (chatDomObserver !== null) return;
			if (typeof MutationObserver === "undefined") return;
			chatDomObserver = new MutationObserver(() => {
				syncMediaViewer();
				scheduleChatDomSync();
			});
			chatDomObserver.observe(document.body, { childList: true, subtree: true });
			window.addEventListener("resize", scheduleChatDomSync);
			document.addEventListener(
				"pointerdown",
				(event) => {
					// Start the fade while the lightbox is still opening (conversation images only).
					try {
						const target = event.target;
						const image = target?.closest?.("img");
						if (image === null || image === undefined) return;
						if (image.closest?.('[data-slot^="conversation."]') === null) return;
						document.documentElement.setAttribute("data-hana-media-open", "");
						setTimeout(syncMediaViewer, 900);
					} catch {
						// best-effort
					}
				},
				true
			);
			syncMediaViewer();
		}

		/** Persist the DSH width preference and mirror all effects onto the DOM. */
		function applyChatWidth(next) {
			const width = CHAT_WIDTH_PX[next.chatWidth] ?? 720;
			try {
				window.localStorage.setItem(DSH_CONTENT_WIDTH_KEY, String(width));
			} catch {
				// preference write is best-effort
			}
			syncChatDom();
		}

		/**
		 * Paint the whole appearance onto the running UI: font stack, paper
		 * texture layer (html[data-hana-paper-texture] + strength variable,
		 * matching HanaAgent's PaperTextureLayer) and the selected theme.
		 */
		function paint(ctx) {
			if (styleEl === null) {
				styleEl = document.createElement("style");
				styleEl.id = "dsh-hana-appearance-style";
				document.head.appendChild(styleEl);
			}
			styleEl.textContent = buildCss(state);
			applyChatWidth(state);
			const root = document.documentElement;
			if (state.texture === "off") {
				root.removeAttribute("data-hana-paper-texture");
			} else {
				root.setAttribute("data-hana-paper-texture", state.texture);
			}
			root.style.setProperty("--paper-texture-strength", String(TEXTURE_STRENGTH_VALUES[clampStrength(state.textureStrength) - 1]));
			const current = ctx.theme.getTheme().preference;
			if (state.theme !== DEFAULT_SKIN) {
				if (current !== state.theme) {
					lastSelfSetAt = Date.now();
					ctx.theme.setTheme(state.theme);
				}
			} else if (THEME_BY_ID.has(current)) {
				lastSelfSetAt = Date.now();
				ctx.theme.setTheme(DEFAULT_SKIN);
			}
			void current;
			try {
				updateSunny(state);
			} catch {
				// decorative overlay only
			}
		}

		/** Disposer bundle for the applier's DOM nodes. */
		function disposeApplier() {
			if (styleEl !== null) styleEl.remove();
			styleEl = null;
			if (pageStyleEl !== null) pageStyleEl.remove();
			pageStyleEl = null;
			if (paperLayer !== null) paperLayer.remove();
			paperLayer = null;
			stopSunny();
			try {
				document.documentElement.removeAttribute("data-hana-paper-texture");
			} catch {
				// document may already be gone during teardown
			}
		}
		//#endregion

		//#region dsh-hana-appearance: page UI (ported settings look)
		const C = react.createElement;

		/* Inline styles everywhere: the settings surface's own style scoping
		 * must not drop the layout. Colors come from per-page CSS variables
		 * (--hana-*) so the page keeps HanaAgent's ink strength in every theme. */
		const CARD = {
			background: "var(--hana-card)",
			border: "1px solid var(--hana-border)",
			borderRadius: 10,
			overflow: "hidden",
		};
		const ROW = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 16,
			padding: "14px 16px",
		};
		const ROW_TEXT = { display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 };
		const ROW_LABEL = { fontSize: 14, lineHeight: 1.4, color: "var(--hana-text)" };
		const ROW_HINT = { fontSize: 12, lineHeight: 1.5, color: "var(--hana-muted)" };
		const DIVIDER = { borderTop: "1px solid var(--hana-border)" };
		const SECTION = { marginBottom: 32 };
		const SECTION_HEAD = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, margin: "0 0 12px" };
		const SECTION_TITLE = {
			fontSize: 17,
			fontWeight: 700,
			letterSpacing: "0.05em",
			color: "var(--hana-text)",
			margin: 0,
		};
		const SECTION_DESC = { fontSize: 12, lineHeight: 1.5, color: "var(--hana-muted)", margin: "-4px 0 12px" };
		const SEG_BOX = {
			display: "inline-flex",
			alignItems: "center",
			gap: 2,
			padding: 2,
			borderRadius: 8,
			background: "var(--hana-seg-bg)",
		};
		const SEG_BTN = {
			border: "none",
			font: "inherit",
			fontSize: 14,
			lineHeight: 1.3,
			padding: "6px 14px",
			borderRadius: 6,
			cursor: "pointer",
			whiteSpace: "nowrap",
		};
		const LINK_BTN = {
			background: "transparent",
			border: "none",
			font: "inherit",
			fontSize: 13,
			color: "var(--hana-muted)",
			cursor: "pointer",
			padding: "4px 6px",
		};

		const LANGUAGE_OPTIONS = [
			{ value: "zh-CN", label: "简体中文" },
			{ value: "zh-TW", label: "繁體中文" },
			{ value: "ja", label: "日本語" },
			{ value: "ko", label: "한국어" },
			{ value: "en", label: "English" },
		];
		const TIMEZONE_OPTIONS = [
			{ value: "Asia/Shanghai", label: "Asia/Shanghai (GMT+8)" },
			{ value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
			{ value: "Asia/Seoul", label: "Asia/Seoul (GMT+9)" },
			{ value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
			{ value: "Asia/Hong_Kong", label: "Asia/Hong Kong (GMT+8)" },
			{ value: "Asia/Taipei", label: "Asia/Taipei (GMT+8)" },
			{ value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
			{ value: "Europe/Berlin", label: "Europe/Berlin (GMT+1)" },
			{ value: "UTC", label: "UTC (GMT+0)" },
		];
		const CHAT_WIDTH_OPTIONS = [
			{ value: "640", label: "640" },
			{ value: "720", label: "720" },
			{ value: "800", label: "800" },
			{ value: "unlimited", label: "不限制" },
		];
		const OFFSET_OPTIONS = [
			{ value: -2, label: "-2" },
			{ value: -1, label: "-1" },
			{ value: 0, label: "0" },
			{ value: 1, label: "+1" },
			{ value: 2, label: "+2" },
		];
		const FONT_OPTIONS = [
			{ id: "serif", name: "衬线", desc: "适合正文阅读" },
			{ id: "sans", name: "非衬线", desc: "更接近系统界面" },
			{ id: "wenkai", name: "霞鹜新致宋", desc: "开源宋体 · 需下载 10.0MB" },
		];
		const EDITOR_FONT_OPTIONS = [
			{ value: "follow", label: "跟随阅读字体" },
			{ value: "serif", label: "衬线" },
			{ value: "sans", label: "非衬线" },
			{ value: "wenkai", label: "霞鹜新致宋" },
			{ value: "custom", label: "自定义字体" },
		];

		/** One titled settings section (title outside the card, like HanaAgent). */
		function Section({ title, description, action, children }) {
			return C(
				"section",
				{ style: SECTION },
				title ? C("div", { style: SECTION_HEAD }, C("h2", { style: SECTION_TITLE }, title), action ?? null) : null,
				description ? C("div", { style: SECTION_DESC }, description) : null,
				children
			);
		}

		/** Card body: consecutive rows with full-bleed hairline dividers. */
		function Card({ rows }) {
			const items = (rows ?? []).filter(Boolean).map((row, index) =>
				index === 0 ? row : C("div", { key: `divider-${index}`, style: DIVIDER }, row)
			);
			return C("div", { style: CARD }, items);
		}

		/** One label/hint + control row. */
		function Row({ label, hint, control }) {
			return C(
				"div",
				{ style: ROW },
				C(
					"div",
					{ style: ROW_TEXT },
					C("span", { style: ROW_LABEL }, label),
					hint ? C("span", { style: ROW_HINT }, hint) : null
				),
				C("div", { style: { flexShrink: 0, display: "flex", alignItems: "center" } }, control)
			);
		}

		/** Pill segmented control. */
		function Segmented({ options, value, onChange }) {
			return C(
				"div",
				{ style: SEG_BOX },
				options.map((option) =>
					C(
						"button",
						{
							key: String(option.value),
							type: "button",
							onClick: () => onChange(option.value),
							style: {
								...SEG_BTN,
								background: option.value === value ? "var(--hana-seg-active)" : "transparent",
								color: option.value === value ? "var(--hana-text)" : "var(--hana-muted)",
								boxShadow: option.value === value ? "0 1px 2px rgba(0, 0, 0, 0.08)" : "none",
							},
						},
						option.label
					)
				)
			);
		}

		/** HanaAgent-style dropdown: a real popup panel, not a native <select>. */
		function Dropdown({ options, value, onChange, ariaLabel, placeholder }) {
			const [open, setOpen] = react.useState(false);
			const [rect, setRect] = react.useState(null);
			const [hover, setHover] = react.useState(-1);
			const btnRef = react.useRef(null);
			const popRef = react.useRef(null);

			react.useEffect(() => {
				if (!open) return undefined;
				const onDown = (event) => {
					if (btnRef.current && btnRef.current.contains(event.target)) return;
					if (popRef.current && popRef.current.contains(event.target)) return;
					setOpen(false);
				};
				const onKey = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onDown, true);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown, true);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);

			const toggle = () => {
				if (!open && btnRef.current) {
					const r = btnRef.current.getBoundingClientRect();
					setRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 220) });
					setHover(Math.max(0, options.findIndex((option) => option.value === value)));
				}
				setOpen(!open);
			};

			const selected = options.find((option) => option.value === value);

			return C(
				"div",
				{ style: { position: "relative", display: "inline-block" } },
				C(
					"button",
					{
						ref: btnRef,
						type: "button",
						"aria-label": ariaLabel,
						"aria-expanded": open,
						onClick: toggle,
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 12,
							minWidth: 220,
							maxWidth: 320,
							padding: "8px 12px",
							font: "inherit",
							fontSize: 14,
							color: "var(--hana-text)",
							background: "var(--hana-card)",
							border: "1px solid var(--hana-border)",
							borderRadius: 8,
							cursor: "pointer",
							textAlign: "left",
						},
					},
					C("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, selected ? selected.label : placeholder ?? ""),
					C("span", { style: { color: "var(--hana-muted)", fontSize: 11 } }, "▾")
				),
				open && rect
					? C(
							"div",
							{
								ref: popRef,
								style: {
									position: "fixed",
									top: rect.top,
									left: rect.left,
									width: rect.width,
									maxHeight: 280,
									overflowY: "auto",
									background: "var(--hana-card)",
									border: "1px solid var(--hana-border)",
									borderRadius: 8,
									boxShadow: "0 10px 28px rgba(0, 0, 0, 0.14)",
									padding: 4,
									zIndex: 10000,
								},
							},
							options.map((option, index) =>
								C(
									"button",
									{
										key: String(option.value),
										type: "button",
										onMouseEnter: () => setHover(index),
										onClick: () => {
											onChange(option.value);
											setOpen(false);
										},
										style: {
											display: "block",
											width: "100%",
											textAlign: "left",
											border: "none",
											background: hover === index ? "var(--hana-seg-bg)" : "transparent",
											color: option.value === value ? "var(--hana-accent)" : "var(--hana-text)",
											font: "inherit",
											fontSize: 14,
											padding: "9px 12px",
											borderRadius: 6,
											cursor: "pointer",
										},
									},
									option.label
								)
							)
						)
					: null
			);
		}

		/** Numeric box with a unit suffix (HanaAgent NumberInput look). */
		function NumberBox({ value, onChange, min, max, step, unit }) {
			return C(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 6,
						minWidth: 130,
						justifyContent: "flex-end",
						padding: "7px 12px",
						border: "1px solid var(--hana-border)",
						borderRadius: 8,
						background: "var(--hana-card)",
					},
				},
				C("input", {
					type: "number",
					value,
					min,
					max,
					step,
					onChange: (event) => {
						const next = Number(event.target.value);
						if (Number.isFinite(next)) onChange(next);
					},
					style: {
						width: 70,
						border: "none",
						outline: "none",
						background: "transparent",
						font: "inherit",
						fontSize: 14,
						color: "var(--hana-text)",
						textAlign: "right",
					},
				}),
				unit ? C("span", { style: { fontSize: 12, color: "var(--hana-muted)" } }, unit) : null
			);
		}

		/** HanaAgent-style 5-step slider with a round value badge. */
		/* StepSlider — 按 HanaAgent 已安装版本（1.5.118）的组件结构原样端口。
		 * 结构：slider > rail > [underlay(segments), input, handleLayer(handle > value roll), sizer]
		 * 数值滚动：AnimatePresence + spring(paperSnap) 的 variants（enter/center/exit），
		 * 这里用 Web Animations 复刻同样的位移/透明度/方向/时长与她的 linear() 弹簧缓动。 */
		const HANA_EASE_PAPER_SPRING =
			"linear(0, 0.01, 0.036, 0.075, 0.125, 0.182, 0.244, 0.309, 0.375, 0.441, 0.506, 0.568, 0.627, 0.682, 0.733, 0.78, 0.823, 0.862, 0.896, 0.925, 0.951, 0.974, 0.992, 1.008, 1.02, 1.03, 1.038, 1.043, 1.047, 1.049, 1.05, 1.05, 1.049, 1.047, 1.045, 1.042, 1.039, 1.036, 1.032, 1.029, 1.026, 1.022, 1.019, 1.017, 1.014, 1.012, 1.009, 1.007, 1)";

		/** One value roll layer pair (port of HanaAgent's Roll glyph component). */
		function StepSliderValue({ text, order }) {
			const hostRef = react.useRef(null);
			const previous = react.useRef(null);
			const direction = react.useRef(1);
			react.useEffect(() => {
				const host = hostRef.current;
				if (host === null || host === undefined) return undefined;
				// Drop stray text nodes left by earlier renders.
				for (const node of Array.from(host.childNodes ?? [])) {
					if (node.nodeType !== 1) node.remove();
				}
				const previousState = previous.current;
				if (previousState !== null && previousState.text === text) return undefined;
				direction.current = previousState === null ? 1 : order >= previousState.order ? 1 : -1;
				previous.current = { text, order };
				const reduce =
					typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
				const layers = Array.from(host.children ?? []);
				const next = document.createElement("span");
				next.className = "hana-step-roll-layer";
				next.textContent = text;
				host.appendChild(next);
				const settle = () => {
					next.style.transform = "";
					next.style.opacity = "1";
				};
				if (layers.length === 0) {
					settle();
					return undefined;
				}
				if (typeof host.animate !== "function" || reduce) {
					for (const layer of layers) layer.remove();
					settle();
					return undefined;
				}
				const duration = 210;
				const enterAnimation = next.animate(
					[
						{ transform: "translateY(" + (direction.current > 0 ? 100 : -100) + "%)", opacity: 0 },
						{ transform: "translateY(0%)", opacity: 1 },
					],
					{ duration, easing: HANA_EASE_PAPER_SPRING, fill: "both" }
				);
				enterAnimation.onfinish = settle;
				const timers = [];
				for (const layer of layers) {
					const drop = () => {
						try {
							layer.remove();
						} catch {
							// already detached
						}
					};
					const exitAnimation = layer.animate(
						[
							{ transform: "translateY(0%)", opacity: 1 },
							{ transform: "translateY(" + (direction.current > 0 ? -100 : 100) + "%)", opacity: 0 },
						],
						{ duration, easing: HANA_EASE_PAPER_SPRING, fill: "both" }
					);
					exitAnimation.onfinish = drop;
					timers.push(setTimeout(drop, duration + 120));
				}
				return () => {
					enterAnimation.cancel?.();
					settle();
					for (const timer of timers) clearTimeout(timer);
				};
			}, [text, order]);
			return C("div", { className: "hana-step-value", ref: hostRef });
		}

		function StepSlider({ value, onChange, ariaLabel }) {
			const steps = 5;
			const current = Math.max(1, Math.min(steps, Number(value) || 1));
			const index = current - 1;
			const ratio = (index / (steps - 1)) || 0;
			const label = String(current);
			const segments = Array.from({ length: steps - 1 }, (_, i) => i);
			const sizerRef = react.useRef(null);
			const [labelWidth, setLabelWidth] = react.useState(0);
			const [mounted, setMounted] = react.useState(false);
			react.useEffect(() => {
				setMounted(true);
			}, []);
			react.useLayoutEffect
				? react.useLayoutEffect(() => {
						const node = sizerRef.current;
						if (node === null || node === undefined) return;
						const measure = () => {
							const width = node.getBoundingClientRect?.().width ?? 0;
							if (width > 0) setLabelWidth(width);
						};
						measure();
						const Observer = window.ResizeObserver;
						if (typeof Observer !== "function") return undefined;
						const observer = new Observer(measure);
						observer.observe(node);
						return () => observer.disconnect();
					}, [label])
				: undefined;
			const handleStyle = { "--hana-step-progress": ratio };
			if (labelWidth > 0) handleStyle["--hana-step-label-width"] = labelWidth + "px";
			return C(
				"div",
				{ className: "hana-step-slider" },
				C(
					"div",
					{ className: "hana-step-rail" },
					C(
						"div",
						{ className: "hana-step-underlay", "aria-hidden": "true" },
						C(
							"div",
							{ className: "hana-step-segments", "data-step-slider-segments": "" },
							segments.map((segment) =>
								C("span", {
									key: segment,
									className: "hana-step-segment",
									"data-on": segment < index ? "1" : "0",
								})
							)
						)
					),
					C("input", {
						className: "hana-step-input",
						type: "range",
						min: 0,
						max: steps - 1,
						step: 1,
						value: index,
						"aria-label": ariaLabel,
						"aria-valuetext": label,
						onChange: (event) => onChange(Number(event.target.value) + 1),
					}),
					C(
						"div",
						{ className: "hana-step-handle-layer", "aria-hidden": "true" },
						C(
							"div",
							{
								className: "hana-step-handle",
								"data-step-slider-handle": "",
								"data-animate-width": mounted ? "" : undefined,
								style: handleStyle,
							},
							C(StepSliderValue, { text: label, order: index })
						)
					),
					C("span", {
						ref: sizerRef,
						className: "hana-step-sizer",
						"data-step-slider-sizer": "",
						"aria-hidden": "true",
					}, label)
				)
			);
		}

		/** HanaAgent-style switch. */
		function Toggle({ on, onChange, ariaLabel }) {
			return C(
				"button",
				{
					type: "button",
					role: "switch",
					"aria-checked": on === true,
					"aria-label": ariaLabel,
					onClick: () => onChange(on !== true),
					style: {
						position: "relative",
						width: 40,
						height: 22,
						borderRadius: 999,
						border: "none",
						padding: 0,
						cursor: "pointer",
						background: on === true ? "var(--hana-accent)" : "var(--hana-border)",
					},
				},
				C("span", {
					style: {
						position: "absolute",
						top: 2,
						left: on === true ? 20 : 2,
						width: 18,
						height: 18,
						borderRadius: "50%",
						background: "#FFFFFF",
						boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
					},
				})
			);
		}

		function themeCardInk(theme) {
			const match = /^#([0-9a-f]{6})$/i.exec(theme.pageColor);
			if (theme.colorScheme === "dark") return "#F5EFE4";
			if (match === null) return "#2A2622";
			const value = parseInt(match[1], 16);
			const r = (value >> 16) & 255;
			const g = (value >> 8) & 255;
			const b = value & 255;
			return 0.299 * r + 0.587 * g + 0.114 * b < 140 ? "#F5EFE4" : "#2A2622";
		}

		function ThemeCard({ theme, selected, onSelect }) {
			const tokens = THEME_BY_ID.get(theme.id)?.tokens ?? {};
			const nameColor = tokens["--dsw-alias-label-primary"] ?? themeCardInk(theme);
			const modeColor = tokens["--dsw-alias-label-secondary"] ?? nameColor;
			return C(
				"button",
				{
					type: "button",
					title: theme.name,
					onClick: onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 3,
						minHeight: 66,
						padding: "10px 8px",
						borderRadius: 10,
						cursor: "pointer",
						background: theme.pageColor,
						color: nameColor,
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 18%, transparent)" : "none",
					},
				},
				C("span", { style: { fontSize: 16, fontWeight: 600, lineHeight: 1.35 } }, theme.name),
				C("span", { style: { fontSize: 12, lineHeight: 1.3, color: modeColor } }, theme.mode)
			);
		}

		function AutoCard({ selected, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					title: "自动",
					onClick: onSelect,
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						alignItems: "center",
						justifyItems: "center",
						columnGap: 0,
						minHeight: 66,
						padding: "10px 8px",
						borderRadius: 10,
						cursor: "pointer",
						background: `linear-gradient(90deg, ${AUTO_LIGHT} 50%, ${AUTO_DARK} 50%)`,
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 18%, transparent)" : "none",
					},
				},
				C("span", { style: { gridColumn: "1", fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: "#2A2622" } }, "自动"),
				C("span", { style: { gridColumn: "2", fontSize: 12, lineHeight: 1.3, color: "#F5EFE4" } }, "跟随系统")
			);
		}

		function AppIconCard({ icon, selected, disabled, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					title: icon.name,
					"aria-pressed": selected,
					disabled: disabled === true,
					onClick: disabled === true ? undefined : onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						width: "100%",
						minHeight: 96,
						padding: "12px 8px",
						border: "none",
						background: "transparent",
						cursor: disabled === true ? "default" : "pointer",
						borderRadius: 10,
						opacity: disabled === true ? 0.55 : 1,
					},
				},
				C("img", {
					src: iconAssetUrl(icon.file),
					alt: icon.name,
					width: 56,
					height: 56,
					draggable: false,
					style: {
						borderRadius: 14,
						outline: selected ? "2px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						outlineOffset: 2,
						objectFit: "cover",
					},
				}),
				C(
					"span",
					{ style: { fontSize: 13, color: selected ? "var(--hana-accent)" : "var(--hana-muted)" } },
					icon.name
				)
			);
		}

		function FontCard({ option, selected, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					"aria-pressed": selected,
					onClick: onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 4,
						minHeight: 84,
						padding: "12px 16px",
						borderRadius: 10,
						cursor: "pointer",
						background: "var(--hana-card)",
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 14%, transparent)" : "none",
						color: "var(--hana-text)",
					},
				},
				C(
					"span",
					{ style: { fontFamily: resolveFontStack({ ...getState(), font: option.id }), fontSize: 18, lineHeight: 1.5, letterSpacing: "0.02em" } },
					"永和九年，岁在癸丑。"
				),
				C("span", { style: { fontSize: 13, fontWeight: 600 } }, option.name),
				C("span", { style: { fontSize: 11, color: "var(--hana-muted)" } }, option.desc)
			);
		}

		/** File picker button + hidden input for a custom reading font. */
		function CustomFontPicker({ onPick }) {
			const inputRef = react.useRef(null);
			return C(
				"div",
				{ style: { display: "flex", alignItems: "center", gap: 8 } },
				C(
					"button",
					{
						type: "button",
						onClick: () => inputRef.current?.click(),
						style: {
							display: "flex",
							alignItems: "center",
							gap: 6,
							padding: "7px 14px",
							font: "inherit",
							fontSize: 14,
							color: "var(--hana-text)",
							background: "var(--hana-seg-bg)",
							border: "1px solid var(--hana-border)",
							borderRadius: 8,
							cursor: "pointer",
						},
					},
					"导入"
				),
				C("input", {
					ref: inputRef,
					type: "file",
					accept: ".ttf,.otf,.woff,.woff2",
					style: { display: "none" },
					onChange: (event) => {
						const file = event.target.files && event.target.files[0];
						if (file) onPick(file);
						event.target.value = "";
					},
				})
			);
		}

		/** Register one imported font file and remember its family name. */
		function loadCustomFont(file) {
			const reader = new FileReader();
			reader.onload = () => {
				const family = "HanaCustom-" + Date.now();
				try {
					const face = new FontFace(family, reader.result);
					face.load().then((loaded) => {
						document.fonts.add(loaded);
						setState({ font: "custom", customFontName: family, customFontLabel: file.name.replace(/\.[^.]+$/, "") });
					});
				} catch {
					// unsupported font file — ignore
				}
			};
			reader.readAsArrayBuffer(file);
		}

		/** First-level "HanaUI" settings page (layout mirrors HanaAgent 界面 tab). */
		function HanaUiPage() {
			const [snapshot, setSnapshot] = react.useState(getState);
			react.useEffect(() => subscribe(() => setSnapshot({ ...getState() })), []);
			const setSkinState = setState;

			const fontStatus = getFontStatus();

			/* Windows desktop icon sync: selection comes from the host bridge
			 * route, which rewrites the shortcuts and the window icon. */
			const [iconStatus, setIconStatus] = react.useState(() => getAppIconStatus());
			const [iconBusy, setIconBusy] = react.useState(false);
			const [iconError, setIconError] = react.useState(null);
			react.useEffect(() => {
				let alive = true;
				void refreshAppIconStatus().then((status) => {
					if (!alive || status === null) return;
					setIconStatus(status);
					if (status.supported === true) {
						const applied = typeof status.applied === "string" && APP_ICON_IDS.includes(status.applied) ? status.applied : "default";
						if (getState().appIcon !== applied) setState({ appIcon: applied });
					}
				});
				return () => {
					alive = false;
				};
			}, []);
			const chooseAppIcon = (iconId) => {
				setIconBusy(true);
				setIconError(null);
				void applyAppIcon(iconId)
					.then((status) => {
						const applied =
							status.supported === false
								? getState().appIcon
								: status.applied === null || status.applied === undefined
									? "default"
									: status.applied;
						if (typeof applied === "string" && (applied === "default" || APP_ICON_IDS.includes(applied))) setState({ appIcon: applied });
						setIconStatus(status);
					})
					.catch((error) => {
						setIconError(error instanceof Error ? error.message : String(error));
					})
					.finally(() => setIconBusy(false));
			};

			/* Ink strength follows the active Hana palette (HanaAgent look). */
			const dark = isDarkMode(snapshot.theme);
			const tokens = THEME_BY_ID.get(snapshot.theme)?.tokens ?? {};
			const pageVars = {
				"--hana-text": tokens["--dsw-alias-label-primary"] ?? (dark ? "#EDE8DE" : "#2A2622"),
				"--hana-muted": tokens["--dsw-alias-label-secondary"] ?? (dark ? "#C6BEB1" : "#4A433C"),
				"--hana-border": tokens["--dsw-alias-border-l2"] ?? (dark ? "rgba(255,255,255,0.18)" : "#D8CFBE"),
				"--hana-card": tokens["--dsw-alias-bg-layer-1"] ?? (dark ? "#2F3E48" : "#FBF7EE"),
				"--hana-accent": tokens["--dsw-alias-brand-primary"] ?? "#537D96",
				"--hana-on-accent": "#FFFFFF",
				"--hana-seg-bg": dark ? "rgba(255,255,255,0.08)" : "rgba(42,38,34,0.05)",
				"--hana-seg-active": tokens["--dsw-alias-bg-base"] ?? (dark ? "#3B4A54" : "#FBFAF7"),
			};

			const themeCards = THEMES.map((theme) =>
				C(ThemeCard, {
					key: theme.id,
					theme,
					selected: snapshot.theme === theme.id,
					onSelect: () => setSkinState({ theme: theme.id }),
				})
			);

			const savedTrees = snapshot.sunnySavedSeeds;
			const currentSeed = typeof snapshot.sunnySeed === "number" ? snapshot.sunnySeed : 0;
			const languageOptions = getDshLanguageOptions();
			const treeOptions = [
				{ value: "default", label: "默认" },
				...savedTrees.map((seed, index) => ({ value: String(seed), label: `树 #${index + 1}` })),
				...(currentSeed !== 0 && !savedTrees.includes(currentSeed) ? [{ value: String(currentSeed), label: "新的树" }] : []),
			];

			const customFontOptions =
				snapshot.font === "custom" && snapshot.customFontLabel
					? [{ value: "custom", label: snapshot.customFontLabel }]
					: [{ value: "", label: "尚未导入字体" }];

			return C(
				"div",
				{
					style: {
						...pageVars,
						display: "flex",
						flexDirection: "column",
						maxWidth: 780,
						paddingBottom: 24,
						color: "var(--hana-text)",
					},
				},
				// ── 语言和地区 ──
				C(
					Section,
					{ title: "语言和地区" },
					C(Card, {
						rows: [
							C(Row, {
								key: "language",
								label: "语言",
								hint: "切换语言后需要重新加载",
								control: C(Dropdown, {
									ariaLabel: "语言",
									options: languageOptions,
									value: snapshot.language,
									onChange: (language) => chooseLanguage(language),
								}),
							}),
							C(Row, {
								key: "timezone",
								label: "时区",
								hint: "用于记忆时间标记、日记等",
								control: C(Dropdown, {
									ariaLabel: "时区",
									options: TIMEZONE_OPTIONS,
									value: snapshot.timezone,
									onChange: (timezone) => setSkinState({ timezone }),
								}),
							}),
						],
					})
				),
				// ── 主题 ──
				C(
					Section,
					{ title: "主题" },
					C(
						"div",
						{ style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 } },
						themeCards[0],
						themeCards[1],
						C(AutoCard, { selected: snapshot.theme === DEFAULT_SKIN, onSelect: () => setSkinState({ theme: DEFAULT_SKIN }) }),
						...themeCards.slice(2)
					)
				),
				// ── 应用图标 ──
				C(
					Section,
					{
						title: "应用图标",
						description: "把桌面、开始菜单、任务栏和窗口缩略图上的图标换成选中的样式（仅 Windows 桌面版）",
						action: C(
							"button",
							{
								type: "button",
								style: LINK_BTN,
								disabled: iconBusy || iconStatus?.supported === false,
								onClick: () => chooseAppIcon("default"),
							},
							"恢复默认"
						),
					},
					C(
						"div",
						null,
						C(
							"div",
							{ style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 } },
							APP_ICONS.map((entry) =>
								C(AppIconCard, {
									key: entry.id,
									icon: entry,
									selected: snapshot.appIcon === entry.id,
									disabled: iconBusy || iconStatus?.supported === false,
									onSelect: () => chooseAppIcon(entry.id),
								})
							)
						),
						iconStatus?.supported === false
							? C(
									"div",
									{ style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } },
									"当前环境不支持修改应用图标：请在 Windows 桌面版 DSH 中使用。"
								)
							: null,
						iconBusy
							? C("div", { style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } }, "正在更新快捷方式…")
							: null,
						iconError !== null
							? C("div", { style: { marginTop: 8, fontSize: 12, color: "#B33A2B" } }, "修改失败：" + iconError)
							: null,
						iconStatus !== null && iconStatus.supported === true && typeof iconStatus.updated === "number" && iconStatus.updated > 0
							? C(
									"div",
									{ style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } },
									"已更新 " +
										iconStatus.updated +
										" 个快捷方式" +
										(iconStatus.failed > 0 ? "，" + iconStatus.failed + " 个失败" : "") +
										"；窗口图标会在几秒内刷新。"
								)
							: null
					)
				),
				// ── 字体 ──
				C(
					Section,
					{ title: "字体", description: "选择正文阅读使用的字体" },
					C(
						"div",
						{ style: { ...CARD, marginBottom: 12 } },
						C(
							"div",
							{ style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72, padding: "0 16px" } },
							C("span", { style: { fontFamily: resolveFontStack(snapshot), fontSize: 22, letterSpacing: "0.02em" } }, "永和九年，岁在癸丑。")
						)
					),
					C(
						"div",
						{ style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 12 } },
						FONT_OPTIONS.map((option) => {
							const desc =
								option.id !== "wenkai"
									? option.desc
									: snapshot.wenkaiReady === true
										? "开源宋体"
										: fontStatus.status === "downloading"
											? `下载中 · ${fontStatus.progress}%`
											: fontStatus.status === "verifying"
												? "校验字体…"
												: fontStatus.status === "failed"
													? "下载失败，点击重试"
													: "开源宋体 · 需下载 10.0MB";
							return C(FontCard, {
								key: option.id,
								option: { ...option, desc },
								selected: snapshot.font === option.id,
								onSelect: () => {
									if (option.id === "wenkai" && snapshot.wenkaiReady !== true) {
										void installWenkaiFont();
										return;
									}
									setSkinState({ font: option.id });
								},
							});
						})
					),
					C(Card, {
						rows: [
							C(Row, {
								key: "custom-font",
								label: "自定义字体",
								control: C(
									"div",
									{ style: { display: "flex", alignItems: "center", gap: 8 } },
									C(Dropdown, {
										ariaLabel: "自定义字体",
										options: customFontOptions,
										value: snapshot.font === "custom" ? "custom" : "",
										onChange: () => {},
									}),
									C(CustomFontPicker, { onPick: loadCustomFont })
								),
							}),
							C(Row, {
								key: "font-size",
								label: "正文字号",
								control: C(Segmented, { options: OFFSET_OPTIONS, value: snapshot.fontSizeOffset, onChange: (fontSizeOffset) => setSkinState({ fontSizeOffset }) }),
							}),
							C(Row, {
								key: "chat-width",
								label: "聊天宽度",
								control: C(Segmented, { options: CHAT_WIDTH_OPTIONS, value: snapshot.chatWidth, onChange: (chatWidth) => setSkinState({ chatWidth }) }),
							}),
						],
					})
				),
				// ── 外观 ──
				C(
					Section,
					{ title: "外观" },
					C(Card, {
						rows: [
							C(Row, {
								key: "texture",
								label: "纸质纹理",
								hint: "为画布、侧边面板和设置页加上纸张质感。",
								control: C(Segmented, { options: TEXTURE_OPTIONS, value: snapshot.texture, onChange: (texture) => setSkinState({ texture }) }),
							}),
							C(Row, {
								key: "strength",
								label: "纹理强度",
								control: C(StepSlider, { ariaLabel: "纹理强度", value: snapshot.textureStrength, onChange: (textureStrength) => setSkinState({ textureStrength }) }),
							}),
							C(Row, {
								key: "toolicon",
								label: "工具调用图标",
								control: C(Segmented, {
									options: [
										{ value: "emoji", label: "Emoji" },
										{ value: "svg", label: "SVG" },
									],
									value: snapshot.toolIcon,
									onChange: (toolIcon) => setSkinState({ toolIcon }),
								}),
							}),
						],
					})
				),
				// ── 晴天模式 ──
				C(
					Section,
					{ title: null },
					C(Card, {
						rows: [
							C(Row, {
								key: "sunny",
								label: "晴天模式",
								hint: "没事儿晒晒太阳",
								control: C(Toggle, { ariaLabel: "晴天模式", on: snapshot.sunnyMode, onChange: (sunnyMode) => setSkinState({ sunnyMode }) }),
							}),
							C(Row, {
								key: "sunny-tree",
								label: "选一棵树",
								control: C(Dropdown, {
									ariaLabel: "选一棵树",
									options: treeOptions,
									value: currentSeed === 0 ? "default" : String(currentSeed),
									onChange: (value) => setSkinState({ sunnySeed: value === "default" ? 0 : Number(value) }),
								}),
							}),
							C(Row, {
								key: "sunny-new",
								label: "我要新的树",
								control: C(
									"div",
									{ style: { display: "flex", alignItems: "center", gap: 8 } },
									C(NumberBox, {
										value: currentSeed,
										min: 0,
										max: 999999999,
										step: 1,
										onChange: (sunnySeed) => setSkinState({ sunnySeed: Math.max(0, Math.min(999999999, Math.round(sunnySeed))) }),
									}),
									C(
										"button",
										{
											type: "button",
											onClick: () => setSkinState({ sunnySeed: 1 + Math.floor(Math.random() * 999999999) }),
											style: {
												padding: "7px 14px",
												font: "inherit",
												fontSize: 14,
												border: "none",
												borderRadius: 8,
												background: "var(--hana-seg-bg)",
												color: "var(--hana-text)",
												cursor: "pointer",
											},
										},
										"生成新树"
									),
									C(
										"button",
										{
											type: "button",
											disabled: currentSeed === 0 || savedTrees.includes(currentSeed),
											onClick: () => {
												if (currentSeed === 0 || savedTrees.includes(currentSeed)) return;
												setSkinState({ sunnySavedSeeds: [...savedTrees, currentSeed].slice(-20) });
											},
											style: {
												padding: "7px 14px",
												font: "inherit",
												fontSize: 14,
												border: "none",
												borderRadius: 8,
												background: "var(--hana-seg-bg)",
												color: "var(--hana-muted)",
												cursor: "pointer",
											},
										},
										currentSeed === 0 || savedTrees.includes(currentSeed) ? "此树已保存" : "保存这棵树"
									)
								),
							}),
						],
					})
				),
				C(
					"div",
					{ style: { display: "flex", justifyContent: "flex-end", marginTop: 4 } },
					C("button", { type: "button", style: LINK_BTN, onClick: () => setSkinState({ ...DEFAULT_STATE }) }, "恢复默认")
				)
			);
		}

		/** Nav icon for the HanaUI page (four-dot palette glyph). */
		function HanaUiIcon(props) {
			const size = props && typeof props.size === "number" ? props.size : 16;
			return C(
				"svg",
				{ width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				C("path", {
					d: "M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.3-3.05 1.8 1.8 0 0 1 1.3-3.05H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3Z",
					stroke: "currentColor",
					strokeWidth: 1.6,
				}),
				C("circle", { cx: 7.6, cy: 10.2, r: 1.1, fill: "currentColor" }),
				C("circle", { cx: 10.6, cy: 7.2, r: 1.1, fill: "currentColor" }),
				C("circle", { cx: 14.4, cy: 7.6, r: 1.1, fill: "currentColor" })
			);
		}
		//#endregion





































		//#region dsh-hana-appearance: client plugin body
		/** Slots + theme runtime are required; the page mounts in Settings. */
		exports.inject = ["slots", "theme", "locale"];

		/** @param ctx - client cordis context (slots/theme injected). */
		exports.apply = function apply(ctx) {
			// 1) Register the Hana palettes into the built-in theme runtime.
			const disposers = THEMES.map((theme) =>
				ctx.theme.register({
					id: theme.id,
					name: theme.name,
					colorScheme: theme.colorScheme,
					tokens: theme.tokens,
				})
			);
			ctx.effect(() => () => {
				for (const dispose of disposers) dispose();
			}, "dsh-hana-appearance: theme registration");

			// 2) Static page stylesheet (ported HanaAgent settings styles).
			pageStyleEl = document.createElement("style");
			pageStyleEl.id = "dsh-hana-appearance-page-style";
			pageStyleEl.textContent = PAGE_CSS;
			document.head.appendChild(pageStyleEl);

			// 2b) Fullscreen PaperTextureLayer: hi/lo divs masked by the three
			//     generated paper textures (mottle/fiber/grain). Visible only
			//     while html[data-hana-paper-texture] is set.
			paperLayer = document.createElement("div");
			paperLayer.className = "hana-paper-layer";
			const paperHi = document.createElement("div");
			paperHi.className = "hana-paper-hi";
			const paperLo = document.createElement("div");
			paperLo.className = "hana-paper-lo";
			paperLayer.appendChild(paperHi);
			paperLayer.appendChild(paperLo);
			document.body.appendChild(paperLayer);

			// Remove overlay nodes left behind by older builds of this plugin.
			try {
				const staleLayers = document.querySelectorAll?.('canvas[style*="21474829"], div[style*="21474829"]') ?? [];
				for (const stale of staleLayers) stale.remove();
			} catch {
				// cleanup is best-effort
			}

			// 3) Seed from localStorage, then paint; hydrate the durable file async.
			state = readLocal() ?? readBootCookie() ?? { ...DEFAULT_STATE };
			repaint = () => {
				try {
					paint(ctx);
				} catch {
					// a paint failure must never take the settings page down
				}
			};
			repaint();
			watchChatDom();
			void hydrate();
			void restoreWenkaiFont();
			// Guard: DSH can silently fall back to its built-in theme (boot/config
			// reload/settings mount). Re-assert the chosen skin when that happens.
			const themeGuard = setInterval(() => {
				try {
					const current = ctx.theme.getTheme().preference;
					if (state.theme !== DEFAULT_SKIN) {
						if (current !== state.theme) {
							lastSelfSetAt = Date.now();
							ctx.theme.setTheme(state.theme);
						}
					} else if (THEME_BY_ID.has(current)) {
						lastSelfSetAt = Date.now();
						ctx.theme.setTheme(DEFAULT_SKIN);
					}
				} catch {
					// ignore: theme runtime may be tearing down
				}
			}, 1500);
			ctx.effect(() => () => clearInterval(themeGuard), "dsh-hana-appearance: theme guard");

			// Mirror DSH's own language preference both ways.
			localeFace = typeof ctx.get === "function" ? ctx.get("locale") : null;
			const syncLocale = () => {
				lastLocaleChangeAt = Date.now();
				const info = readDshLocale();
				if (info === null) return;
				if (state.language !== info.active) setState({ language: info.active });
				else notify();
			};
			syncLocale();
			if (localeFace !== null && localeFace !== undefined && typeof localeFace.subscribe === "function") {
				ctx.effect(() => localeFace.subscribe(syncLocale), "dsh-hana-appearance: dsh locale mirror");
			}
			ctx.on("locale/change", syncLocale);

			ctx.effect(() => () => {
				repaint = null;
				disposeApplier();
			}, "dsh-hana-appearance: applier lifecycle");

			// 4) Re-assert our skin when the runtime adopts the document's
			//    built-in preference on boot/settings reload; an explicit
			//    built-in pick hands control back.
			ctx.on("theme/change", (snapshot) => {
				const preference = snapshot?.preference ?? ctx.theme.getTheme().preference;
				const fromSelf = Date.now() - lastSelfSetAt < 800;
				if (preference === DEFAULT_SKIN || preference === "light" || preference === "dark") {
					// DSH re-emits its persisted built-in preference when it boots or
					// reloads settings; that is not a user picking a built-in theme, so the
					// Hana skin stays sticky. The HanaUI 自动 card is the way back.
					if (state.theme !== DEFAULT_SKIN && !fromSelf) {
						lastSelfSetAt = Date.now();
						try {
							ctx.theme.setTheme(state.theme);
						} catch {
							// ignore: theme runtime may be tearing down
						}
					}
					return;
				}
				if (THEME_BY_ID.has(preference) && preference !== state.theme) {
					setState({ theme: preference });
				}
				repaint?.();
			});

		// 5) First-level "HanaUI" page in the Settings nav. Order 21 is the
			//    IM机器人 page (xmanrui-dsh-im); 20 puts HanaUI right before it.
			ctx.slots.inject("settings.section", () =>
				ctx.slots.register(
					{
						name: "settings.section",
						id: "hana-ui",
						order: 20,
						label: () => "HanaUI",
					},
					HanaUiPage
				)
			);
			ctx.slots.inject("settings.section.icon", () =>
				ctx.slots.register({ name: "settings.section.icon", id: "hana-ui" }, HanaUiIcon)
			);
		};
		//#endregion

		exports.THEMES = THEMES;
		exports.DEFAULT_STATE = DEFAULT_STATE;
		return module.exports;
	}
});
