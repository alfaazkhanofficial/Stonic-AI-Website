# Technical Architecture

Use a modern component-based web stack selected during implementation.

## Frontend
Presentation, animation, navigation, responsive layout and content rendering.

## Server/API
Required for admin authentication, protected content/media operations and any server-side action requiring secrets.

## Admin/CMS
Use the simplest secure real system that meets actual requirements. Never build fake CMS controls.

## Media
Optimize images/video, use modern formats where appropriate, responsive sizes and lazy loading.

## Environments
Separate development, preview/staging and production configurations.

Suggested structure:
website/
  app-or-src/
  components/
  sections/
  pages/
  public/
  assets/
  styles/
  content/
  admin/
  server-or-api/
  tests/
