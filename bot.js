require('dotenv').config();
const Telegraf = require('telegraf')
const fs = require('fs')
const speech = require('@google-cloud/speech').v1p1beta1
const request = require('request')

async function transcribe(fileUri,file_id, ctx, sender){
    var fileName = file_id + '.oga'
    let file = fs.createWriteStream(fileName);
    /* Using Promises so that we can use the ASYNC AWAIT syntax */        
    await new Promise((resolve, reject) => {
        let stream = request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri: fileUri,
        })
        .pipe(file)
        .on('finish', () => {
            console.log(`The file is finished downloading.`);
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`Something happened: ${error}`);
    });

    const voice_file = fs.readFileSync(fileName);

    const audioBytes = voice_file.toString('base64')
    const audio = {
        content: audioBytes,
    };

   const encoding = 'OGG_OPUS';
   const sampleRateHertz = 48000;
   const languageCode = 'en-US';

    const config = {
        encoding: 'OGG_OPUS',
        sampleRateHertz: 48000,
        useEnhanced: true,
        languageCode: `en-US`,
        model: `phone_call`
      };

    const transcribe_request = {
        audio: audio,
        config: config,
    };
    const client = new speech.SpeechClient();

    console.log(transcribe_request.config.sampleRateHertz)


    const [response] = await client.recognize(transcribe_request).catch(console.error);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    console.log(response.results
        .map(result => result.alternatives[0].confidence))
    if(transcription.length == 0){
        ctx.reply('Unable to transcribe :(')
    }else{
        ctx.reply(sender.concat(": ").concat(transcription))
    }

    fs.unlink(fileName, function(err){
        if(err) throw err;
        console.log('File Deleted')
    });

}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Hello, nice to meet you! I will detect voice messages and attempt to convert them into text!'))
bot.use(async(ctx, next) => {
    const msg = ctx.message;
    console.log(msg);
    if(msg && msg.voice){
        var fileUri;
        const sender = msg.from.first_name.concat(' ').concat(msg.from.last_name);
        console.log(sender)
        const voice_file = ctx.telegram.getFileLink(msg.voice.file_id);
        voice_file.then(
            result => transcribe(result, msg.voice.file_id, ctx, sender).catch(console.error),
            error =>  ctx.reply(error)
        );
    }
  });
bot.launch();