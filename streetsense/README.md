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

    docker-compose exec backend python manage.py migrate

    frontend will be available at: 

        http://localhost:5173 (Vite/Vue3 default)

# Shut Down App

    docker-compose down -v



# Database command

    docker exec -it postgres_ss psql -U postgres -d streetsense
    ^ within project dir, to connect to database


# Attribution
    <a href="https://www.flaticon.com/free-icons/fight" title="fight icons">Fight icons created by Leremy - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/you-are-here" title="you are here icons">You are here icons created by srip - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/thief" title="thief icons">Thief icons created by Freepik - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/accident" title="accident icons">Accident icons created by Freepik - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/megaphone" title="megaphone icons">Megaphone icons created by Freepik - Flaticon</a>