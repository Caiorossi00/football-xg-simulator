# Previsão de Confrontos de Futebol com xG/xGA

Uma aplicação para calcular **probabilidades de vitória, empate e derrota** em partidas de futebol usando métricas avançadas **xG (Expected Goals)** e **xGA (Expected Goals Against)** combinadas com a **distribuição de Poisson**.

O backend utiliza dados mock e o frontend exibe os confrontos e probabilidades de forma dinâmica.

## Métricas Utilizadas

### xG — Expected Goals
Mede a quantidade de gols que um time “deveria” marcar com base na qualidade e posição de suas finalizações.

### xGA — Expected Goals Against
Mede a quantidade de gols que um time “deveria” sofrer com base nas finalizações do adversário.

**Justificativa:**
- Avalia o desempenho real de ataque e defesa de cada time.
- Corrige distorções de resultados brutos.
- Exemplo: um time perde por 1x0, mas teve 3 xG contra 0.5 xG do adversário — o modelo reconhece que perdeu apesar de ter sido estatisticamente superior.

## Cálculo de Probabilidades

Para cada confronto:

1. **Gols esperados ajustados para a partida:**

\[
\lambda_\text{home} = \frac{xG_\text{home} + xGA_\text{away}}{2}, \quad
\lambda_\text{away} = \frac{xG_\text{away} + xGA_\text{home}}{2}
\]

- Mantém a distinção casa vs visitante, refletindo vantagem de jogar em casa.

2. **Distribuição de Poisson:**

\[
P(k \text{ gols}) = \frac{\lambda^k e^{-\lambda}}{k!}
\]

- Calcula a probabilidade de cada placar até um limite (ex.: 5 gols).  
- Soma para determinar: vitória do time da casa, empate ou vitória do visitante.

## Justificativa do Fator Casa

- **Vantagem estatística:** times em casa têm mais posse, finalizações e maior taxa de conversão.  
- **Ataque x defesa realistas:** `lambda_home` combina ataque do time da casa com defesa do visitante e vice-versa.  
- **Maior precisão:** média simétrica ignora essa vantagem e gera previsões menos confiáveis.

## Limitações do Modelo

- **Predominância de favoritos:** times com xG alto e xGA baixo tendem a aparecer “invencíveis”.  
- **Ignora fatores externos:** lesões, clima, motivação, arbitragens.  
- **Determinístico:** pequenas diferenças em xG/xGA podem gerar grandes diferenças nas probabilidades.  
- **Distribuição de Poisson:** assume gols independentes e taxa constante, sem capturar momentum ou ajustes táticos.

**Mitigações:**
- Combinar métricas adicionais: finalizações, posse de bola, forma recente.  
- Normalizar xG/xGA para evitar extremos.

## Tecnologias

- **Frontend:** React/Next.js  
- **Backend:** Next.js API Routes  
- **Estatística:** Distribuição de Poisson aplicada a métricas xG/xGA

## Uso

- Frontend consome o endpoint `/api/previsoes`.  
- Backend retorna todos os confrontos possíveis entre os times definidos em mock com probabilidades calculadas.
