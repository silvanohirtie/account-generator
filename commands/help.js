const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See commands"),

  async execute(interaction) {
    const member = interaction.member;
    if (!member.permissions.has("ADMINISTRATOR")) {
      let embed = new MessageEmbed()
        .setColor("#ad0c98")
        .setTitle("Bot Commands")
        .addField("/generate", "Generate an account of desired service.")
        .addField("/stock", "See Full Bot's accounts stock")
        .addField("/help", "Open this dialog");

      return interaction.reply({ embeds: [embed] });
    } else {
      let embed = new MessageEmbed()
        .setColor("#ad0c98")
        .setTitle("Bot Commands")
        .addField("/generate", "Generate an account of desired service.")
        .addField("/stock", "See Full Bot's accounts stock")
        .addField("/help", "Open this dialog")
        .addField("/change", "Change Cooldown or Channel ID")
        .addField("/add", "Add an account to the stock");
      return interaction.reply({ embeds: [embed] });
    }
  },
};
