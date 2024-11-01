# StreetSense
This is our StartupProgramming project StreetSense for Fall 2024.

# Description
StreetSense is a software application that integrates with Google Maps. Users can report crimes or incidents they witness at specific locations. Other users can then view this information to check if there have been any recently reported crimes, allowing them to plan a different route or exercise caution in certain areas. 

# Credits
This project is a collborative task between Nikolas Johnson (CSC), Callum Rush (BCOM), Emila Suska (SENG), Jack Zedler (BCOM), William Warrellow (BCOM), and Rena Kollmann-Suhr (SENG). If you have any questions regarding the GitHub repository, please forward them to the repository owner: Rena Kollmann-Suhr.

# Live Project Link
[www.streetsense.live](https://www.streetsense.live)

** please ensure to enable location tracking on your device and your browser

# Milestone Slide Decks
[Canva presentation slides link](https://www.canva.com/design/DAGVAQP41qc/utRE8anDTQa0y_yQQfE_Sg/edit?utm_content=DAGVAQP41qc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

# Shared Documentation Google Drive
Please view the following Google Drive folder to find:
- Value Proposition documents
- Personas documentation;
- Technical details and documentation 
- Team contributions 
- Customers interview scripts
- Meeting Minutes
- Course Milestone Specification and Feedback Documents
- Business Model Canvas

Documents are organized by assignment/milestone deliverable.

[Google Drive link](https://drive.google.com/drive/folders/1W2iV3MWGx_8mnkRk0J0EOlWDbFJizGsx?usp=sharing_)

# GitHub Project
Please see the following link to view project task tacking (Backlog View) and project road map (Roadmap View).

[GitHub Project Link](https://github.com/users/renakollmannsuhr/projects/1/views/1)

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

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/
    
Please see [License Text document](LICENSE) for more details
