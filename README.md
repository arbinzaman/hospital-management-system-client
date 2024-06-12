# Hospital Management System

This project is a web-based hospital management system designed for PC devices. It integrates various technologies such as React for the frontend, Firebase for authentication and real-time database features, MongoDB as the NoSQL database for storing structured data, and utilizes QR code generation for efficient patient and appointment management.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Building](#building)
  - [Preview](#preview)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **React 18**: Utilizes the latest version of React for building dynamic and responsive user interfaces.
- **Vite**: A next-generation frontend tooling for fast development and optimized builds.
- **Tailwind CSS**: Provides utility-first CSS framework for rapid UI development.
- **React Router DOM**: Enables dynamic routing within the application.
- **React Icons**: Includes a comprehensive library of icons.
- **React Toastify**: For elegant and customizable toast notifications.
- **DaisyUI**: A plugin for Tailwind CSS to provide accessible components.
- **React Calendar**: An interactive calendar component for managing appointments.
- **React Quill**: A rich text editor component for detailed medical notes.
- **React QR Code**: For generating QR codes to streamline patient identification and management.
- **React to Print**: Provides functionality to print patient records and reports.
- **HTML2Canvas & HTML2PDF**: Tools for converting medical reports and documents to PDF format.
- **SweetAlert2**: For beautiful and responsive alert dialogs.
- **File Saver**: Allows saving medical documents on the client side.
- **jspdf**: A library to generate PDFs in JavaScript.
- **html-to-text**: Converts HTML medical content to plain text.

### Highlighted Features

- **QR Code Feature**: Generate and scan QR codes for quick patient identification and appointment tracking.
- **Real-time Data**: Utilizes Firebase for real-time updates and authentication.
- **MongoDB Integration**: Stores structured medical data securely using MongoDB as the backend database.

## Screenshots

Here are some screenshots of the application:

![Dashboard](https://github.com/arbinzaman/hospital-management-system-client/blob/main/src/components/Assets/dashboard.png)
*Dashboard view showcasing the overview of patient statistics and appointments.*
![QR Code Generator](https://github.com/arbinzaman/hospital-management-system-client/blob/main/src/components/Assets/qr.png)
*QR Code generation screen for creating and managing patient QR codes.*


# Environment Variables
Create a .env file in the root directory and add the necessary environment variables:

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_MONGODB_URI=your_mongodb_uri


Replace your_firebase_api_key, your_firebase_auth_domain, your_firebase_project_id, and your_mongodb_uri with your Firebase and MongoDB credentials.


## Roles Management

### Super Admin 
Email:redoxop45@gmail.com
Pass:A@@a1234

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (or yarn)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
npm install
