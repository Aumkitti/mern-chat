const express = require("express")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const mongoos = require("mongoose")
const cookieParser = require("cookie-parser")
const User = require("./models/User")
const Message = require("./models/Massage")
const ws = require("ws")
const fs = require("fs")
const { log } = require("console")



//server middleware
const app = express();
//const CLIENT_URL = process.env.CLIENT_URL


app.use(cors({credentials: true, origin:"http://localhost:5173"}));
app.use(express.json());
app.use(cookieParser());
//set static(public) folder
app.use("/uploads", express.static(__dirname + "/uploads"))
dotenv.config(); //เชื่อมต่อกับ env เพื่อเรียกใช้
const MONGODB_URI = process.env.MONGODB_URI; //เรียกใช้ URI
mongoos.connect(MONGODB_URI);

app.get("/", (req, res) => {
    res.send("<h1>This is a RESTful API for mern chat</h1>")
})

//Register
const salt = bcrypt.genSaltSync(10);
app.post("/register",async (req, res) =>{
    const {username, password} = req.body; //สลายโคลงสร้าง
    try {
        const userDoc = await User.create({ //hach เป็น one way endcription (สร้าง Usermodels และดึงมาใช้)
            username,
            password: bcrypt.hashSync(password, salt) // salt อักษรที่ถูกสุ่มขึ้นมาเพื่อเพิ่มความยากของ pass
        })
        res.json(userDoc); 
    } catch (error) {
        if(error) throw error;
        res.statusCode(500).json("error");
    }
})

//login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
  
    if (userDoc) {
      const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
  
      if (isMatchedPassword) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) {
            console.error(err);
            res.status(500).json("internal server error");
          } else {
            res.cookie("token", token).json({
              id: userDoc._id,
              username,
            });
          }
        });
      } else {
        res.status(400).json("wrong credentials");
      }
    } else {
      res.status(404).json("user not found");
    }
  });
  

//logout
app.post("/logout", (req,res)=>{
    res.cookie("token", "").json("ok")
})

//Profile
app.get("/profile" , (req,res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token,secret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json("no token")
    }
})





//Runserver on
const PORT = process.env.PORT;
const server = app.listen(PORT, ()=>{
    console.log("Server is running on http://localhost:" + PORT);
});


//Web Socket Server
const wss = new ws.WebSocketServer({server});

wss.on('connection',(connection, req) => {
    //แจ้ง user ว่า online อยู่
    const notifyAboutOnlinePeople = () => {
        [...wss.clients] . forEach(client =>{
            client.send(
                JSON.stringify({
                online: [...wss.clients].map((c) => ({
                    userId:c.userId, 
                    username:c.username}))
            }))
        })//สลายโคลงสร้าง แล้วจับมาใส่ Array //unicast ส่งทีละคน multicast ส่งหลายคนมากกว่า 1 boardcast ทุกคนในระบบ
    }
    connection.isAlive = true;

    connection.timer = setInterval(()=>{
        connection.ping();
        connection.deadTimer = setTimeout(()=>{
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
            console.log('dead');
        }, 1000)
    }, 5000)
    connection.on('pong' , ()=>{
        clearTimeout(connection.deadTimer);
    })

    //read username and id from cookie for this connection
    const cookies = req.headers.cookie;
    if(cookies){
        //ตัด ที่ ; และค้นหาว่ามีชื่อว่า token= ไหม
        const tokenCookieString = cookies.split(';').find(str=>str.startsWith("token="))
        if(tokenCookieString){
            // split คือ คนหาว่ามีเครื่องหมาย = ไหม 
            const token = tokenCookieString.split('=')[1]
            if(token){
                jwt.verify(token, secret, {}, (err, userData) => {
                    if(err) throw err
                    const {userId, username} = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }
    connection.on("message", async (message)=>{
        const messageData = JSON.parse(message.toString());
        const {recipient, sender, text, file} = messageData;
        let filename = null;
        if(file){
            const parts = file.name.split('.');
            const ext = parts[parts.length - 1];
            filename = Date.now() + "." + ext;
            //__dirname คือการบอกที่อยู่ของไฟล์ที่กำลังทำงานอยู่ขณะนั้น
            const path = __dirname + "/uploads/" + filename;// ไฟล์จะไปอยู่ที่โฟล์เดอร์อัพโหลด ที่อยู่ใน server 
            //เหตุผลที่ต้องรีเนมไฟล์ใหม่ตลอด เพราะเราไม่ต้องการให้ไฟล์ชื่อซํ้ากันและเขียนทับกัน
            const bufferData = new Buffer(file.data.split(',')[1], 'base64')
            fs.writeFile(path, bufferData, ()=>{
                console.log('file saved:  ' + path )
            })
        }
        if(recipient && (text || file)){
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename : null
            });
            [...wss.clients].filter(c=>c.userId === recipient).forEach(c=> c.send(JSON.stringify({
                test,
                file: file ? filename: null,
                sender: connection.userId,
                recipient,
                __id: messageData._id
            })))
        }
    })




    notifyAboutOnlinePeople();
})


