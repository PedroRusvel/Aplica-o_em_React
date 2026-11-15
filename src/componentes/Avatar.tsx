interface AvatarProps {
  nome: string;
}

const CORES = ['#0e5a5a', '#8a4b08', '#3f4f9e', '#7a2e4d', '#2f6b2f', '#5b3f86'];

/** Foto ilustrativa gerada na hora (iniciais sobre uma cor), sem depender de imagem externa. */
export function Avatar({ nome }: AvatarProps) {
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('');
  const cor = CORES[nome.length % CORES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="${cor}"/><text x="40" y="51" font-size="30" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${iniciais}</text></svg>`;
  return <img className="avatar" width={64} height={64} src={`data:image/svg+xml,${encodeURIComponent(svg)}`} alt={`Foto ilustrativa de ${nome}`} />;
}
