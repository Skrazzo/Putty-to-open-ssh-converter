# PuTTY to OpenSSH Converter

A web application that converts PuTTY Private Key (PPK) files to OpenSSH format (PEM) without requiring local installation of PuTTY tools.

![License](https://img.shields.io/github/license/Skrazzo/Putty-to-open-ssh-converter)

## 🚀 Why I Made This

As someone who exclusively uses OpenSSH keys, I found it annoying to install PuTTY just to convert keys when collaborating with others who use PuTTY. This web app solves that problem by:

- Providing a simple web interface for converting keys
- Handling the conversion process on the server side
- Returning both private and public keys in a zip file
- Automatically deleting all files after conversion for security

## ✨ Features

- Instant conversion from PPK to OpenSSH format
- Returns both private and public keys
- Secure by design - all files are deleted after conversion
- Responsive UI that works on desktop and mobile
- Containerized with Docker for easy deployment

## 🔧 Technology Stack

- **Backend**: Bun with Hono framework
- **Frontend**: React with TypeScript, Vite, and shadcn/ui
- **Conversion**: Uses puttygen CLI tool
- **Container**: Docker and Docker Compose
- **Web Server**: Caddy (for production)

## 🛠️ Development Setup

### Prerequisites

- Docker and Docker Compose
- Git

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Skrazzo/Putty-to-open-ssh-converter.git
   cd Putty-to-open-ssh-converter
   ```

2. Start the development environment:
   ```bash
   docker-compose -f docker-development.yml up
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

The development environment includes:
- Hot-reloading for both frontend and backend
- Volume mounting for real-time code changes
- Environment variables pre-configured for local development

## 🚀 Production Deployment

### Running in Production

1. Clone the repository:
   ```bash
   git clone https://github.com/Skrazzo/Putty-to-open-ssh-converter.git
   cd Putty-to-open-ssh-converter
   ```

2. Start the production environment:
   ```bash
   docker-compose -f docker-production.yml up -d
   ```

3. Access the application:
   - http://localhost:8000

### Configuring Subpath Deployment

To run the application on a subpath (e.g., `https://example.com/putty`), modify the `docker-production.yml` file:

```yaml
caddy:
  build:
    args:
      VITE_BACKEND_URL: http://example.com/putty/api
      VITE_BASE_URL: /putty
```

### Configuring Subdomain Deployment

To run the application on a subdomain (e.g., `https://putty.example.com`), modify the `docker-production.yml` file:

```yaml
caddy:
  build:
    args:
      VITE_BACKEND_URL: https://putty.example.com/api
      VITE_BASE_URL: /
```

## 🔒 Reverse proxy with Caddy on the Host Machine

### Example: Proxy on Subpath

Create a Caddyfile on your host:

```
example.com {
    handle_path /putty* {
        reverse_proxy localhost:8000
    }
}
```

### Example: Proxy on Subdomain

Create a Caddyfile on your host:

```
putty.example.com {
    reverse_proxy: localhost:8000
}
```

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MAX_FILE_UPLOAD_MB | Maximum upload file size in MB | 2 |
| FRONTEND_URL | URL to the frontend for CORS | http://localhost:5173 |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_BACKEND_URL | URL to the backend API | http://localhost:3000 |
| VITE_MAX_FILE_SIZE_MB | Maximum file size in MB | 2 |
| VITE_BASE_URL | Base URL for subpath hosting | / |

## 🔐 Security

- All files (both uploaded and converted) are deleted from the server immediately after conversion
- No files are stored long-term
- Conversion happens server-side using the puttygen CLI tool
- File size limits to prevent abuse

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
