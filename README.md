# CropNexus - Smart Irrigation System

A precision agriculture solution featuring real-time monitoring, automated scheduling, and AI-driven irrigation management.

## Project Overview

CropNexus helps farmers optimize water usage and improve crop health through:

- Real-time sensor monitoring (soil moisture, temperature, humidity)
- Weather forecast integration for smarter decision-making
- Automated and manual irrigation control
- Zone-based farm management
- Alert system for critical conditions

## System Architecture

### Hardware Components
- **ESP8266 Microcontrollers** with sensors (DHT11, soil moisture)
- **Control Relays** for irrigation valve/pump operation
- **MQTT Protocol** for bidirectional communication

### Backend (Spring Boot)
- **Data Ingestion**: MQTT client for sensor data collection
- **RESTful APIs**: Comprehensive endpoints for all system features
- **PostgreSQL Database**: Stores farm configuration and sensor data
- **Email Notifications**: Configurable alerts for critical events

### Frontend (React)
- **Dashboard**: Real-time monitoring with weather integration
- **Farm Management**: Configure farms, zones, and devices
- **Scheduling**: Create and manage irrigation schedules
- **Alerts Console**: Monitor system notifications
- **Mobile-Responsive Design**: Control from any device

## Technology Stack

### Hardware
- ESP8266 NodeMCU
- DHT11 Temperature/Humidity Sensors
- Soil Moisture Sensors
- Relay Modules

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Integration MQTT
- PostgreSQL
- Lombok
- Spring Mail

### Frontend
- React
- Material-UI
- Chart.js
- Axios
- React Router

### Communication
- MQTT (Mosquitto broker)
- REST APIs

## Getting Started

### Prerequisites
- Java 17+
- Node.js & npm
- PostgreSQL
- Mosquitto MQTT Broker

### Backend Setup
1. Clone the repository
2. Configure database and MQTT settings in `application.properties`
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

### Hardware Setup
1. Flash the ESP8266 with the provided Arduino code
2. Connect sensors according to the pin configuration
3. Configure WiFi and MQTT broker settings in the code
4. Deploy to the field and verify MQTT communication

## API Documentation
API documentation available at: `http://localhost:8090/api/swagger-ui.html`

## Database Schema
Core entities:
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
