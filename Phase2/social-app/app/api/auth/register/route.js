import * as userRepo from "../../../../repo/userRepository";

export async function POST(request) {
  const body = await request.json();

  if (!body.username || !body.email || !body.password) {
    return Response.json(
      { message: "username, email, and password are required", status: 400 },
      { status: 400 }
    );
  }

  const existingByEmail = await userRepo.getUserByEmail(body.email);

  if (existingByEmail) {
    return Response.json(
      { message: "Email already exists", status: 400 },
      { status: 400 }
    );
  }

  const allUsers = await userRepo.getAllUsers();
  const existingByUsername = allUsers.find(
    (user) => user.username === body.username
  );

  if (existingByUsername) {
    return Response.json(
      { message: "Username already exists", status: 400 },
      { status: 400 }
    );
  }

  const user = await userRepo.createUser(body);

  return Response.json(user, { status: 201 });
}