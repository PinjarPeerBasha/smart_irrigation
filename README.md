# Smart Irrigation System

A comprehensive irrigation management system with a Spring Boot backend and React frontend.

## Project Overview

This smart irrigation system helps farmers manage their irrigation needs efficiently, using sensor data, weather forecasts, and AI/ML prediction models to optimize water usage and crop health.

### Features

- **Real-time monitoring** of soil moisture, temperature, humidity, and rainfall
- **Automated irrigation scheduling** based on sensor data and AI/ML recommendations
- **Manual control** over irrigation devices
- **Alert system** for critical conditions (low moisture, device failures, etc.)
- **Historical data visualization** through charts and graphs
- **Farm and zone management** for organizing irrigation systems

## System Architecture

### Backend (Spring Boot)

- **Data Processing**: Ingests sensor data via MQTT or REST API
- **Data Storage**: Stores real-time and historical data in PostgreSQL
- **Prediction Engine**: Uses ML models for irrigation scheduling recommendations
- **Alert System**: Sends notifications via email/SMS/WhatsApp for critical events

### Frontend (React)

- **Dashboard**: Displays real-time farm conditions with charts and graphs
- **Farm/Zone Management**: UI for managing farms, zones, and devices
- **Schedule Management**: View and manage irrigation schedules
- **Alert Console**: Monitor and respond to system alerts

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Integration MQTT
- PostgreSQL
- Lombok
- Swagger/OpenAPI

### Frontend
- React 18
- Material-UI
- Chart.js
- Axios
- React Router

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js and npm
- PostgreSQL
- MQTT Broker (e.g., Mosquitto)

### Backend Setup

1. Clone the repository
2. Configure PostgreSQL details in `application.properties`
3. Run the Spring Boot application:
   ```
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```

## API Documentation

The API documentation is available via Swagger UI at: `http://localhost:8080/api/swagger-ui.html`

## Database Schema

The application uses the following main entities:
- Farm
- Zone
- IrrigationDevice
- SensorData
- IrrigationSchedule
- Alert

## License

[MIT License](LICENSE)

## Contact

For inquiries or support, please contact [your-email@example.com](mailto:your-email@example.com) 