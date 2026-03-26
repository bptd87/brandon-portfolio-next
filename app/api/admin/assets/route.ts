import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdminClient } from "../../../../lib/supabase/admin";
import { getAdminUserFromRequest } from "../../../../lib/auth/admin-session";

const querySchema = z.object({
  bucket: z.string().min(1).default("portfolio"),
  prefix: z.string().default(""),
  limit: z.coerce.number().min(1).max(200).default(100),
});

const deleteSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      bucket: searchParams.get("bucket") || "portfolio",
      prefix: searchParams.get("prefix") || "",
      limit: searchParams.get("limit") || 100,
    });

    const supabase = getSupabaseAdminClient();
    const normalizedPrefix = parsed.prefix.replace(/^\/+|\/+$/g, "");
    const segments = normalizedPrefix ? normalizedPrefix.split("/") : [];
    const path = segments.slice(0, -1).join("/");
    const search = segments.at(-1) || "";

    const { data, error } = await supabase.storage.from(parsed.bucket).list(path, {
      limit: parsed.limit,
      search,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = (data || []).map((item) => {
      const filePath = [path, item.name].filter(Boolean).join("/");
      const {
        data: { publicUrl },
      } = supabase.storage.from(parsed.bucket).getPublicUrl(filePath);

      return {
        id: filePath,
        name: item.name,
        path: filePath,
        bucket: parsed.bucket,
        publicUrl,
        assetRef: `${parsed.bucket}/${filePath}`,
        size: item.metadata?.size || null,
        mimeType: item.metadata?.mimetype || null,
        createdAt: item.created_at || null,
        updatedAt: item.updated_at || null,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list assets." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const bucket = String(formData.get("bucket") || "portfolio");
    const targetPath = String(formData.get("path") || "").trim().replace(/^\/+/, "");
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    if (!targetPath) {
      return NextResponse.json({ error: "A destination path is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.storage.from(bucket).upload(targetPath, buffer, {
      contentType: file.type || undefined,
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(targetPath);

    return NextResponse.json({
      item: {
        id: `${bucket}/${targetPath}`,
        bucket,
        path: targetPath,
        name: file.name,
        publicUrl,
        assetRef: `${bucket}/${targetPath}`,
        mimeType: file.type || null,
        size: file.size,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload asset." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAdminUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = deleteSchema.parse(payload);

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete asset." },
      { status: 500 }
    );
  }
}
