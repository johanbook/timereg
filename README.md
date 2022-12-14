# timereg

**timereg** is a tool for generating time reports. It assumes data on the
following format

```
## 2022-10-02
09:00-09:30 standup
09:30-10:00 development 1212
10:00-10:30 development 1212
10:30-12:00 docs 1791

## 2022-10-03
09:00-09:30 standup
09:30-10:00 bugfix 1335
10:00-10:30 bugfix 1335
10:30-11:00 development 293
```

From this a report can be generated on this form:

```sh
> timereg
TIME REPORT 2022-10-03
Task	 Hours
================
standup	0.5
bugfix	1.0
development	0.5
================
Total	2.0

```

## Installing

### Precompiled binaries

There are precompiled binaries for Linux. The latest binary can be downloaded
with e.g `curl`:

```sh
curl https://www.johanbook.com/timereg/timereg -o timereg
chmod +x timereg
mv timereg /usr/bin
```

### Compiling

You can compile the tool using the Nodejs runtime. To do so, clone the
repository

```sh
git clone https://github.com/johanbook/timereg.git
```

Install dependencies and transpile the code

```sh
npm i -D
npm run transpile
```

The application can then be run as following

```sh
node .
```

To see available CLI options, run `node ./timereg.js --help`
