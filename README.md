# Welcome to StreetSense!
This is a project for the StartupProgramming (SENG480A) course at the University of Victoria for the Fall 2024 semester.

# Description
StreetSense is a software application that integrates with Google Maps. Users can report crimes or incidents they witness at specific locations. Other users can then view this information to check if there have been any recently reported crimes, allowing them to plan a different route or exercise caution in certain areas. 

# Credits
This project is a collborative task between Nikolas Johnson (CSC), Emila Suska (SENG), Jack Zedler (BCOM), William Warrellow (BCOM), and Rena Kollmann-Suhr (SENG). If you have any questions regarding the GitHub repository, please forward them to the repository owner: Rena Kollmann-Suhr.

# Live Project Link
[www.streetsense.live](https://www.streetsense.live)

** Project is no longer live. **

# Product Page

Our product page is available at [Wix](https://williamdw6.wixsite.com/streetsense), and by pressing the "info" button on our app followed by the "product page" link on the subsequent modal that opens.

# Milestone 3 Slide Deck
[Canva presentation slides link](https://www.canva.com/design/DAGXtvv-OYY/TmOeM271FtU25H9288DUEw/edit?utm_content=DAGXtvv-OYY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

# Shared Documentation Google Drive
Please view the following Google Drive folder to find:
- Value Proposition documents
- Personas documentation
- User Validation Research Notes and Insights
- Technical details and documentation 
- Team contributions 
- Customers interview scripts
- Meeting Minutes
- Course Milestone Specification and Feedback Documents
- Business Model Canvas

Documents are organized by assignment/milestone deliverable.

[Google Drive link](https://drive.google.com/drive/folders/1W2iV3MWGx_8mnkRk0J0EOlWDbFJizGsx?usp=sharing_)

# GitHub Project
Please see the following link to view project task tacking (Kanban Board view) and project road map (Roadmap view).

[GitHub Project Link](https://github.com/users/renakollmannsuhr/projects/1/views/1)

# Running the app locally
### Local Dependencies
This application assumes you have the following installed:
- docker desktop
- node.js
- npm

### Start App (from within the streetsense direcctory)

set DEBUG=True in settings.py
    
    `docker-compose up -d --build`
    
    `docker-compose exec backend python manage.py migrate`
    
frontend will be available at: 
    
        http://localhost:5173 

### Shut Down App

    docker-compose down -v

# License Information

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/
    
Please see [License Text document](LICENSE) for more details

# Disclaimer for use of GenAI

This project makes use of ChatGPT for app feature ideation, code, persona creations, marketing advice, and branding.

# Icon Image Credits
<a href="https://www.flaticon.com/free-icons/swearing" title="swearing icons">Swearing icons created by Kajo - Flaticon</a>

<a href="" title="fist icons">Fist icons created by Smashicons - Flaticon</a>

<a href="" title="alert icons">Alert icons created by Freepik - Flaticon</a>

<a href="" title="padlock icons">Padlock icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/uber" title="uber icons">Uber icons created by Freepik - Flaticon</a>
