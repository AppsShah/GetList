const app=require("./src/routes/routes")
const PORT=3000;
app.listen(PORT,()=>{
    console.log("Server Running !",PORT)
})
