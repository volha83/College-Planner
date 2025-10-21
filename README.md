# Final Project for React course with Code the Dream

College Planner - Your Admission and College Prepare Assistance

#

A simple React (Vite) application with two pages
It helps organize college admission tasks and keep track of dorm shopping items.

#

The project is deployed using Vercel, which automatically builds and hosts the production version:
http://college-planner-psi.vercel.app

# Features

    •	Admission Tasks — manage your college list using Airtable
    •	College Shopping — track dorm essentials with LocalStorage
    •	Sorting, filtering, and search
    •	Clean component structure and reducer-based state management
    •	Built completely with React Hooks and Vite

# Installation instructions

    1.	Create a new public repo on GitHub
    2.	Clone the repo locally
    3.	Scaffold Vite using CLI:
    npm create vite@latest . -- --template react
    4. npm install
    5. Fill in your Airtable token, base ID, and table name inside .env.local
    6. Start the development server:
       npm run dev

- Open the Local link shown in the CLI http://localhost:5173/
- You should see the application running in your browser:
Here you can enter and add all the necessary information about the colleges you are interested in (page - Admission Tasks):
<img width="1044" height="842" alt="Image" src="https://github.com/user-attachments/assets/96d6a3c6-a027-4c0d-9fd5-5737809950e0" />

Next you can add items to the categories required for the dormitiry (page - College Shopping List):
<img width="1044" height="842" alt="Image" src="https://github.com/user-attachments/assets/2fb6788f-28fa-412a-84b7-03576d2030f3" />

To catch all paths that do not match any of the previous routes and if the used opens non-existent URL - the Page Not Found will appear:
<img width="1044" height="413" alt="Image" src="https://github.com/user-attachments/assets/8240bb96-bd8d-4f2f-af40-2a12d7447c86" />
