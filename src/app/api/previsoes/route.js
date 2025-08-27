import { mockData } from "../xg_xga/route";

// Função Poisson
function poisson(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// Calcula probabilidades de um confronto
function calcularProbabilidades(xG_home, xGA_home, xG_away, xGA_away) {
  const lambdaHome = (xG_home + xGA_away) / 2;
  const lambdaAway = (xG_away + xGA_home) / 2;

  const maxGols = 5;
  let pHomeWin = 0;
  let pDraw = 0;
  let pAwayWin = 0;

  for (let i = 0; i <= maxGols; i++) {
    for (let j = 0; j <= maxGols; j++) {
      const p = poisson(i, lambdaHome) * poisson(j, lambdaAway);
      if (i > j) pHomeWin += p;
      else if (i === j) pDraw += p;
      else pAwayWin += p;
    }
  }

  return {
    vitória_home: Number(pHomeWin.toFixed(2)),
    empate: Number(pDraw.toFixed(2)),
    vitória_away: Number(pAwayWin.toFixed(2)),
  };
}

export async function GET() {
  try {
    const resultados = [];

    // Gerar todos os confrontos possíveis entre os 4 times
    for (let i = 0; i < mockData.length; i++) {
      for (let j = 0; j < mockData.length; j++) {
        if (i === j) continue; // Não joga contra si mesmo

        const home = mockData[i];
        const away = mockData[j];

        const probabilidades = calcularProbabilidades(
          home.xG,
          home.xGA,
          away.xG,
          away.xGA
        );

        resultados.push({
          home: home.name,
          away: away.name,
          probabilidades,
        });
      }
    }

    return new Response(JSON.stringify(resultados), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
