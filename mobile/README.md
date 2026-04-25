# Mobile bootstrap

Base inicial de Expo para iOS/Android dentro de `mobile/`.

## Qué incluye

- Expo Router como entry/navigation mínima
- pantalla Home alineada con el catálogo actual web
- estructura preparada para futuras migraciones en `src/screens`, `src/components`, `src/features`, `src/hooks`, `src/stores` y `src/utils`
- stores shared para stats, settings y parental controls
- wrapper base para feedback mobile con fallback de vibración y audio placeholder

## Qué queda deliberadamente pendiente

- storage durable real (hoy hay adapter en memoria para no agregar deps)
- PIN/biometría o adult gate real para parental controls
- audio nativo real y reporting remoto

## Próximo paso sugerido

Cuando toque validar esta base, sumar storage durable (`AsyncStorage` o alternativa Expo),
audio real y un mecanismo de desbloqueo adulto antes de migrar BeePath.
