const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require('file-system');
const base64Img = require('base64-img');
const path = require('path');

let total = 0; //nbr of total avatars
let count = 0; //count for ctrl the limit
let bank = []; // avatars urls
const limit = 100; //nbr of saved avatars in the api

const rng = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const decodeBase64Image = (dataString) => {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
}


fs.readdir("./img/", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("./img/", file), err => {
        if (err) throw err;
      });
    }
  });

exports.random = (req, res, next) => {
    console.log("📋  La création d'un avatar est demandé 📜");
    
    let elements = []
    let SkinColor = rng(1,6);
    let ShouldersType = rng(1,10);
    let hairType = rng(1,10);

    const bg = "./assets/background/background_"+rng(1,10)+".png";
    elements.push(bg)

    const face = "./assets/color/color_"+SkinColor+"/face/Face_"+rng(1,10)+".png";
    elements.push(face)

    const shoulders = "./assets/shoulders/type_"+ShouldersType+"/Shoulders_"+ShouldersType+"."+rng(1,6)+".png";
    elements.push(shoulders)
    
    const mouth = "./assets/mouth/Mouth_"+rng(1,10)+".png";
    elements.push(mouth);
    
    const eyes = "./assets/eyes/Eyes_"+rng(1,10)+".png";
    elements.push(eyes);
    
    const noze = "./assets/nose/Nose_"+rng(1,10)+".png";
    elements.push(noze);
    
    const hair = "./assets/hair/type_"+hairType+"/Hair_"+hairType+"."+rng(1,6)+".png";
    elements.push(hair);

    const ears = "./assets/color/color_"+SkinColor+"/ears/ears_"+rng(1,10)+".png";
    elements.push(ears)

    //console.log(elements);

    mergeImages(elements, {
        Canvas: Canvas,
        Image: Image
    })
    .then((b64) => {
       
        let avatar = decodeBase64Image(b64);
        let folder = "/img/";
        let filename = total+"D"+Date.now()+".png";
        let filePath = folder+filename;

        fs.writeFile("."+filePath, avatar.data, (err) => {

            if(bank.length < limit){
                bank.push("http://localhost:3000"+filePath);
            }else{
                let oldFile = bank[count]
                fs.unlink("./img/"+oldFile.split('/img/')[1], () => {
                    bank[count] = "http://localhost:3000"+filePath
                    count >= limit -1 ? count = 0 : count ++ ;
                })
            }
            res.status(200).sendFile(__dirname.split("controllers")[0]+filePath)
         });

         total++
         console.log(total)  
    })
    .catch((err) => {
        res.status(500).send({
            message:
              err.message
          });
    })
}

exports.batch = (req, res, next) => {
  let nbr = req.params.nbr

  if(nbr > limit){
    res.send({message : `Max request : ${limit}`})
  }
  console.log(nbr)
  res.send(bank.splice(0, nbr))
}