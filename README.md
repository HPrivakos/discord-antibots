# == Discord AntiBot ==

This bot was created to ban bots joining massively Decentraland discord server.  
You can use it on your own server to get rid of all the nasty bots.  

Only the highest role in your server can use this bot, so likely the admin role.  
I don't know what happen if there is no role beside the default one, so be caution.

To use it, you need to create a bot in the developer portal and add it to your server: [https://discordjs.guide/preparations/setting-up-a-bot-application.html]()  
You need to give read messages, write messages, ban and add reactions permissions to the bot.

Then create a `.env` file in the project and add the following keys:
```
DISCORD_API_KEY=your discord bot api key
WELCOME_CHANNEL=channel id with new users messages
```

To use the bot, go into the your welcome channel, grab the message id of the first bot from the spam/invasion, grab the id of the last message, and type `ban <id 1st msg> <id last msg>`  
Then verify if the timespan from the first and last futur-banned bots are correct, and click on the thumb up, and wait for the magic to happen  

---
## I do not take any responsabilities for issues caused by this bot, please check the code before using it