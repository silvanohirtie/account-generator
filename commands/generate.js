const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
const { MessageEmbed } = require("discord.js");
const generated = new Set();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("generate")
    .setDescription("Generate An Account")
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName("service")
        .setDescription("Specify the service you want")
    ),

  async execute(interaction) {
    let user = interaction.user.username + "#" + interaction.user.discriminator;
    if (generated.has(user))
      return interaction.reply("Wait before generating another account...");

    let accounts = JSON.parse(
      fs.readFileSync(mainPath + "/accounts.json", "utf-8")
    );
    let logs = JSON.parse(fs.readFileSync(mainPath + "/logs.json", "utf-8"));
    let blocked = JSON.parse(
      fs.readFileSync(mainPath + "/blocked.json", "utf-8")
    );
    let settings = JSON.parse(
      fs.readFileSync(mainPath + "/settings.json", "utf-8")
    );
    let services = Object.keys(accounts);

    const service = interaction.options
      .getString("service")
      .toLowerCase()
      .trim();

    if (interaction.channelId != settings.channelId)
      return interaction.reply(
        `This command can be runned only in <#${settings.channelId}>`
      );

    for (let b of blocked) {
      if (b.user == user)
        return interaction.reply("You are blocked! Contact an admin.");
    }

    if (!service)
      return interaction.reply("Please, specify the service you want!");

    let genAccount = accounts[service];

    if (!genAccount) return interaction.reply("That service does not exists!");

    if (genAccount.length < 1)
      return interaction.reply(
        "There isn't any available account for that service"
      );

    genAccount = genAccount[0];

    const embed = new MessageEmbed()
      .setColor("#ad0c98")
      .setTitle("Account Generated!")
      .setURL("https://discord.js.org/")
      .setThumbnail(
        "http://www.compartosanita.it/wp-content/uploads/2019/02/right.png"
      )
      .setDescription("Check your dm for the account's information!")
      .setTimestamp()
      .setFooter(
        "Bot Author: Silvano#9542",
        "https://cdn.discordapp.com/avatars/610140257203126282/af64f47d1c1790af9ad248508bf60c31.png?size=128"
      );

    let accountId = genAccount.id ? genAccount.id : "Error";
    let accountCredentials = genAccount.value ? genAccount.value : "Error";

    let userEmbed = new MessageEmbed()
      .setColor("#ad0c98")
      .setTitle("Account information")
      .addField("ID", accountId.toString())
      .addField("Service", service)
      .addField("Credentials", accountCredentials);

    await interaction.user.send({ embeds: [userEmbed] });
    await interaction.reply({ embeds: [embed] });

    accounts[service].shift();
    logs.push({
      type: "gen",
      user: user,
      account_id: genAccount.id,
      service: service,
      time: new Date(),
    });

    fs.writeFileSync(mainPath + "/logs.json", JSON.stringify(logs));
    fs.writeFileSync(mainPath + "/accounts.json", JSON.stringify(accounts));
    generated.add(user);
    setTimeout(() => {
      generated.delete(user);
    }, parseInt(settings.cooldown));
  },
};
