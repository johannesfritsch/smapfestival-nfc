import db from "../utils/db";
import prompt from "prompt";
import bcrypt from 'bcrypt';

type PromptObj = { name: string; email: string; password: string };

const main = async () => {
  const { name, email, password }: PromptObj = await prompt.get([
    "name",
    "email",
    { name: "password", hidden: true },
  ]);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
    }
  })
};

main().catch((e) => console.error(e));
