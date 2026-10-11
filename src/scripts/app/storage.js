export let commandStorage = [];
export let variableStorage = [];

export const storeCommand = (command) => {
  // if linenumer already exists -> remove
  const exists = commandStorage.findIndex((obj) => obj.lineNumber === command.lineNumber);
  if (exists !== -1) commandStorage.splice(exists, 1);

  // push and sort new command
  commandStorage.push(command);
  commandStorage.sort((a, b) => a.lineNumber - b.lineNumber);
};

export const storeVariable = (name, value) => {
  variableStorage[name] = value;
};

export const clearCommandStorage = () => {
  commandStorage = [];
};

export const clearVariableStorage = () => {
  variableStorage = [];
};

export const clearAllStorage = () => {
  commandStorage = [];
  variableStorage = [];
};
