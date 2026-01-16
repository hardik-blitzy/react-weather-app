# Awesome Weather Application

(Probably the best, free, and open-source weather app out there)

## A React application built with modern technologies

### Application Features

1. Track the atmospheric conditions of any country or city.
2. Automatically track the weather of any saved location.
3. Customize settings to fit your preferences.
4. Works offline.
5. Predicts the weather for any geographical area up to 5 days ahead with 3-hour intervals.
6. Free and open-source.
7. Built using modern UI technologies.
8. Cross-platform compatibility.
9. Built on PWA technology.

## Technologies Used

- **React JS** [User Interface, Application Logic]
- **Bootstrap** [User Interface]
- **jQuery AJAX** [API Requests]

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended, v20 LTS preferred)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adedoyin-emmanuel/react-weather-app.git
   cd react-weather-app
   ```

2. Install dependencies:
   ```bash
   npm i --legacy-peer-deps
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section below).

4. Start the development server:
   ```bash
   npm run start
   ```

5. Build for production:
   ```bash
   npm run build
   ```

### Environment Variables

This application requires API keys to fetch weather data. For security reasons, API keys are stored in environment variables rather than hardcoded in the source code.

#### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_OPENWEATHERMAP_API_KEY` | Your OpenWeatherMap API key for weather data | Yes |
| `REACT_APP_API_NINJAS_KEY` | Your API Ninjas key for geolocation services | Yes |

#### Setting Up Environment Variables

1. Copy the example environment file to create your local configuration:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your API keys:
   ```env
   REACT_APP_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
   REACT_APP_API_NINJAS_KEY=your_api_ninjas_key_here
   ```

3. Obtain your API keys from:
   - **OpenWeatherMap**: Sign up at [https://openweathermap.org/api](https://openweathermap.org/api) and generate a free API key
   - **API Ninjas**: Sign up at [https://api-ninjas.com/](https://api-ninjas.com/) and generate a free API key

> **Important**: Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it automatically.

## Security Configuration

This application follows security best practices to protect sensitive data and ensure secure operation.

### Environment Variable Security

API keys and sensitive configuration values are managed through environment variables:

- **No hardcoded secrets**: All API keys are loaded from environment variables at runtime
- **Environment file protection**: The `.env` file is excluded from version control via `.gitignore`
- **Template provided**: Use `.env.example` as a template for required environment variables

> **Note for Production**: While environment variables protect API keys from being committed to source control, React applications bundle these values into client-side JavaScript. For truly sensitive APIs, consider implementing a backend proxy to keep API keys server-side only.

### Content Security Policy (CSP)

The application implements Content Security Policy headers to mitigate cross-site scripting (XSS) attacks:

- CSP meta tags are configured in `public/index.html`
- Script sources are restricted to trusted origins
- Inline scripts and styles are controlled to prevent injection attacks

### Docker Security Configuration

When running the application in Docker, the following security measures are implemented:

- **Non-root user**: The container runs as a non-privileged `node` user instead of root
- **Updated base image**: Uses `node:20-alpine` for the latest security patches
- **Reproducible builds**: Uses `npm ci` instead of `npm install` for deterministic, tamper-resistant builds
- **Minimal attack surface**: Alpine-based image minimizes the number of installed packages

#### Building the Docker Image

```bash
docker build -t weather-app .
```

#### Running the Container

```bash
docker run -p 80:80 weather-app
```

### Security Scanning

Regular security scanning is recommended to identify and address vulnerabilities in dependencies.

#### Running npm Audit

Check for known vulnerabilities in dependencies:

```bash
npm audit
```

For a detailed report focusing on high and critical severity issues:

```bash
npm audit --audit-level=high
```

#### Automated Security Scanning

The CI/CD pipeline (Jenkinsfile) includes automated security scanning that runs `npm audit` during the build process to catch vulnerabilities before deployment.

### Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the maintainer directly rather than opening a public issue.

## Build Commands Reference

| Command | Description |
|---------|-------------|
| `npm i --legacy-peer-deps` | Install all dependencies |
| `npm run start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm audit` | Check for security vulnerabilities |

### Live Link

[Visit the live application](https://zedd-weather.vercel.app)

### Support

Please support by starring this project. Follow me for more cool open-source projects.

[GitHub - adedoyin-emmanuel](https://github.com/adedoyin-emmanuel/)
