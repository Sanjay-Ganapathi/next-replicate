import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  //   console.log("Inside Slug route");
  //   console.log(params.id);
  //   return new Response("success");

  const prediction = await replicate.predictions.get(params.id);

  if (prediction?.error) {
    return NextResponse.json(prediction.error, { status: 500 });
  }

  return NextResponse.json(prediction, { status: 200 });
}
