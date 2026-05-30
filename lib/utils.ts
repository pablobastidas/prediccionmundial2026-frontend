export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

export const formatMatchDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getResultText = (home: number, away: number) => {
  if (home > away) return 'Gana Local';
  if (home < away) return 'Gana Visitante';
  return 'Empate';
};

export const getMatchStatus = (datetime: string) => {
  const now = new Date();
  const matchDate = new Date(datetime);
  if (now < matchDate) return 'Por jugar';
  return 'Finalizado'; // Simplified
};
