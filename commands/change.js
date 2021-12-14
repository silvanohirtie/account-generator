const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change")
    .setDescription("Change settings values")
    .addStringOption((option) =>
      option
        .setName("setting")
        .setDescription("Setting To change")
        .setRequired(true)
        .addChoice("Cooldown", "cooldown")
        .addChoice("Channel ID", "channelId")
    )
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName("value")
        .setDescription("New Setting Value")
    ),

  async execute(interaction) {
    const member = interaction.member;
    if (!member.permissions.has("ADMINISTRATOR"))
      return interaction.reply("You do not have the permissions to do that");
    let settings = JSON.parse(
      fs.readFileSync(mainPath + "/settings.json", "utf-8")
    );

    const setting = interaction.options.getString("setting");
    const value = interaction.options.getString("value");

    if (isNaN(parseInt(value))) return interaction.reply("Value not valid!");
    console.log(settings[setting]);
    console.log(value);
    settings[setting] = value;
    fs.writeFileSync(mainPath + "/settings.json", JSON.stringify(settings));
    return interaction.reply("Setting Changed!");
  },
};
