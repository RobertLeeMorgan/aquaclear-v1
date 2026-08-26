# MPA Framework – Project Setup Guide

This guide covers the complete workflow for taking the framework from a fresh clone to a fully deployed production website with Decap CMS, Cloudflare Pages and Resend.

---

# 1. Create a new project

## Clone the template

```bash
git clone <template-repository> client-project
cd client-project
```

## Initialise a new Git repository

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

Create a new GitHub repository.

Add the remote.

```bash
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

---

# 2. Rename the project

Update:

```
package.json
```

* name
* description
* repository (optional)

Run

```bash
npm install
```

---

# 3. Configure the site

Open

```
config/site.ts
```

Update:

* Company name
* Domain
* Contact email
* Phone number
* Social links
* Business address
* Opening hours
* LocalBusiness information

---

# 4. Plan the sitemap

Open

```
config/pages.ts
```

Decide:

* Static pages
* Collections
* Archive pages
* Content index pages
* Schemas
* Layouts
* Initial sections

Typical structure:

```
Home
About
Services
Projects
News
Case Studies
FAQ
Contact
```

---

# 5. Configure navigation

Open

```
config/navigation.ts
```

Build the primary navigation.

Typical example

```
Home
About
Services
Insights
Contact
```

Services generally uses

```
children: "collection"
```

Insights generally groups multiple collections.

---

# 6. Generate the project

Run

```bash
npm run generate
```

This will generate

* Content collections
* Astro routes
* Layout imports
* Schemas
* Decap configuration
* Generated TypeScript types
* Placeholder content
* Placeholder pages

Resolve any TypeScript errors before continuing.

---

# 7. Review generated content

Review

```
src/content
```

Remove any pages that are unnecessary.

Rename example files if required.

Update collection slugs if necessary.

---

# 8. Add client content

Replace placeholder content with real content.

Replace

* SEO
* Images
* Rich text
* Cards
* Buttons
* FAQs
* Services
* Articles

Images should be placed under

```
src/assets/images/
```

Recommended structure

```
hero/
cards/
sections/
gallery/
team/
logos/
```

---

# 9. Create additional components

If the generated sections are insufficient

Create:

```
components/cards
components/sections
components/actions
```

Reuse existing components whenever possible.

Only create bespoke components when genuinely required.

---

# 10. Update branding

Modify

```
src/styles
```

Update

* Colours
* Fonts
* Radius
* Shadows
* Animations
* Spacing

Replace

```
public/favicon.*
```

Replace

```
src/assets/logo.*
```

Replace placeholder imagery.

---

# 11. Test locally

Run

```bash
npm run dev
```

Verify

* Navigation
* Mobile layout
* Images
* Forms
* CMS preview
* SEO
* Schema
* Lighthouse
* Accessibility

---

# 12. Create Cloudflare Pages project

Connect the GitHub repository.

Framework preset

```
Astro
```

Build command

```bash
npm run build
```

Output directory

```
dist
```

---

# 13. Configure environment variables

Cloudflare Pages

```
RESEND_API_KEY
TURNSTILE_SECRET_KEY
PUBLIC_ENVIRONMENT
DATA_SITEKEY

GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

Development

```
.dev.vars
```

should contain equivalent local values.

---

# 14. Configure GitHub OAuth

If Decap CMS is used via GitHub OAuth

Create (or reuse) a GitHub OAuth App.

Configure

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

Add these to

* Cloudflare Pages
* Local development (.dev.vars)

Ensure callback URLs match the deployed domain.

---

# 15. Configure Decap CMS

Invite the client GitHub account to the repository.

Grant write access.

Verify

```
/admin
```

opens successfully.

Confirm authentication works.

Commit a content change through Decap.

Confirm the deployment triggers automatically.

---

# 16. Configure Resend

Create a Resend account for the client.

Add the production domain.

Verify ownership.

Generate an API key.

Update

```
RESEND_API_KEY
```

in Cloudflare.

---

# 17. Configure Cloudflare Turnstile

Create

* Site Key
* Secret Key

Update

```
DATA_SITEKEY
TURNSTILE_SECRET_KEY
```

Test form submission.

---

# 18. Configure DNS

Move domain into Cloudflare.

Add required DNS records.

For Resend

* SPF
* DKIM

For website

* Cloudflare Pages records

Verify propagation.

---

# 19. Update nameservers

At the registrar

Replace existing nameservers with Cloudflare nameservers.

Wait for propagation.

---

# 20. Production testing

Verify

* Homepage
* Internal pages
* Collections
* Archive pages
* Contact form
* CMS login
* Image optimisation
* Schema
* OpenGraph
* Sitemap
* robots.txt

---

# 21. Lighthouse

Run Lighthouse.

Target

* Performance 90+
* Accessibility 100
* Best Practices 100
* SEO 100

---

# 22. Handover

Provide the client with

* Cloudflare access
* GitHub access
* Resend access
* Domain registrar access
* CMS login instructions

Confirm content editing works.

Project complete.