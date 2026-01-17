# 🌊 Arschwasser Full-Stack

![Build Status](https://img.shields.io/github/actions/workflow/status/sevstadelmann/arschwasser/main.yml?branch=master&style=flat-square)
![License](https://img.shields.io/github/license/sevstadelmann/arschwasser?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)

This is the main orchestrator repository for the **Arschwasser** project. It integrates the frontend and backend services into a unified development and deployment workflow using Docker.

---

## 🏗️ Architecture

This project is structured as a monorepo using Git Submodules:

* **`/frontend`**: The user interface (React/Next.js).
* **`/server`**: The backend API service (Node.js/Express).
* **`.github/workflows`**: Automated CI/CD pipelines.

---

## 🛠️ Tech Stack

- **Frontend:** [Link to Frontend](https://github.com/sevstadelmann/frontend)
- **Backend:** Node.js, Express
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

---

## 🚀 Getting Started

### 1. Clone the Repository
Since this project uses submodules, you must clone it recursively:

```bash
git clone --recursive [https://github.com/sevstadelmann/arschwasser.git](https://github.com/sevstadelmann/arschwasser.git)
cd arschwasser
