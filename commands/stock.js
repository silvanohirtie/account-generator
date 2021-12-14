const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("See full Stock"),

  async execute(interaction) {
    let accounts = JSON.parse(
      fs.readFileSync(mainPath + "/accounts.json", "utf-8")
    );
    let services = Object.keys(accounts);
    let finalFields = [];

    for (s of services) {
      finalFields.push({
        name: s,
        value: `${accounts[s].length} Accounts`,
        inline: true,
      });
    }
    interaction.reply({
      embeds: [
        {
          title: "Accounts Stock",
          color: "#ad0c98",
          fields: finalFields,
        },
      ],
    });
  },
};
