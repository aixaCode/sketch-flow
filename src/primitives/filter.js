function assertFilterId(id) {
  if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(id)) {
    throw new TypeError('filter id must start with a letter and contain only letters, numbers, underscores or hyphens');
  }
}

function assertFilterOptions({ roughness, seed }) {
  if (!Number.isFinite(roughness) || roughness < 0) {
    throw new TypeError('roughness must be zero or greater');
  }
  if (!Number.isInteger(seed) || seed < 0) {
    throw new TypeError('seed must be a non-negative integer');
  }
}

export function renderRoughFilter({ id, roughness = 5, seed = 42 } = {}) {
  assertFilterId(id);
  assertFilterOptions({ roughness, seed });

  return `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" seed="${seed}" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="${roughness}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
}

export function createRoughFilter(document, options) {
  if (!document || typeof document.createElementNS !== 'function') {
    throw new TypeError('createRoughFilter requires a DOM document');
  }

  const namespace = 'http://www.w3.org/2000/svg';
  const { id, roughness = 5, seed = 42 } = options ?? {};
  assertFilterId(id);
  assertFilterOptions({ roughness, seed });

  const filter = document.createElementNS(namespace, 'filter');
  filter.setAttribute('id', id);
  filter.setAttribute('x', '-5%');
  filter.setAttribute('y', '-5%');
  filter.setAttribute('width', '110%');
  filter.setAttribute('height', '110%');

  const turbulence = document.createElementNS(namespace, 'feTurbulence');
  turbulence.setAttribute('type', 'fractalNoise');
  turbulence.setAttribute('baseFrequency', '0.05');
  turbulence.setAttribute('seed', String(seed));
  turbulence.setAttribute('result', 'noise');

  const displacement = document.createElementNS(namespace, 'feDisplacementMap');
  displacement.setAttribute('in', 'SourceGraphic');
  displacement.setAttribute('in2', 'noise');
  displacement.setAttribute('scale', String(roughness));
  displacement.setAttribute('xChannelSelector', 'R');
  displacement.setAttribute('yChannelSelector', 'G');

  filter.append(turbulence, displacement);
  return filter;
}
