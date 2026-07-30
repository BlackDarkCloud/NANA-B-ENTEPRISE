import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { images: true, active: true },
  });

  if (!product?.active || !product.images[0]) {
    return NextResponse.redirect(`${siteUrl}/assets/appliance-showroom.png`);
  }

  const image = product.images[0];
  const dataImage = image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);

  if (dataImage) {
    return new Response(Buffer.from(dataImage[2], "base64"), {
      headers: {
        "Content-Type": dataImage[1],
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  if (image.startsWith("/")) {
    return NextResponse.redirect(`${siteUrl}${image}`);
  }

  try {
    return NextResponse.redirect(new URL(image));
  } catch {
    return NextResponse.redirect(`${siteUrl}/assets/appliance-showroom.png`);
  }
}
