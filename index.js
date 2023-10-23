const { Telegraf, Markup } = require('telegraf')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const User=require('./db/User')
dotenv.config()
const bot = new Telegraf(process.env.token)


mongoose.connect(process.env.MonGoURL, {
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then((res)=>console.log("Connected to database successfully!"))
.catch(err=>console.log(err))

// Middleware to check if the user is a member of the specified channel
bot.use(async (ctx, next) => {
  try {
    const channel = '@tme_friends';
    const chatMember = await ctx.telegram.getChatMember(channel, ctx.from.id);
    const isSubscribed = ['administrator', 'member', 'owner', 'creator'].includes(chatMember.status);

    if (isSubscribed) {
      return next(); // Continue to the next middleware
    } else {
      ctx.reply("Botdan foydalanish uchun kanalimizga obuna bo'ling", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Kanalga obuna bo'lish", url: "https://t.me/multilevel_speakApp" }]
          ]
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

bot.start( async (ctx) => {
  ctx.reply(`Assalomu alaykum, ${ctx.message.chat.first_name}! Edumo akademiyasining ta'lim botiga xush kelibsiz! Foydalanish uchun menulardan birini tanlang`, Markup
    .keyboard([
      ['📚 Kitoblar', '🌐 Ilovamiz', '⤵️ Kanalimiz'],
      ['📢 Reklama', '✅ Biz haqimizda']
    ])
    .oneTime()
    .resize()
    .extra()
  );

//Save db

  try{
   const newUser={
    id: ctx.from.id,
    username: ctx.from.username,
    first_name: ctx.from.first_name
   }
    await User.create(newUser).then((res)=>console.log(res)).catch((err=> console.log(err)))
  }
  catch(err){
    console.log(err)
  }


});

bot.hears('📚 Kitoblar', (ctx) => {
  ctx.reply('Quyidagi Skillardan birini tanlang', Markup.inlineKeyboard([
    [Markup.callbackButton('B1 Level', 'pet')],
    [Markup.callbackButton('Listening', 'listening')],
    [Markup.callbackButton('Mock Testlar', 'mock')],
    [Markup.callbackButton('Javoblar varaqasi', 'answersheet')],
  ])
    .oneTime()
    .resize()
    .extra()
  );
});


//Pet
bot.action('pet', (ctx) => {
  var books = [
    'https://eslcafe.ru/wp-content/uploads/2017/09/Cb-papers-PET-1.pdf',
    'https://eslcafe.ru/wp-content/uploads/2017/09/Cb-papers-PET-2.pdf',
    'https://eslcafe.ru/wp-content/uploads/2017/09/Cb-papers-PET-3.pdf',
    'https://eslcafe.ru/wp-content/uploads/2017/09/Cb-papers-PET-4.pdf',
    'https://eslcafe.ru/wp-content/uploads/2017/09/Cb-papers-PET-5.pdf'
  ];

  for (var book of books) {
    ctx.replyWithDocument(book, { caption: 'PET Practice Books\n\n  @edumo_uz' });
  }
});

//Answersheet
bot.action('answersheet', (ctx) => {

    ctx.replyWithDocument('https://firebasestorage.googleapis.com/v0/b/intrepid-honor-321018.appspot.com/o/bot-assets%2FAnswer%20Sheet.pdf?alt=media&token=c5f620f6-3011-48d5-97e7-6cc8cf0c887c', { caption: 'Javoblar Varaqasi\n\n  @edumo_uz' });

});


//Listening

bot.action('listening', (ctx) => {

  var lists=[
    'https://firebasestorage.googleapis.com/v0/b/intrepid-honor-321018.appspot.com/o/bot-assets%2FMaps%20%40edumo_uz.pdf?alt=media&token=0e674316-3396-44e4-a67b-2919fff3a2a9',
    'https://firebasestorage.googleapis.com/v0/b/intrepid-honor-321018.appspot.com/o/bot-assets%2FMap%20Answers.pdf?alt=media&token=efa6b0a5-6b28-4f45-a70b-06497a8131e0',
    'https://firebasestorage.googleapis.com/v0/b/intrepid-honor-321018.appspot.com/o/bot-assets%2FMap%20Scripts.pdf?alt=media&token=55278e28-c806-4a23-ad49-931de09336d0',
  ]

    for (var list of lists){
    ctx.replyWithDocument(list, { protect_content:true,caption: 'Map Listening\n\n  @edumo_uz' });
    }

    ctx.reply('Audiosi quyidagi manzilda: https://t.me/edumo_baza/563 ')
});


//Mock tests
bot.action('mock', (ctx) => {

  ctx.reply('Mock Test 1. Yuklab olish uchun havola ustiga bosing\n https://firebasestorage.googleapis.com/v0/b/exam-online-384406.appspot.com/o/Mock%20testlar%2F07.10.2023.zip?alt=media&token=e32df3c1-3217-42d8-9281-64ae28f4bd6f', {protect_content:true});

  ctx.reply('Mock Test 2. Yuklab olish uchun havola ustiga bosing\n https://firebasestorage.googleapis.com/v0/b/exam-online-384406.appspot.com/o/Mock%20testlar%2FMock%2017.10.2023.zip?alt=media&token=5e5fc2e7-6760-473f-8de7-dfc1e84bfe96', {protect_content:true});
  

  ctx.reply('Mock Test 3. Yuklab olish uchun havola ustiga bosing\n https://firebasestorage.googleapis.com/v0/b/exam-online-384406.appspot.com/o/Mock%20testlar%2FMock%2018.10.2023.zip?alt=media&token=c827ab14-e088-4214-ae70-4fa4ac847a89', {protect_content:true});

});







// Add similar actions for other menu items like 'listening', 'writing', 'speaking', and 'mock'.

bot.hears('📢 Reklama', (ctx) => ctx.reply('Tijoriy maqsadlar uchun @javlon_developer bilan bog\'laning'));
bot.hears('⤵️ Kanalimiz', (ctx) => ctx.reply('Kanalimizga ulaning: @multilevel_speakApp'));
bot.hears('🌐 Ilovamiz', (ctx) => ctx.reply(' https://play.google.com/store/apps/details?id=vercel.multiexam.app'));
bot.hears('✅ Biz haqimizda', (ctx) => ctx.reply('Ushbu bot Edumo jamoasi (@edumo_uz) tomonidan yaratilgan bo\'lib, botdan foydalanish mutlaqo bepul.\n\n 📩 Taklif va shikoyatlaringiz bo\'lsa, @javlon_developer ga yuboring '));


/*
bot.hears("Javascript", (ctx)=>{
    ctx.reply("Javascript dasturlash olamida juda mashhur til hisoblanadi")
})

bot.on('message', (ctx)=>{
    ctx.replyWithChatAction('typing')
    setTimeout(()=>{
        ctx.reply("Sizga qanday xizmat kerak")
    })
    
})
let username;
bot.use(async (ctx)=>{
    username=ctx.message.from.username
    await next()
    
})

bot.on('text', (ctx)=>{
    ctx.reply(`Salom, @${username}`)
})

bot.url(/https/, (ctx)=>{
    ctx.reply("Don't share url")
})
*/
bot.launch()

