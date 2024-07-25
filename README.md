# Round 2: assignment 
Repository consists of code for assignment - `Moderator Assignment` for Report Section

# Setup:

1. install the modules
```
npm i 
```
2. create .env file in root
```
NODE_ENV=development
LOG_DIRECTORY=./logs/development
PORT=5000
URI=<mongo_uri>
REDIS_HOST=redis-15475...redns.redis-cloud.com
REDIS_PORT=15475
REDIS_PASSWORD=3EbInfzFd8o4Hu3BrI3DjqkRx7C
```

# Low Level Design / Class Diagram
![cd](https://github.com/user-attachments/assets/47ba33c6-ae05-4207-96a5-2f492bada0a6)


# Job Report flow
![flow](https://github.com/user-attachments/assets/4a4c99a6-6269-4cb4-b609-468b46b77fc0)

# Steps to run unit testing
```
npm run test -> to run the test
npm run generate_test_report -> create HTML report to view in browser
npm run code_coverage -> code_coverage table is generated
```


