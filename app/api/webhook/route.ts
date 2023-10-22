import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/prisma/utlis";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  const {
    data: {
      created_at,
      first_name,
      last_name,
      updated_at,
      username,
      external_accounts,
      profile_image_url
    },
  } = payload;

  try {
    switch (eventType) {
      case "user.created":
        console.log("User creation entered");
        const res = await prisma.user.create({
          data: {
            id: id,
            email: external_accounts[0].email_address,
            createdAt: new Date(created_at),
            firstName: first_name,
            imageUrl: profile_image_url,
            lastName: last_name,
            updatedAt: new Date(updated_at),
            userName: username,
          },
        });
        console.log("User created", res);
        break;
      case "user.updated":
        // Do something with the user
        console.log("User updated");

        break;
      case "user.deleted":
        // Do something with the user
        console.log("User deleted");
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }
  } catch (error) {
    console.error(error);
    return new Response("Error occurred in DB", { status: 400 });
  }

  return new Response("", { status: 201 });
}
