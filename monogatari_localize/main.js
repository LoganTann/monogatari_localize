// THIS CODE DON'T HAVE ACCESS TO THE NODE API
// Use preaload.js instead

// object -> <locale> -> <lablel> -> {content}


function getSelectedLanguage() {
  const e = document.getElementById("languageSelector");
  return e.options[e.selectedIndex].value;
}
function getSelectedLabel() {
  const e = document.getElementById("labelSelect");
  return e.options[e.selectedIndex].value;
}

const scriptingObject = {

};
const monogatariCharacters = {
  "aya": {
    //...
  },
  "shin": {
    //...
  }
};
const commands_definitions = {
  string: [
    {
      name: "show message",
      arguments: "%message", // not implemented
      can_be_translated: true
    },
    {
      name: "show character",
      arguments: "%character", // same ?
      optionnal_args: "%with classes",
      can_be_translated: false
    },
    {
      name: "narrator",
      arguments: "a dialog !",
      can_be_translated: true
    },
    {
      name: "end",
      arguments: false,
      can_be_translated: false
    },
    {
      name: "jump",
      arguments: "%label",
      can_be_translated: false
    }
    // default can be translated
  ],
  objects: {

  }
};

function updateScriptContainer() {
  const lg = getSelectedLanguage();
  const label = getSelectedLabel();
  const labelToRender = scriptingObject[lg][label];
  for (let i in labelToRender) {
    const disp_rule = createDisplayRulesFor(labelToRender[i]);
    //generateFromDispRules(disp_rule);
  }
}
function createDisplayRulesFor(command) {
  const displayRules = [];
  const lowercase_cmd = command.toLowerCase();
  if (typeof command === "string") {
    // Checks for the command
    let final_cmd_object = {};
    for (let cmd_object of commands_definitions.string) {
      let cmd_name = cmd_object.name;
      if (lowercase_cmd.startsWith(cmd_name)) {
        final_cmd_object = cmd_object;
        displayRules.push( {type: "command", value: cmd_name});

        const rg = new RegExp(cmd_name,"gi");
        command = command.replace(rg, "");
        break;
      }
    }
    // type : notTranslatable
    if (final_cmd_object === {}) {
      return [{type: "text", value: command}];
    }
    const arguments = command.trim().split(" ");
    const cmd_neededArgs = final_cmd_object.arguments.split(" ");
    // handles very bad multiple spaces
    let neededArgsCount = 0;
    let unused_args = "";
    for (const arg_i in cmd_neededArgs) {
      if (cmd_neededArgs[arg_i].includes("%")) {
        displayRules.push( {type: cmd_neededArgs[arg_i].substring(1), value: arguments[arg_i]});
      } else if (typeof arguments[arg_i] === "string") {
        unused_args += arguments[arg_i] + " ";
        // goes to last text TODO : handle that with optionnal args
      }
      neededArgsCount++;
    }
    if (neededArgsCount < arguments.length){
      for (var i = neededArgsCount; i < arguments.length; i++) {
        unused_args += arguments[i] + " ";
      }
    }
    if (unused_args !== "") {
      displayRules.push( {type: "text", value: unused_args});
    }
  } else {
    // ... ? TODO
  }
  console.log(displayRules);
}
function test_scripting_object_fill() {
  scriptingObject["English"] = {
    "start": [
      "show character aya yay with fadeIn",
      "narrator Hello World",
      "NaRrator I'm admin !",
      "jump Hello"
    ],
    "Hello": [
      "show character shin cool with fadeIn",
      "narrator Hello again",
      "narrator This is a second label !",
      "end"
    ],
  };

  scriptingObject["Français"] = {
    "start": [
      "show character aya yay with fadeIn",
      "narrator Bonjour le monde",
      "narrator Je suis Admin !",
      "jump Hello"
    ],
    "Hello": [
      "show character shin cool with fadeIn",
      "narrator Encore bonjour",
      "narrator C'est un autre label !",
      "end"
    ]
  }
}

function initSidebar() {
  const defaultLg = "English", defaultLabel = "start";
  const languageSelector = document.getElementById("languageSelector");
  const labelSelect = document.getElementById("labelSelect");

  languageSelector.addEventListener("change", updateScriptContainer);
  for (let langName in scriptingObject) {
    const option = document.createElement("option");
    option.setAttribute("value", langName);
    option.innerText = langName;
    if (langName == defaultLg) {
      option.setAttribute("selected", "selected");
    }
    languageSelector.append(option);
  }

  labelSelect.addEventListener("change", updateScriptContainer);

  for (let labelName in scriptingObject[defaultLg]) {
    const option = document.createElement("option");
    option.setAttribute("value", labelName);
    option.innerText = labelName;
    if (labelName == defaultLabel) {
      option.setAttribute("selected", "selected");
    }
    labelSelect.append(option);
  }
}

// TODO: On load from monogatari script, add security to be sure the labels are
// the same between languages

document.addEventListener("DOMContentLoaded", function() {
  test_scripting_object_fill();
  initSidebar();


  updateScriptContainer();
});
