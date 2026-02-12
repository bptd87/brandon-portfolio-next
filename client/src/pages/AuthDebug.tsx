import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthDebug() {
    const [supabaseSession, setSupabaseSession] = useState<any>(null);
    const { data: trpcUser, isLoading, error } = trpc.auth.me.useQuery();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSupabaseSession(data.session);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold">Auth Debug</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Supabase Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify({
                                hasSession: !!supabaseSession,
                                userId: supabaseSession?.user?.id,
                                email: supabaseSession?.user?.email,
                                accessToken: supabaseSession?.access_token ? `${supabaseSession.access_token.substring(0, 20)}...` : null,
                            }, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>tRPC auth.me Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify({
                                isLoading,
                                error: error?.message,
                                user: trpcUser,
                            }, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
