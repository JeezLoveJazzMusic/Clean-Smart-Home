# DDT Smart Home Control
A Smart Home web app that uses HomeIO to simulate a smart home and interactable through your browser.
# Features
- AI reccomendations on improving Energy usage
- Can create multiple accounts to simulate different users
- Has permission hierarchy to control home access
- Displays live data from HomeIO
- Able to directly control components in HomeIO
- May add additional rooms and devices after creating a home
### ![image](https://github.com/user-attachments/assets/6b63edd3-aeeb-472e-a684-4a9c0c735330)

# How to initiate the servers and run the application
## Client-side initialisation
- navigate to client-side directory via: cd client-side
- run {npm install} & {npm install react-web-share --legacy-peer-deps} in the terminal
- run {npm run dev}
After initialising the client-side server, it will be hosted on port:5173 on localhost. Proceed to localhost:5173 to view the webpage

## Server-side initialisation
- navigate to server-side directory via: cd server-side
- run {npm install} 
- run {node ./server.js}
After initialising the server-side server, it will be hosted on port:8080 on localhost

## Smart Recommendation System (Machine Learning) initialisation
- navigate to root directory
- Install the following libraries in the terminal followed by "pip install"
    1. Sci-kit learn
    2. Flask
    3. Pandas
    4. Joblib   
- After installing the above, run {python app.py}

## Initialisation of HomeIO (Demo software)
- install homeIO application at https://realgames.co/home-io/ (it runs on localhost:9797 by default)
- homeIO only provides 4 types of devices to be controlled by http requests which   are listed as below:
    1. Light
    2. Alarm
    3. Heater
    4. Garage door

### Additional Notes:
- For our implementation, a heater in homeIO is represented as an air conditioner unit in our web app as it wouldnt make sense to have a heater in Malaysia.
- Do note that only our demo account (email: www@gmail.com, password:Qwertyuiop1@) works in terms of homeIO connectivity
- Devices in homeIO that you wish to connect needs to be configured to "blue" mode to be able to receive http requests

## Device connecivity in homeIO
 When adding a device to connect to homeIO, the process is as follows:
1. Navigate to the room as represented in homeIO (do add the room with the exact     room name as in homeIO if not exist)
2. Click on add device in the selected room
3. Enter device details as follows:
        - **Device Name:** Any of your choice
        - **Device Type:** Enter according to the list mentioned above
        - **Device Number:** Enter according to device details shown in homeIO (if applicable)
 4. HomeIO connectivity is completed!
   