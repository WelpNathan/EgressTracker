INFORMATION
there's cases in the news of people being re-infected with covid but for the simplicity you can only get covid once.

SERIOUS PRODUCTION ISSUES
- /accounts/account can be called by anyone
- /accounts/get returns password hashes and salts.

HOW TO USE:
  - make an account:
    - POST /accounts/account with { username, email, password }
    - POST /accounts/login with { username, password}
      - THIS WILL RETURN A JSON WEB TOKEN. COPY THE JSON WEB TOKEN INTO BEARER SCHEME.
      - TOKEN EXPIRES IN 1 HOUR.
  - add a new case
    - POST /cases with { firstName, lastName, county }
    - POST /cases/update with { id }
      - SETS THE PERSON'S INFECTION STATUS TO FALSE.

RUNNING MONGO DB IN DOCKER
docker run -d --name mongo -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret -p 27017:27017 mongo

ALL ROUTES:
  - GET / - view app name, version and a random string of bytes
  - /accounts
    - GET / - MASSIVE SECURITY VULNERABILITY view all users
    - POST /account - create an account with username, email and password
    - DELETE /account - delete an account from username
    - POST /login - login to the system
    - GET /logout - logout the system
  - /cases
    - GET / - get all cases
    - GET /positive - get all positive cases
    - GET /negative - get all negative cases
    - POST / - add new case
    - POST /update - set case to negative

RESULTS:
  - returns Success JSON example { result: 'success', data: {}}
  - returns Rejected JSON example {result: 'db-error', data: {}}

MODELS:
  - account: login and password system
  - citizen: person who was infected with covid

ERROR CODE:
  - 400: Bad Request- syntax or arg errors
  - 401: Unauthorized- incorrect username/password or not logged in
  - 500: Server Error- db-down or other adapter issues
