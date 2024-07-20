import debug from "debug";
import http from "http";
import { PORT } from "./config";
import app from "./app";

const port = normalizePort(PORT || "9000");

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addr: any = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log(
    "App is running at http://localhost:%d in %s mode on %s",
    app.get("port"),
    app.get("env"),
    new Date().toLocaleString()
  );
  console.log("Press CTRL-C to stop");
}
