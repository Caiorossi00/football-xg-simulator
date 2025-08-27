export const mockData = [
  { name: "Palmeiras", xG: 1.55, xGA: 0.95 },
  { name: "Flamengo", xG: 1.85, xGA: 1.1 },
  { name: "Atlético-MG", xG: 1.65, xGA: 1.1 },
  { name: "Botafogo", xG: 1.5, xGA: 1.2 },
];

export async function GET() {
  try {
    return new Response(JSON.stringify(mockData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
