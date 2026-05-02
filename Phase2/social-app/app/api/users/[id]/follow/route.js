import * as userRepo from "../../../../../repo/userRepository";

export async function POST(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  const result = await userRepo.toggleFollow(body.followerId, id);

  return Response.json(result, { status: 200 });
}