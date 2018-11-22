
## Start kafka
Should be installed Docker.

Install node modules:

- ```yarn```

Create config file:
- ```mv src/config/example.development.js src/config/development.js```

Start kafka docker
- ```yarn kafka:start```

- ```yarn kafka:stop```

Start server
- ```yarn start```

Start generate events from events.csv
- ```yarn sendEvents```
