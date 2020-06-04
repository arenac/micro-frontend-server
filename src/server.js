import app from './app';

app.listen(process.env.PORT, () =>
console.log(`Server available at ${process.env.BASE_URL}:${process.env.PORT}`))

