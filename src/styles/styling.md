1. Variables are the source of truth.

The highest priority is moving visual decisions onto the variable system.

Whenever a component contains a hardcoded visual value, ask: Would this reasonably change between client projects?

If yes, use an existing variable. If no suitable variable exists, only then suggest adding one. Never invent variables for individual components.

2. Variables describe visual language, never components.

Variables represent reusable design decisions.

Good
--radius-md
--space-lg
--shadow-2
--text-lg
--transition-normal

Bad
--button-padding
--card-radius
--hero-title-size

Components consume variables. Variables never belong to components.

3. Prefer existing variables before creating new ones.

Always exhaust the existing token system first. Only introduce a new variable if it represents a genuinely reusable visual decision that could reasonably affect multiple component types. Never create variables simply because a component uses a value.

4. Utilities bridge variables into components.

Utility classes exist to compose variables into reusable implementation patterns.

A class should either represent a reusable design primitive or provide the cleanest bridge from variables into the component.

5. Reuse classes whenever they already express the pattern.

Before creating a new class ask: Does an existing primitive already describe this?

If yes, reuse it. If no, only create a new class if it represents a meaningful primitive rather than a one-off component detail.

6. Components own layout and behaviour.

Components should own things like:
display
grid
flex
position
overflow
ordering
slot composition
responsive layout
logic
variants

These are structural decisions. They should usually stay inside the component.

7. Components should own as little appearance as possible.

Appearance includes:
colour
spacing
typography
radius
borders
elevation
transitions
icon sizing

These should come from variables via classes wherever practical.

8. Do not over-extract.

Not every repeated snippet deserves a class. A new class should represent something that belongs in the framework's design language.

Good
.link
.icon
.btn
.card

Bad
.learn-more-link
.footer-arrow
.hero-button-text

These belong inside components.