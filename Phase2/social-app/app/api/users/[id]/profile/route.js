import * as userRepo from "../../../../../repo/userRepository";

export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    const user = await userRepo.updateUser(id, body);
    return Response.json(user, { status: 200 });
  } catch {
    return Response.json(
      { message: "User not found", status: 404 },
      { status: 404 }
    );
  }
}
