import * as migration_20260226_072942 from './20260226_072942';
import * as migration_20260227_182730 from './20260227_182730';

export const migrations = [
  {
    up: migration_20260226_072942.up,
    down: migration_20260226_072942.down,
    name: '20260226_072942',
  },
  {
    up: migration_20260227_182730.up,
    down: migration_20260227_182730.down,
    name: '20260227_182730'
  },
];
