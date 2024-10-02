# StreetSense
This is our StartupProgramming project StreetSense for Fall 2024.

StreetSense is a software application that integrates with Google Maps. Users can report crimes or incidents they witness at specific locations. Other users can then view this information to check if there have been any recently reported crimes, allowing them to plan a different route or exercise caution in certain areas. 

## Installing Dependencies
This application assumes you have the following installed:
- docker desktop
- node.js
- npm
- git

# Start App (from within the streetsense direcctory)

    docker-compose up -d --build

    frontend will be available at: 

        http://localhost:5173 (Vite/Vue3 default)

# Shut Down App

    docker-compose down -v