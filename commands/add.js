const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
let mainPath = path.join(__dirname, "..");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add an account")
    .addStringOption((option) =>
      option
        .setName("service")
        .setDescription("Account's serice (netflix, spotify etc...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("account")
        .setDescription("Account credentials or Rendeem Code")
        .setRequired(true)
    ),

  async execute(interaction) {
    const member = interaction.member;
    if (!member.permissions.has("ADMINISTRATOR"))
      return interaction.reply("You do not have the permissions to do that");

    let data = fs.readFileSync(mainPath + "/accounts.json", "utf-8");

    const service = interaction.options
      .getString("service")
      .toLowerCase()
      .trim();
    const account = interaction.options
      .getString("account")
      .toLowerCase()
      .trim();

    if (data == "" || data == " " || data.length == 0) {
      let newId = Math.floor(100000 + Math.random() * 900000);
      let newAccount = {
        id: newId,
        value: account,
        time: new Date(),
      };
      data = {
        [service]: [newAccount],
      };

      fs.writeFileSync(mainPath + "/accounts.json", JSON.stringify(data));
      let logs = JSON.parse(fs.readFileSync(mainPath + "/logs.json", "utf-8"));
      logs.unshift({
        type: "add",
        time: new Date(),
        id: newId,
      });
      fs.writeFileSync(mainPath + "/logs.json", JSON.stringify(logs));
      return interaction.reply("Account added!");
    } else {
      let newId = Math.floor(100000 + Math.random() * 900000);
      let existingsIds = [];
      let services = Object.keys(data);
      for (s of services) {
        for (acc of data[s]) {
          existingsIds.push(acc.id);
        }
      }
      while (existingsIds.includes(newId)) {
        newId = Math.floor(100000 + Math.random() * 900000);
      }

      let newAccount = {
        id: newId,
        value: account,
        time: new Date(),
      };
      data = JSON.parse(data);
      console.log(newAccount);
      if (data[service]) data[service] = [...data[service], newAccount];
      else data[service] = [newAccount];
      console.log(data);
      fs.writeFileSync(mainPath + "/accounts.json", JSON.stringify(data));
      let logs = JSON.parse(fs.readFileSync(mainPath + "/logs.json", "utf-8"));
      logs.unshift({
        type: "add",
        time: new Date(),
        id: newId,
      });
      fs.writeFileSync(mainPath + "/logs.json", JSON.stringify(logs));
      return interaction.reply("Account added!");
    }
  },
};
