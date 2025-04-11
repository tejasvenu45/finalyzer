export async function POST() {
    const response = new Response(
      JSON.stringify({ message: "Logout successful." }),
      { status: 200 }
    );
  
    response.headers.set(
      "Set-Cookie",
      `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`
    );
  
    return response;
  }
  