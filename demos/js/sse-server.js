// const express = require("express");

// const app = express();

// app.get("/", (req, res) => {
//   // res.sendFile(__dirname + "/sse-client.html");
//   res.send(`
//     <html>
//       <head>
//         <title>SSE Server</title>
//       </head>
//       <body>
//         <h1>SSE Server</h1>
//         <script>
//           const eventSource = new EventSource("/sse");
//           eventSource.onmessage = (event) => {
//             console.log(event.data);
//           };
//         </script>
//       </body>
//     </html>
//   `);
// });

// app.get("/sse", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.write("data: Hello\n\n");
// });

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const app = express();
const PORT = 3001;

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  let count = 0;
  const intervalId = setInterval(() => {
    if (count >= 10) {
      clearInterval(intervalId);
      res.end();
      return;
    }
    const _data = {
      message: `Message part ${count} from server to client using SSE`,
      count,
    };
    // 在服务器向客户端发送数据时，特别是在使用 HTTP 响应或 WebSocket 等协议时，\n\n（两个换行符）通常用于表示消息的结束。这种用法在某些协议和数据格式中是标准做法，尤其是在使用事件流（Event Stream）格式时。
    // 在事件流格式中，数据是以一系列事件的形式发送的，每个事件由一行或多行 data: 消息组成，后面跟着一个空行（即两个连续的换行符 \n\n）。这个空行用于分隔不同的事件，告诉接收端当前事件的数据已经结束，可以开始处理下一个事件。
    res.write(`data: ${JSON.stringify(_data)}\n\n`);
    // res.write(`data: Message part ${count}\n\n`);
    // 在 SSE 的上下文中，必须使用 res.write() 来逐步发送数据，而不能使用 res.send()。
    // 这是因为 res.send() 会立即结束响应，而 SSE 需要持续发送数据并保持连接打开。
    // res.send(JSON.stringify(data));

    count++;
  }, 1000); // 每500毫秒发送一条消息

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/sse-client.html");
  // res.send(`
  //   <html>
  //     <head>
  //       <title>SSE Server</title>
  //     </head>
  //     <body>
  //       <h1>SSE Server</h1>
  //       <script>
  //         const eventSource = new EventSource("/sse");
  //         eventSource.onmessage = (event) => {
  //           console.log(event.data);
  //         };
  //       </script>
  //     </body>
  //   </html>
  // `);
});

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write("data: Hello\n\n");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//==============================================================================

// 使用http创建server
const http = require("http");

http
  .createServer((req, res) => {
    if (req.url === "/events") {
      // 设置 SSE 响应头
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*", // 允许跨域
      });

      // 定时向客户端发送消息
      const intervalId = setInterval(() => {
        const message = `data: ${new Date().toISOString()}\n\n`; // 格式: data: <数据内容>\n\n
        res.write(message); // 发送数据到客户端
      }, 2000);

      // 在客户端断开连接时清除定时器
      req.on("close", () => {
        clearInterval(intervalId);
        res.end();
      });
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  })
  .listen(5000, () => {
    console.log("SSE server running at http://localhost:5000/events");
  });
