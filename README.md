## Welcome to the Vibeer Repository 🎵

## Vibeer
Frontend application for the musical artist hiring platform. Built with Quasar Framework (SPA, PWA & Android).

### Prerequisites 📋
To run this project, you will need:

- Node.js 18+
- npm 6+
- Quasar CLI 1.x (`npm i -g @quasar/cli`)
- [kool](https://kool.dev/) (for Docker) or run locally

> **Windows users**: kool runs Linux-based Docker containers, so it requires WSL with a Linux distribution installed, plus Docker Desktop with WSL2 backend.

### Docker Installation (kool) 🐳🔧

1. Clone the repository:
    ```bash
    git clone <repo-url> frontendMusic
    ```

2. Enter the project folder:
    ```bash
    cd frontendMusic
    ```

3. Run setup — this starts the container and exposes the app:
    ```bash
    kool run setup
    ```

    The app will be available at http://localhost:8080.

### Local Installation 💻🔧

1. Clone the repository:
    ```bash
    git clone <repo-url> frontendMusic
    ```

2. Enter the project folder:
    ```bash
    cd frontendMusic
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

    The app will open at http://localhost:8080.

    By default, development requests use the local API at http://localhost:8000.
    To use another backend, set `BACKEND_URL` when starting Quasar:

    ```powershell
    $env:BACKEND_URL="http://127.0.0.1:8000"; npm run dev
    ```

### Configuration ⚙️

- **Backend API URL**: Development defaults to `http://localhost:8000`.
- **Production API URL**: Defaults to `https://sgmback.rootheim.com`.
- Override either with the `BACKEND_URL` environment variable.

### Additional Commands

- **Build for Production**:
    ```bash
    quasar build
    ```
- **Build Android App**:
    ```bash
    quasar dev -m cordova -T android
    ```
- **Run npm inside Docker**:
    ```bash
    kool run npm install
    ```

© Vibeer
