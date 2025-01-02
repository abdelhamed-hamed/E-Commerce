import jwt from "jsonwebtoken";

class Tokens {
  creatToken = (id: any, role: string) =>
    jwt.sign({ _id: id, role }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRED!,
    });

  // To Do Token On REset Password For 10 minutea
  PasswordToken = (id: any) =>
    jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY_RESET_PASSWORD!, {
      expiresIn: process.env.JWT_EXPIRED_RESET_PASSWORD,
    });
}
const tokens = new Tokens();
export default tokens;
