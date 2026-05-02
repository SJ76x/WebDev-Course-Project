import * as userRepo from "../../../repo/userRepository";

export async function GET() {
  const users = await userRepo.getAllUsers();
  return Response.json(users, { status: 200 });
}