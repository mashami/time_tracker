const { createServer } = require("http")
const { Server } = require("socket.io")

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", async (socket) => {
  console.log(socket.id)
})

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log(`Server is listening to the port ${process.env.SOCKET_PORT}`)
})
