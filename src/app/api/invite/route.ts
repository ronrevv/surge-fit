import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint uses the service role key to invite a user
export async function POST(req: NextRequest) {
  try {
    const { email, role = "trainee", branchId, orgId, inviterId } = await req.json();

    if (!email || !inviterId) {
      return NextResponse.json({ error: "Email and inviterId are required" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Invite the user via Supabase Auth
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${req.nextUrl.origin}/update-password`,
    });

    if (inviteError) {
      console.error("Invite error:", inviteError);
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    // 2. Record the invitation in our custom invitations table
    const { error: dbError } = await supabaseAdmin.from("invitations").insert({
      email,
      role,
      branch_id: branchId || null,
      organization_id: orgId || null,
      invited_by: inviterId,
      status: "SENT",
    });

    if (dbError) {
      console.error("Database invite tracking error:", dbError);
      // We still return 200 because the email sent successfully, but log the error
    }

    return NextResponse.json({ success: true, user: inviteData.user });
  } catch (error: any) {
    console.error("Unexpected error in /api/invite:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
