# StreetSense
This is our StartupProgramming project StreetSense for Fall 2024.

# Description
StreetSense is a software application that integrates with Google Maps. Users can report crimes or incidents they witness at specific locations. Other users can then view this information to check if there have been any recently reported crimes, allowing them to plan a different route or exercise caution in certain areas. 

# Credits
This project is a collborative task between Nikolas Johnson (CSC), Callum Rush (BCOM), Emila Suska (SENG), Jack Zedler (BCOM), William Warrellow (BCOM), and Rena Kollmann-Suhr (SENG). If you have any questions regarding the GitHub repository, please forward them to the repository owner: Rena Kollmann-Suhr.

# Live Project Link

# Milestone Slide Decks

# Wiki Page

# GitHub Project Link

# Running the app locally
### Local Dependencies
This application assumes you have the following installed:
- docker desktop
- node.js
- npm

### Start App (from within the streetsense direcctory)

- set DEBUG=True in settings.py

    `docker-compose up -d --build`

    `docker-compose exec backend python manage.py migrate`

    frontend will be available at: 

        http://localhost:5173 

### Shut Down App

    docker-compose down -v

### Access Postgres Container

    docker exec -it postgres_ss psql -U postgres -d streetsense

# License Information
