import * as userRepo from "../../../../repo/userRepository";

export async function GET(request, context) {
  const { id } = await context.params;

  const user = await userRepo.getUserById(id);

  if (!user) {
    return Response.json(
      { message: "User not found", status: 404 },
      { status: 404 }
    );
  }

  return Response.json(user, { status: 200 });
}