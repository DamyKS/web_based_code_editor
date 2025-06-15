# 💻 Web-Based Code Editor

A versatile online code editor built to provide a secure and interactive environment for experimenting with multiple programming languages (Python, JavaScript, Ruby) alongside real-time HTML and CSS preview.

## ✨ Features

* **Multi-Language Support:** Write and execute code in Python, JavaScript, and Ruby.
* **Real-time HTML & CSS Preview:** Instantly see the visual output of your web code directly in the browser.
* **Secure Code Execution:** User-submitted dynamic code runs in isolated Docker containers, ensuring security and stability.
* **Syntax Highlighting & Autocompletion:** Powered by Monaco Editor (the core of VS Code) for a rich editing experience.
* **Theme Switching:** Toggle between dark (`vs-dark`) and light themes.
* **Clearable Output Console:** Manage your execution results easily.
* **Responsive Design:** Usable across various devices (desktop, tablet, mobile).

## 🚀 Technology Stack

This project leverages a robust modern web stack:

* **Frontend:**
  * **ReactJS:** For building a dynamic and responsive user interface.
  * **@monaco-editor/react:** Integrates the powerful Monaco Editor for code editing.
  * **Axios:** For making HTTP requests to the backend API.
* **Backend:**
  * **Django REST Framework:** Provides the API endpoint for code execution requests.
  * **Celery:** An asynchronous task queue for handling code execution requests efficiently, preventing blocking of the main Django application.
  * **Docker:** Used for creating isolated, secure environments for code execution.
* **Code Execution Environment:**
  * **Python, Node.js, Ruby Interpreters:** Native interpreters run inside dedicated Docker containers.

## ⚙️ How It Works

### HTML & CSS Preview (Client-Side)

For HTML and CSS, the preview is **instant and entirely handled by your web browser**. As you type, the React frontend continuously combines these two code snippets into a complete, valid HTML document string. This combined output is then loaded into an `<iframe>` element on the page. The `<iframe>` acts as a sandboxed mini-browser, displaying your web design in real-time without sending any data to the server, providing immediate visual feedback.

### Dynamic Code Execution (Server-Side with Docker Sandboxing)

When you run Python, JavaScript, or Ruby code, a secure server-side process takes over:

1. Your code is sent from the React frontend to the **Django REST Framework** backend.
2. The Django backend dispatches this code execution task to a **Celery worker**. Celery handles these tasks asynchronously, ensuring that complex or time-consuming code executions don't slow down the main web application.
3. Each Celery worker leverages **Docker** to create a secure, isolated sandbox. For each supported language, a **lightweight Docker image is pre-built from a dedicated Dockerfile.**
4. For every code execution request, a **new, ephemeral Docker container** is spun up from this image. This container contains only the necessary language interpreter (e.g., Python, Node.js, Ruby) and a temporary file with your code.
5. Your code is executed **inside this isolated container** by its native interpreter.
6. All output (stdout and stderr) is captured.
7. Once the execution is complete, the results are sent back to the frontend, and the Docker container is **immediately destroyed**. This ensures that any malicious or runaway code is strictly confined to its temporary environment and leaves no persistent threat or residue on the host system.

## 🛠️ Setup Instructions

To get this project up and running locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

* **Docker Desktop:** [Download](https://www.docker.com/products/docker-desktop/)
* **Python 3.8+:** [Download](https://www.python.org/downloads/)
* **Node.js & npm (or Yarn):** [Download](https://nodejs.org/en/download/)

---

### 1. Backend Setup (Django, Celery)

```bash
# Clone the repository (if not already cloned)
# git clone <your-repo-url>
# cd <your-project-directory>

cd backend_project_name  # Replace with your actual backend directory name

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

---

### 2. Docker Images for Code Execution

Build Docker images for each language interpreter:

```bash
cd path/to/your/docker_executors  # Adjust this path

# Python
docker build -t python-executor -f python.Dockerfile .

# Node.js
docker build -t nodejs-executor -f nodejs.Dockerfile .

# Ruby
docker build -t ruby-executor -f ruby.Dockerfile .

# Verify images
docker images
```

---

### 3. Celery Worker Setup

In a new terminal:

```bash
cd backend_project_name  # Replace with your actual backend directory name

# Activate environment
.\venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # macOS/Linux

# Start worker
celery -A your_app_name worker -l info --pool=solo
```

---

### 4. Frontend Setup (React)

In a new terminal:

```bash
cd frontend_project_name  # Replace with your actual frontend directory name

# Install dependencies
npm install  # or yarn install

# Start server
npm start  # or yarn start
```

## 🚀 Usage

1. Go to `http://localhost:3000/`.
2. Use HTML & CSS editors for real-time preview.
3. Choose Python, JavaScript, or Ruby in the code editor.
4. Click “Run” to execute.
5. View output or errors in the output panel.
6. Toggle light/dark theme as preferred.

## 🤝 Contributing

Contributions are welcome! Please fork the repo and open a pull request with your improvements.

## 📄 License

This project is open-source under the [MIT License](LICENSE.md).
