"use client";

import { useEffect, useState } from "react";

// Função para aplicar variação aleatória de ±10%
function aplicarVariacao(valor) {
  const variacao = 0.1; // 10%
  const fator = 1 + (Math.random() * 2 - 1) * variacao; // entre 0.9 e 1.1
  return valor * fator;
}

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/previsoes");
        const data = await res.json();

        // Aplicar variação apenas para o time da casa
        const dataComVariacao = data.map((match) => ({
          ...match,
          probabilidades: {
            ...match.probabilidades,
            vitória_home: aplicarVariacao(match.probabilidades.vitória_home),
          },
        }));

        setMatches(dataComVariacao);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Carregando previsões...</p>;

  return (
    <div>
      <h1>Previsões de Confrontos</h1>
      {matches.map((match, idx) => (
        <div key={idx}>
          <h2>
            {match.home} vs {match.away}
          </h2>
          <p>
            Vitória {match.home}:{" "}
            {Math.round(match.probabilidades.vitória_home * 100)}%
          </p>
          <p>Empate: {Math.round(match.probabilidades.empate * 100)}%</p>
          <p>
            Vitória {match.away}:{" "}
            {Math.round(match.probabilidades.vitória_away * 100)}%
          </p>
        </div>
      ))}
    </div>
  );
}
