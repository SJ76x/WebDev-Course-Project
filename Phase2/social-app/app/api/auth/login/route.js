import * as userRepo from "../../../../repo/userRepository";

export async function POST(request) {
  const body = await request.json();

  if (!body.email || !body.password) {
    return Response.json(
      { message: "email and password are required", status: 400 },
      { status: 400 }
    );
  }

  const user = await userRepo.getUserByEmail(body.email);

  if (!user) {
    return Response.json(
      { message: "Invalid email or password", status: 401 },
      { status: 401 }
    );
  }

  if (user.password !== body.password) {
    return Response.json(
      { message: "Invalid email or password", status: 401 },
      { status: 401 }
    );
  }

  return Response.json(user, { status: 200 });
}