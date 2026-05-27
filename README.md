# CloudOps Platform 🚀

A full-stack cloud-native DevOps platform built using React, Node.js, PostgreSQL, Docker, Kubernetes, and GitHub Actions CI/CD.

---

# Features

- JWT Authentication
- Task CRUD Management
- Modern SaaS Dashboard
- Dark/Light Mode
- Dockerized Full Stack App
- Kubernetes Deployments
- CI/CD with GitHub Actions
- Docker Hub Integration
- Kubernetes Scaling
- Secrets & ConfigMaps
- Health Checks & Resource Limits

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## DevOps
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub
- Kubernetes
- Minikube

---

# Project Architecture

Frontend → Backend API → PostgreSQL

Containerized using Docker and deployed on Kubernetes.

---

# Setup Instructions

## Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
```

## Start Docker Containers

```bash
docker compose up --build
```

## Run Kubernetes

```bash
kubectl apply -f k8s/
```

---

# CI/CD Pipeline

GitHub Actions automatically:
- installs dependencies
- builds frontend
- builds Docker containers

---

# Kubernetes Features

- Deployments
- Services
- Ingress
- Scaling
- Secrets
- ConfigMaps
- Health Checks

---

# Author

Anmol Patel