import fs from 'fs';
import path from 'path';
import chalk from 'chalk'; // Assuming chalk is installed, otherwise use console.log colors

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    console.log(chalk.green(`✔ ${description} found.`));
    return true;
  } else {
    console.log(chalk.red(`✘ ${description} missing! (Expected at: ${filePath})`));
    return false;
  }
};

console.log(chalk.blue.bold('\n--- Career-Ops Health Check ---\n'));

const envExists = checkFile('.env', '.env config file');
const profileExists = checkFile('config/profile.yml', 'Personal profile.yml');
const cvExists = checkFile('cv.md', 'Your cv.md file');

if (!envExists) {
  console.log(chalk.yellow('\nAction Required: Copy .env.example to .env and add your API keys.'));
}

if (!profileExists) {
  console.log(chalk.yellow('Action Required: Copy config/profile.example.yml to config/profile.yml and edit it.'));
}

if (envExists && profileExists && cvExists) {
  console.log(chalk.green.bold('\n🚀 System is ready for lift-off!\n'));
} else {
  console.log(chalk.red.bold('\n⚠️  Please fix the issues above before running career-ops.\n'));
}