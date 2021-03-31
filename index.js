const Discord = require("discord.js");
const config = require("./config.json");
prefix = "/";
const act = [`prefix : ${prefix}`, 'BDE RAVENS']

const client = new Discord.Client();

client.on("message", async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;


  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  //ping
  if (command === "ping") {
    message.delete();
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  //create_project
  else if (command === "create_project") {
    const name = ("Projet: ".concat(`${args[0]}`)).toUpperCase();
    message.delete();
	  let myRole = message.guild.roles.cache.find(role => role.name === name);
    if (!myRole) {
	    message.guild.roles.create({data: {name: name, permissions: []}}).then(myRole => {
        message.guild.channels.create(name, {type: 'category', position: 1,
          permissionOverwrites: [
            {id: message.guild.id, deny: ['VIEW_CHANNEL']},
            {id: myRole.id, allow: ['VIEW_CHANNEL']}
          ]
        }).then(cat => {
          message.guild.channels.create('Description', {type: 'text', parent: cat})
          message.guild.channels.create('Compte Rendu', {type: 'text', parent: cat})
          message.guild.channels.create('Discussion', {type: 'text', parent: cat})
          message.guild.channels.create('Rendez vous', {type: 'text', parent: cat})
          message.guild.channels.create('Vocal', {type: "voice", parent: cat})
        });
      });
      message.channel.send(`Projet ${args[0]} créé avec succès`);
    } else {
      message.channel.send(`le Projet ${args[0]} existe déjà`);
    }
  }

  //delete_project
  else if (command === "delete_project") {
    const name = "Projet: ".concat(`${args[0]}`).toUpperCase();
    message.delete();
    let myRole = message.guild.roles.cache.find(role => role.name === name);
    if (myRole) {
      let myCategory = message.guild.channels.cache.find(channel => channel.name === name);
      myCategory.children.forEach(channel => channel.delete());
      myCategory.delete();
      myRole.delete();
      message.channel.send(`Projet ${args[0]} supprimé avec succès`);
    } else {
      message.channel.send(`le Projet ${args[0]} n'existe pas`);
    }
  }

  //reaction_role
  else if (command === "reaction_role") {
    const channel = message.channel;
    message.delete();
    if (args.length %2 != 0 || args.length == 0) {
      channel.send(`wrong nbr of args: use ${prefix}reaction_bot [emoji role_name]+`);
    } else {
      msg = "";
      emojis = [];
      roles = [];
      for (i = 0; args[i]; i+= 2) {
        emojis[i/2] = args[i];
        emo_id = args[i].match(/[0-9]*/);
        if (emo_id && emo_id.index != 0) {
          emojis[i/2] = Object.values(emo_id)[0];
        }
        roles[i/2] = message.guild.roles.cache.find(role => role.name === args[i+1]);
        if (!roles[i/2]) {
          channel.send(`command failed: ${args[i+1]} does'nt exist`);
          return
        }
        msg = msg + args[i] + " : " + args[i+1] + "\n";
      }
      let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('react to get the role')
            .setDescription(msg);
      channel.send(embed).then(post => {
        emojis.forEach(elem => {
          post.react(elem).catch(error => function () {
            post.delete().then(channel.send(`command failed:can't react with ${elem}`));
            return;
          });
        });
      });
      client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (reaction.message.channel.id == channel) {
          can = false;
          i = 0;
          for (; emojis[i]; i++) {
            if (reaction.emoji.name === emojis[i]) {
              can = true;
              break;
            }
          }
          if (can) {
            await reaction.message.guild.members.cache.get(user.id).roles.add(roles[i]);
          }
        } else {
            return;
        }
    });
    client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (reaction.message.channel.id == channel) {
          can = false;
          i = 0;
          for (; emojis[i]; i++) {
            if (reaction.emoji.name === emojis[i]) {
              can = true;
              break;
            }
          }
          if (can) {
              await reaction.message.guild.members.cache.get(user.id).roles.remove(roles[i]);
          }
        } else {
            return;
        }
    });
    }
  }

  //clear
  else if (command === "clear") {
    if (args.length != 1) return message.reply("Please enter the amount of messages to clear! and only that!");
    if (!args[0]) return message.reply("Please enter the amount of messages to clear!");
    if(isNaN(args[0])) return message.reply("Please type a real number!");
    if(args[0] > 100) return message.reply("You can't remove more than 100 messages!");
    if(args[0] < 1) return message.reply("You have to delete at least one message!");
    message.channel.messages.fetch({ limit: args[0]}).then(messages =>{ message.channel.bulkDelete(messages)});
  }

  //prefix
  else if (command === "prefix") {
    if (args.length != 1) return message.reply("Please enter the prefix you want to use and only that!");
    if (!args[0]) return message.reply("Please enter the prefix you want to use!");
    if (args[0].length != 1) return message.reply("Please enter a valid prefix! (length must be 1)");
    prefix = args[0];
    message.channel.send(`the new prefix is '${prefix}'`);
  }

  //report            NICOLAS, JE PENSE QUE TES DM SONT FERMEE ? SI OUI CELA EXPLIQUE LE CRASH DE CETTE COMMANDE DCP JAI MIS TON ID EN COMMENT
  else if(command === "report"){        
    let lala = client.users.cache.find(e => e.id === '398127577954385920')// && '297728673078050817')// && '268871660994560000')
    let azerty= message.content.slice(8)
    if(!azerty)
    {
      return message.channel.send(`Veuillez indiquez un rapport de bug : ${prefix}report <Votre_Bug>`)
    } else {
        let boomboom = new Discord.MessageEmbed()
            .setColor('black') 
            .setTitle('Voici un rapport de bug')
            .setThumbnail(message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .addField('De : ', message.author.tag)
            .addField('ID : ', message.author.id)
            .addField('Son rapport : ', azerty)
            .setTimestamp()
        lala.send({embed: boomboom}).catch(console.error)
        let rep = new Discord.MessageEmbed()
          .setColor('black') 
          .setTitle('Merci pour votre rapport ' + message.author.username + ' !')
          message.channel.send({embed: rep}).catch(console.error)
        }
  }

  //userinfo
  else if(command === "userinfo"){   
    let member = message.mentions.members.first()     
    let UserInfo = message.mentions.members.first() || message.member;
    let usericon = UserInfo.user.avatarURL({format: 'png', dynamic: true, size: 1024});
    let useremb = new Discord.MessageEmbed()
    .setDescription("Information sur l'utilisateur")
    .setColor("RANDOM")
    .setThumbnail(usericon)
    .addField("Nom d'utilisateur:", UserInfo.user.username)
    .addField("Tag:", UserInfo.user.tag)
    .addField("Status:", UserInfo.user.presence.status)
    .addField("Playing:", UserInfo.user.presence.game)
    .addField("Bot:", UserInfo.user.bot)
    .addField("rejoins le:", UserInfo.joinedAt)
    .addField("compte crée le:", UserInfo.user.createdAt)
    .addField("ID:", UserInfo.id)
    message.channel.send(useremb).catch(console.error)
  }

//servinfo
else if(command === "servinfo"){        
      var servinfo = new Discord.MessageEmbed()
      .setDescription("Information du serveur :")
      .addField("Nom du serveur : ", message.guild.name)
      .addField("Crée le : ", message.guild.createdAt)
      .addField("Tu as rejoins le ", message.member.joinedAt)
      .addField("Utilisateurs sur le serveur : ", message.guild.memberCount)
      .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true, size: 1024})) 
      .setColor("black")
      message.channel.send(servinfo)
  }

  //pp
  else if(command === "pp") {
    let waiting = await message.channel.send("En attente..")//.catch(console.error);
    let mentionedUser = message.mentions.users.first() || message.author;
    let avatarembed = new Discord.MessageEmbed()
        .setImage(mentionedUser.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
        .setColor("RANDOM")
        .setTitle("Avatar")
        .setFooter("Demandé par " + message.author.tag)
        .setDescription("Lien de l'avatar : " + mentionedUser.displayAvatarURL({format: 'png', dynamic: true, size: 1024}));
    waiting.edit(avatarembed)//.catch(console.error)
}

//sondage
else if(command === "sondage") {
  if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply('Vous ne pouvez pas utiliser cette commande');
      let args = message.content.slice(9)
  message.delete()
  if(!args){
      return message.channel.send("Veuillez poser une question")
  } else {
  let embed = new Discord.MessageEmbed()
          .setColor("black")
          .setTitle(args)
          .setColor("RANDOM")
          .setDescription("Réagir avec les réactions: ✅ ou ❌")
          message.channel.send(embed).then(async function(message){
             await message.react("✅")
             await message.react("❌")
          })
      }
  }

  //help
  if(command === "help") {
    let help = new Discord.MessageEmbed()
    .setColor('black')
    .setDescription("**HELP**")
    .setThumbnail(message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
    .addField(`**${prefix}ping**`,'Renvoie la latence.')
    .addField(`**${prefix}create_project**`,'Cree un projet.')
    .addField(`**${prefix}delete_project**`,'Supprime un projet.')
    .addField(`**${prefix}reaction_role <role_1> <role_2>**`,'Attribution de roles avec des réactions.')
    .addField(`**${prefix}clear <nombre>**`,'Supprime le nombre de message precisé.')
    .addField(`**${prefix}pp <mentionne un membre>**`,'Renvoie la pp du membre concerné.')
    .addField(`**${prefix}sondage <votre sondage>**`,'Lance un sondage.')
    .addField(`**${prefix}prefix <nouveau prefix>**`,'Modifie le prefix actuel.')
    .addField(`**${prefix}userinfo <mentionne un membre>**`,'Affiche les infos concernant l\'utilisateur concerné.')
    .addField(`**${prefix}servinfo**`,'Affiche les infos du serveur.')
    .addField(`**${prefix}report <votre bug>**`,'Envoie votre report aux développeurs.')
    message.channel.send(help).catch(console.error)
}

});

client.login(config.BOT_TOKEN);
  client.on('ready', async function() {
    setInterval(() => {
        let a = act[Math.floor(Math.random() * act.length)]
        client.user.setActivity(a, {
            type: 'STREAMING',
        })
    }, 2000);
  console.log("BDE RAVENS, en avant toute !")
  })