import chalk from "chalk";

export const printColor = (color, msg) => {
  console.log(chalk[color](msg));
};

export const createConfigFile = async ({ env_id, name, env_path }) => {
  const config = {
    id: env_id,
    name: name,
    env_location: env_path,
  };
  const filePath = path.join(process.cwd(), "envmon-config.json");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
};
