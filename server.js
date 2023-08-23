// server/app.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;


// הגדרת התיקייה הציבורית לקבצי ה-HTML וה-JavaScript של הצד הלקוחי
app.use(express.static(path.join(__dirname, './publicc')));
// app.use(express.static(path.join(__dirname, './publicc'), { 'extensions': ['html', 'js'] }));




// תצורת multer עבור העלאת התמונות
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// מערכת CORS פתוחה לכל (בשלבי הפיתוח בלבד)
app.use(cors());

// חיבור למסד נתונים
mongoose.connect('mongodb+srv://khnl18893:025377326@cluster0.ezin7pn.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// מודל של התמונה
const imageSchema = new mongoose.Schema({
    title: String,
    description: String,
    imagePath: String,
});

const Image = mongoose.model('users', imageSchema);



// ניתוב לדף הראשי
app.get('/', (req, res) => {
    // res.setHeader('Content-Type',  content="text/html");
    res.sendFile(path.join(__dirname, './publicc/indexx.html'));
});

// העלאת תמונה לשרת ושמירה במסד נתונים
app.post('/upload', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const imagePath = req.file.path;

    try {
        const newImage = new Image({ title, description, imagePath });
        await newImage.save();
        res.json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// הצגת כל התמונות מהמסד נתונים
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// קביעת פורט והאזנה לפנייה
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.js