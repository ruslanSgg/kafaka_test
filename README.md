
## Start kafka

Set variable
- ```export DOCKER_KAFKA_HOST=$(ipconfig getifaddr en0)```

Start a cluster:

- ```docker-compose up -d ```

Add more brokers:

- ```docker-compose scale kafka=3```

Destroy a cluster:

- ```docker-compose stop```

Install node modules:

- ```npm i```

Start server:

- ```node server.js```

Open in browser:

- ```http:/localhost:5001```

Send message from data.txt:

- ```node produce.js top1 data.txt```
