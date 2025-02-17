import http from "http";
import fs, { readFileSync } from "fs";

const server = http.createServer((req, res) => {
  if (req.method == "GET") {
    if (req.url == "/") {
      const data = readFileSync("PAGES/Todolist.html");
      res.write(data);
      res.end();
    } else if (req.url == "/styles") {
      const data = readFileSync("CSS/Style.css");
      res.write(data);
      res.end();
    } else if (req.url == "/gettodo") {
      const Storedata = readFileSync("Todolist.json");
      res.write(Storedata);
      res.end();
    }
  } else if (req.method == "POST") {
    if (req.url == "/AddTodo") {
      req.on("data", (data) => {
        const Storedata = JSON.parse(readFileSync("Todolist.json"));
        Storedata.push(JSON.parse(data));
        // console.log(Storedata);
        fs.writeFileSync("Todolist.json", JSON.stringify(Storedata)); //write in file.(store tha data from storedata variable to the file)

        // console.log(JSON.parse(data));
      });
      res.end("ok");
    }
  } else if (req.method == "DELETE") {
    if (req.url == "/dltsetData") {
      req.on("data", (data) => {
        let Storedata = JSON.parse(readFileSync("Todolist.json"));
        let temparr = Storedata.filter((value) => {
          return value.id != JSON.parse(data).id;
        });
        // console.log(temparr);
        fs.writeFileSync("Todolist.json", JSON.stringify(temparr));
        res.end(JSON.stringify(temparr));
      });
    }
  } else if (req.method == "PATCH") {
    if (req.url == "/editsetData") {
      req.on("data", (data) => {
        let Storedata = JSON.parse(readFileSync("Todolist.json"));
        let temparr = Storedata.map((value) => {
          if (value.id == JSON.parse(data).id) {
            // return {...value,isEdit:true}
            value.isEdit = true;
            return value;
          } else {
            // return {...value,isEdit:false}
            value.isEdit = false;
            return value;
          }
        });
        fs.writeFileSync("Todolist.json", JSON.stringify(temparr));
        res.end(JSON.stringify(temparr));
      });
    } else if (req.url == "/savesetData") {
      req.on("data", (data) => {
        let Storedata = JSON.parse(readFileSync("Todolist.json"));
        let temparr = Storedata.map((value) => {
          if (value.isEdit == true) {
            value.input = JSON.parse(data).UpdatedInputValue;
            console.log(value.input);
            value.isEdit = false;
            return value;
          } else {
            return value;
          }
        });
        fs.writeFileSync("Todolist.json", JSON.stringify(temparr));
        res.end(JSON.stringify(temparr));
      });
    }
  }
});
server.listen(5000,() => {
  console.log("http://localhost:5000");
});
