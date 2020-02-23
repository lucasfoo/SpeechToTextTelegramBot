# SpeechToTextTelegramBot

## About this bot
This telegram bot translates audio in telegram into text.
It is powered by telegraf.js,l node.js and Google Cloud speech to text.

## Prerequisites:
1. [Node.js](https://nodejs.org/en/)
2. [Telegraf.js](https://telegraf.js.org/#/)
3. [Google Cloud Console](https://console.cloud.google.com/)

## Instructions:
1. Set up the pre-requisites in your preferred working directory.
2. Drag and drop the js file in this repo into the root folder of the directory. 
3. In the root folder a file called `.env` and input your bot token generated from Telegram's [Botfather](https://core.telegram.org/bots).
4. In the root folder create a file named `key` and input your google cloud API key here.
5. Run the script using Node!

## Usage:
1. Add the bot to your telegram group
2. Upon detection of the voice message, the bot will attempt to trasncribe it into text.
