# spinal-core-hub

## Default binary

The default binary architecture is for a unix 64b.
if you want to use another architecture (32b) the binaries are in the `bin` folder.

## Usage

```sh
~/*project_dir*/nerve-center $ node spinalhub.js // or ./spinalhub.js

// or with pm2
~/*project_dir*/nerve-center $ pm2 start launch.config.js
```

### Configuration

Set the Environnement variable to `SPINALHUB_PORT` or use the default config :

```json
  process.env.SPINALHUB_PORT = 7777;
  process.env.SPINALHUB_IP = "127.0.0.1";
```

It's also posible to configure the organ with a .env file with the following env name :

```
SPINALHUB_PORT
SPINAL_PASSWORD
SPINAL_PASSWORD_ROOT
SPINAL_PASSWORD_USER
SPINAL_GARBAGE_COLLECTOR_SCHEDULE
SPINAL_DUMP_SCHEDULE
```

The default current version is `spinalhub_freemium_3.2.0_x86_64b`.

## Spinalhub binary usage

```sh
Usage: './spinalhub' [options]
SpinalHub, the local IoT nerve center
  -v or --verbose: will give more information
  -b or --base-dir arg: base directory of files to be served (/ in http requests) (default='html')
  --db-file arg: file name of the database (default='memory/dump.db')
  --db-dir arg: name of the database file directory (for bulk data) (default='memory/data.db')
  -d or --cronstring-dump arg: cron string to make dump (default='0 5 * * * *')
  -g or --cronstring-gc arg: cron string to do a garbage collector (default='0 5 * * * *')
  -p or --port arg: http port for public pages (default='8888')
  -q or --soda-port arg: port for binary public communication (default='8889')
  --timeout-chan: timeout in s to respawn push channels (if no websocket)
  -x or --adminpass arg: password for admin user with write/read permissions (default='JHGgcz45JKilmzknzelf65ddDadggftIO98P')
  -w or --superpass arg: password for user with write/read permissions (default='4YCSeYUzsDG8XSrjqXgkDPrdmJ3fQqHs')
  -r or --pass arg: password for user with read permissions (default='LQv2nm9G2rqMerk23Tav2ufeuRM2K5RG')
  -m or --modify-passwords: modify the passwords
Unlike normal cron string the 1st number is for the seconds
<seconds> <minutes> <hours> <days of month> <months> <days of week> <years>
 default is every hours at minute 5
```
