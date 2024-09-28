Used ChatGPT o1-preview with the prompt 
    "Please create a web app for me using django as the backend, vue as the front end, postgresql as the database and the google maps api. I want to it to be a single page application which is a map that you can create pins or markers on, so users can create reports of crimes."

To install Django with REST framework: pip install django djangorestframework psycopg2-binary

Postgres database currently set up for my local machine @ http://localhost:5432 (Postgres Default)

Installed CORS with : pip install django-cors-headers

With Node.js and Npm installed, create front end using vue: 
    npm create vite@latest streetsense_frontend -- --template vue

Navigate to front end (streetsense_frontend) and : npm install

Install axios and Vue google maps : npm install axios @fawmi/vue-google-maps

Front end is running on http://localhost:5173 (Vite/Vue3 default)


To start backend server : python manage.py runserver

To start frontend server: npm run dev
