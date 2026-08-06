---
name: Azure Alabaster
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434656'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004dea'
  primary: '#0041c8'
  on-primary: '#ffffff'
  primary-container: '#0055ff'
  on-primary-container: '#e3e6ff'
  inverse-primary: '#b6c4ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#972500'
  on-tertiary: '#ffffff'
  tertiary-container: '#c13301'
  on-tertiary-container: '#ffe1d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b3'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#872100'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system embodies a serene, high-end aesthetic that blends **Minimalism** with subtle **Glassmorphism**. The target audience includes professionals in wellness, high-tech SaaS, and premium editorial platforms who value clarity and a sense of "digital breathing room."

The visual narrative is built on the concept of "Atmospheric Clarity." By moving away from sterile flat white toward a soft, light blue gradient, the UI evokes the feeling of an open sky or a pristine laboratory. The emotional response is one of calm, focus, and precision. Surfaces are treated as semi-translucent layers that interact with the atmospheric background, creating a sense of sophisticated depth without the clutter of heavy shadows.

## Colors

The palette is anchored by a high-contrast primary blue for actions, set against a delicate, ethereal background. 

- **Background:** Transitions from a faint azure at the top to a pure white at the base. This gradient should be applied to the root viewport to provide a consistent environmental tint.
- **Surface:** Components use a semi-transparent white (70-80% opacity) with a background blur to maintain legibility while allowing the soft blue tint to peek through.
- **Contrast:** To ensure perfect legibility, all text uses a deep slate-neutral. Avoid pure black to maintain the "Alabaster" softness while keeping contrast ratios above 7:1 for body text.

## Typography

The typography strategy pairs the modern, refined geometry of **Manrope** for headings with the systematic utility of **Inter** for body text. 

For technical data or metadata labels, **JetBrains Mono** is used at small scales to provide a "precise" counterpoint to the soft visual style. Headlines should utilize tight letter-spacing and heavy weights to stand out against the airy background. Ensure body text maintains a generous line height (1.5x) to support the minimalist, breathable aesthetic.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with generous outer margins to reinforce the sense of exclusivity and calm.

- **Desktop:** A 12-column grid with a 1280px max-width. 
- **Rhythm:** Spacing is strictly based on an 8px base unit. Component internal padding should favor larger values (e.g., 24px or 32px) to prevent the UI from feeling cramped.
- **Adaptation:** On mobile, margins shrink to 16px, and the grid collapses to a single column, but vertical spacing between "cards" remains high (32px+) to maintain the minimalist feel.

## Elevation & Depth

In this design system, depth is achieved through **Glassmorphism** and **Tonal Layers** rather than traditional shadows.

1.  **The Base Layer:** The azure-to-white gradient background.
2.  **The Surface Layer:** Cards and containers use a white fill at 70% opacity with a `20px` backdrop blur. 
3.  **The Stroke:** A ultra-thin (1px), low-opacity white border (20% opacity) is applied to the top and left edges of surfaces to simulate a "light catch" or "rim light."
4.  **Floating Elements:** Only primary action buttons or high-priority modals receive a shadow—a very soft, diffused azure tint (`hex: #0055FF` at 10% alpha) to suggest they are hovering above the atmosphere.

## Shapes

The shape language is **Rounded**, striking a balance between approachable and professional. 

Standard components (Cards, Inputs) use a `0.5rem` (8px) radius. Larger layout containers or "Hero" sections may scale up to `1.5rem` (24px) to emphasize the soft, fluid nature of the design system. Interactive elements like toggle switches or tags should remain pill-shaped for high tactile affordance.

## Components

- **Buttons:** Primary buttons are solid vibrant blue with white text. Secondary buttons should be "Ghost" style with a thin border and the same backdrop blur used for cards.
- **Inputs:** Fields are semi-transparent with a 1px border that darkens on focus. Use a subtle inner-glow instead of a heavy drop shadow for the focus state.
- **Cards:** These are the primary vessel for content. They must use the `surface_glass` token and backdrop blur. No heavy shadows; use a 1px neutral-light border for definition.
- **Chips/Tags:** Monospaced labels inside pill-shaped containers. Use a very light blue tint (#E0EFFF) for the background to distinguish them from the primary surface.
- **Lists:** Items should be separated by generous whitespace rather than divider lines. If dividers are necessary, they should be 1px thick and use the same azure-tinted neutral color at 10% opacity.